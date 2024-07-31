import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import { ObjectId } from 'mongodb'
import databaseService from 'services/database.services'
import usersService from 'services/users.services'
import { HttpStatusCode, UserVerifyStatus } from '~/constants/enum'
import { userMessages } from '~/constants/messages'
import { REGEX_USER_NAME } from '~/constants/regex'
import { ErrorWithStatusCode } from '~/models/Errors'
import { TokenPayload } from '~/models/requestes/User.requests'
import { hashPassword } from '~/utils/crypro'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: {
          errorMessage: userMessages.EMAIL_INVALID
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({
              email: value,
              password: hashPassword(req.body.password)
            })
            if (user === null) {
              throw new Error(userMessages.USER_NOT_FOUND)
            }
            req.user = user
            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: userMessages.PASSWORD_REQUIRED
        },
        isString: {
          errorMessage: userMessages.PASSWORD_MUST_BE_STRING
        },
        trim: true,
        isLength: {
          options: {
            min: 6,
            max: 50
          },
          errorMessage: userMessages.PASSWORD_MUST_BE_STRONG
        },
        isStrongPassword: {
          options: {
            minLowercase: 1,
            minNumbers: 1,
            minLength: 1,
            minUppercase: 1,
            minSymbols: 1
          },
          errorMessage: userMessages.PASSWORD_MUST_BE_STRONG
        }
      }
    },
    ['body']
  )
)

export const registerValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: userMessages.NAME_REQUIRED
        },
        isString: {
          errorMessage: userMessages.NAME_MUST_BE_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 255
          },
          errorMessage: userMessages.NAME_LENGTH
        },
        trim: true
      },
      email: {
        notEmpty: {
          errorMessage: userMessages.EMAIL_REQUIRED
        },
        isEmail: {
          errorMessage: userMessages.EMAIL_INVALID
        },
        trim: true,
        custom: {
          options: async (value) => {
            const isExistsEmail = await usersService.checkEmail(value)
            if (isExistsEmail) {
              throw new Error(userMessages.EMAIL_EXISTS)
            }
            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: userMessages.PASSWORD_REQUIRED
        },
        isString: {
          errorMessage: userMessages.PASSWORD_MUST_BE_STRING
        },
        trim: true,
        isLength: {
          options: {
            min: 6,
            max: 50
          },
          errorMessage: userMessages.PASSWORD_MUST_BE_STRONG
        },
        isStrongPassword: {
          options: {
            minLowercase: 1,
            minNumbers: 1,
            minLength: 1,
            minUppercase: 1,
            minSymbols: 1
          },
          errorMessage: userMessages.PASSWORD_MUST_BE_STRONG
        }
      },
      confirm_password: {
        notEmpty: {
          errorMessage: userMessages.CONFIRM_PASSWORD_REQUIRED
        },
        isString: {
          errorMessage: userMessages.CONFIRM_PASSWORD_MUST_BE_STRING
        },
        trim: true,
        isLength: {
          options: {
            min: 6,
            max: 50
          },
          errorMessage: userMessages.CONFIRM_PASSWORD_MUST_BE_STRONG
        },
        isStrongPassword: {
          options: {
            minLowercase: 1,
            minNumbers: 1,
            minLength: 1,
            minUppercase: 1,
            minSymbols: 1
          },
          errorMessage: userMessages.CONFIRM_PASSWORD_MUST_BE_STRONG
        },
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.password) {
              throw new Error(userMessages.PASSWORDS_NOT_MATCH)
            } else {
              return value
            }
          }
        }
      },
      date_of_birth: {
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          },
          errorMessage: userMessages.DATE_OF_BIRTH_INVALID
        }
      }
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        custom: {
          options: async (value: string, { req }) => {
            const access_token = (value || '').split(' ')[1]
            if (!access_token) {
              throw new ErrorWithStatusCode({
                message: userMessages.ACCESS_TOKEN_REQUIRED,
                statusCode: HttpStatusCode.Unauthorized
              })
            }
            try {
              const decode_authorization = await verifyToken({
                token: access_token,
                secretOrPublicKey: process.env.JWT_SECRET_ACCESSTOKEN as string
              })
              req.decode_authorization = decode_authorization
            } catch (error) {
              throw new ErrorWithStatusCode({
                message: capitalize((error as JsonWebTokenError).message),
                statusCode: HttpStatusCode.Unauthorized
              })
            }
            return true
          }
        }
      }
    },
    ['headers']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatusCode({
                message: userMessages.REFRESH_TOKEN_REQUIRED,
                statusCode: HttpStatusCode.Unauthorized
              })
            }
            try {
              const [decoded_refresh_token, refresh_token] = await Promise.all([
                verifyToken({ token: value, secretOrPublicKey: process.env.JWT_SECRET_REFRESHTOKEN as string }),
                databaseService.refreshTokens.findOne({ token: value })
              ])

              if (refresh_token === null) {
                throw new ErrorWithStatusCode({
                  message: userMessages.USED_REFRESH_TOKEN_OR_NOT_EXISTS,
                  statusCode: HttpStatusCode.Unauthorized
                })
              }
              req.decoded_refresh_token = decoded_refresh_token
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatusCode({
                  message: capitalize((error as JsonWebTokenError).message),
                  statusCode: HttpStatusCode.Unauthorized
                })
              }
              throw error
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const emailVerifyValidator = validate(
  checkSchema(
    {
      email_verify_token: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatusCode({
                message: userMessages.EMAIL_VERIFY_TOKEN_REQUIRED,
                statusCode: HttpStatusCode.Unauthorized
              })
            }

            try {
              const decoded_email_verify_token = await verifyToken({
                token: value,
                secretOrPublicKey: process.env.JWT_SECRET_EMAIL_VERIFYTOKEN as string
              })
              req.decoded_email_verify_token = decoded_email_verify_token
            } catch (error) {
              throw new ErrorWithStatusCode({
                message: capitalize((error as JsonWebTokenError).message),
                statusCode: HttpStatusCode.Unauthorized
              })
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const forgotPasswordValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: {
          errorMessage: userMessages.EMAIL_INVALID
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({
              email: value
            })
            if (user === null) {
              throw new Error(userMessages.USER_NOT_FOUND)
            }
            req.user = user
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const verifyForgotPasswordValidator = validate(
  checkSchema(
    {
      forgot_password_token: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatusCode({
                message: userMessages.FORGOT_PASSWORD_TOKEN_REQUIRED,
                statusCode: HttpStatusCode.Unauthorized
              })
            }

            try {
              const decoded_forgot_password_token = await verifyToken({
                token: value,
                secretOrPublicKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string
              })
              const { user_id } = decoded_forgot_password_token
              const user = await databaseService.users.findOne({
                _id: new ObjectId(user_id)
              })
              if (user === null) {
                throw new ErrorWithStatusCode({
                  message: userMessages.USER_NOT_FOUND,
                  statusCode: HttpStatusCode.Unauthorized
                })
              }
              if (user.forgot_password_token !== value) {
                throw new ErrorWithStatusCode({
                  message: userMessages.REFRESH_TOKEN_INVALID,
                  statusCode: HttpStatusCode.Unauthorized
                })
              }
            } catch (error) {
              throw new ErrorWithStatusCode({
                message: capitalize((error as JsonWebTokenError).message),
                statusCode: HttpStatusCode.Unauthorized
              })
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const resetPasswordValidator = validate(
  checkSchema({
    password: {
      notEmpty: {
        errorMessage: userMessages.PASSWORD_REQUIRED
      },
      isString: {
        errorMessage: userMessages.PASSWORD_MUST_BE_STRING
      },
      trim: true,
      isLength: {
        options: {
          min: 6,
          max: 50
        },
        errorMessage: userMessages.PASSWORD_MUST_BE_STRONG
      },
      isStrongPassword: {
        options: {
          minLowercase: 1,
          minNumbers: 1,
          minLength: 1,
          minUppercase: 1,
          minSymbols: 1
        },
        errorMessage: userMessages.PASSWORD_MUST_BE_STRONG
      }
    },
    confirm_password: {
      notEmpty: {
        errorMessage: userMessages.CONFIRM_PASSWORD_REQUIRED
      },
      isString: {
        errorMessage: userMessages.CONFIRM_PASSWORD_MUST_BE_STRING
      },
      trim: true,
      isLength: {
        options: {
          min: 6,
          max: 50
        },
        errorMessage: userMessages.CONFIRM_PASSWORD_MUST_BE_STRONG
      },
      isStrongPassword: {
        options: {
          minLowercase: 1,
          minNumbers: 1,
          minLength: 1,
          minUppercase: 1,
          minSymbols: 1
        },
        errorMessage: userMessages.CONFIRM_PASSWORD_MUST_BE_STRONG
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error(userMessages.PASSWORDS_NOT_MATCH)
          } else {
            return value
          }
        }
      }
    },
    forgot_password_token: {
      trim: true,
      custom: {
        options: async (value: string, { req }) => {
          if (!value) {
            throw new ErrorWithStatusCode({
              message: userMessages.FORGOT_PASSWORD_TOKEN_REQUIRED,
              statusCode: HttpStatusCode.Unauthorized
            })
          }

          try {
            const decoded_forgot_password_token = await verifyToken({
              token: value,
              secretOrPublicKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string
            })
            const { user_id } = decoded_forgot_password_token
            const user = await databaseService.users.findOne({
              _id: new ObjectId(user_id)
            })
            if (user === null) {
              throw new ErrorWithStatusCode({
                message: userMessages.USER_NOT_FOUND,
                statusCode: HttpStatusCode.Unauthorized
              })
            }
            if (user.forgot_password_token !== value) {
              throw new ErrorWithStatusCode({
                message: userMessages.REFRESH_TOKEN_INVALID,
                statusCode: HttpStatusCode.Unauthorized
              })
            }
            req.decoded_forgot_password_token = decoded_forgot_password_token
          } catch (error) {
            throw new ErrorWithStatusCode({
              message: capitalize((error as JsonWebTokenError).message),
              statusCode: HttpStatusCode.Unauthorized
            })
          }
          return true
        }
      }
    }
  })
)

export const changePasswordValidator = validate(
  checkSchema({
    old_password: {
      notEmpty: {
        errorMessage: userMessages.PASSWORD_REQUIRED
      },
      isString: {
        errorMessage: userMessages.PASSWORD_MUST_BE_STRING
      },
      trim: true,
      isLength: {
        options: {
          min: 6,
          max: 50
        },
        errorMessage: userMessages.PASSWORD_MUST_BE_STRONG
      },
      isStrongPassword: {
        options: {
          minLowercase: 1,
          minNumbers: 1,
          minLength: 1,
          minUppercase: 1,
          minSymbols: 1
        },
        errorMessage: userMessages.PASSWORD_MUST_BE_STRONG
      },
      custom: {
        options: async (value, { req }) => {
          const { user_id } = req.decode_authorization as TokenPayload
          const user = await databaseService.users.findOne({
            _id: new ObjectId(user_id)
          })
          if (user === null) {
            throw new Error(userMessages.USER_NOT_FOUND)
          }
          const { password } = user
          if (password !== hashPassword(value)) {
            throw new ErrorWithStatusCode({
              message: userMessages.OLD_PASSWORD_NOT_MATCH,
              statusCode: HttpStatusCode.Unauthorized
            })
          }
          return true
        }
      }
    },
    password: {
      notEmpty: {
        errorMessage: userMessages.PASSWORD_REQUIRED
      },
      isString: {
        errorMessage: userMessages.PASSWORD_MUST_BE_STRING
      },
      trim: true,
      isLength: {
        options: {
          min: 6,
          max: 50
        },
        errorMessage: userMessages.PASSWORD_MUST_BE_STRONG
      },
      isStrongPassword: {
        options: {
          minLowercase: 1,
          minNumbers: 1,
          minLength: 1,
          minUppercase: 1,
          minSymbols: 1
        },
        errorMessage: userMessages.PASSWORD_MUST_BE_STRONG
      }
    },
    confirm_password: {
      notEmpty: {
        errorMessage: userMessages.CONFIRM_PASSWORD_REQUIRED
      },
      isString: {
        errorMessage: userMessages.CONFIRM_PASSWORD_MUST_BE_STRING
      },
      trim: true,
      isLength: {
        options: {
          min: 6,
          max: 50
        },
        errorMessage: userMessages.CONFIRM_PASSWORD_MUST_BE_STRONG
      },
      isStrongPassword: {
        options: {
          minLowercase: 1,
          minNumbers: 1,
          minLength: 1,
          minUppercase: 1,
          minSymbols: 1
        },
        errorMessage: userMessages.CONFIRM_PASSWORD_MUST_BE_STRONG
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error(userMessages.PASSWORDS_NOT_MATCH)
          } else {
            return value
          }
        }
      }
    }
  })
)

export const verifiedUserValidator = async (req: Request, res: Response, next: NextFunction) => {
  const { verify } = req.decode_authorization as TokenPayload
  if (verify !== UserVerifyStatus.Verified) {
    return next(
      new ErrorWithStatusCode({
        message: userMessages.USER_NOT_VERIFIED,
        statusCode: HttpStatusCode.Forbidden
      })
    )
  }
  next()
}

export const updateMevValidator = validate(
  checkSchema(
    {
      name: {
        optional: true,
        isString: {
          errorMessage: userMessages.NAME_MUST_BE_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 255
          },
          errorMessage: userMessages.NAME_LENGTH
        },
        custom: {
          options: async (value: string) => {
            if (!REGEX_USER_NAME.test(value)) {
              throw new Error(userMessages.USER_NAME_INVALID)
            }
            const user = await databaseService.users.findOne({
              name: value
            })
            if (user && user.name !== value) {
              throw new Error(userMessages.USER_NAME_EXISTS)
            }
          }
        },
        trim: true
      },
      date_of_birth: {
        optional: true,
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          },
          errorMessage: userMessages.DATE_OF_BIRTH_INVALID
        }
      },
      bio: {
        optional: true,
        isString: {
          errorMessage: userMessages.BIO_MUST_BE_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 160
          },
          errorMessage: userMessages.BIO_LENGTH
        },
        trim: true
      },
      website: {
        optional: true,
        isString: {
          errorMessage: userMessages.WEBSITE_MUST_BE_STRING
        },
        isURL: {
          errorMessage: userMessages.WEBSITE_INVALID
        },
        isLength: {
          options: {
            min: 1,
            max: 255
          },
          errorMessage: userMessages.WEBSITE_LENGTH_ERROR
        },
        trim: true
      },
      location: {
        optional: true,
        isString: {
          errorMessage: userMessages.LOCATION_MUST_BE_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 255
          },
          errorMessage: userMessages.LOCATION_LENGTH
        },
        trim: true
      },
      avatar: {
        optional: true,
        isString: {
          errorMessage: userMessages.AVATAR_MUST_BE_STRING
        },
        isURL: {
          errorMessage: userMessages.AVATAR_INVALID
        },
        isLength: {
          options: {
            min: 1,
            max: 400
          },
          errorMessage: userMessages.AVATAR_LENGTH
        },
        trim: true
      },
      coverphoto: {
        optional: true,
        isString: {
          errorMessage: userMessages.COVER_MUST_BE_STRING
        },
        isURL: {
          errorMessage: userMessages.COVER_INVALID
        },
        isLength: {
          options: {
            min: 1,
            max: 400
          },
          errorMessage: userMessages.COVER_LENGTH
        },
        trim: true
      }
    },
    ['body']
  )
)

export const followerUserValidator = validate(
  checkSchema(
    {
      follow_user_id: {
        custom: {
          options: async (value: string) => {
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatusCode({
                message: userMessages.ID_FLLOW_USER_INVALID,
                statusCode: HttpStatusCode.NotFound
              })
            }
            const followerUser = await databaseService.users.findOne({
              _id: new ObjectId(value)
            })
            if (followerUser === null) {
              throw new ErrorWithStatusCode({
                message: userMessages.USER_NOT_FOUND,
                statusCode: HttpStatusCode.NotFound
              })
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const unfollowerUserValidator = validate(
  checkSchema(
    {
      unfollow_user_id: {
        custom: {
          options: async (value: string) => {
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatusCode({
                message: userMessages.ID_FLLOW_USER_INVALID,
                statusCode: HttpStatusCode.NotFound
              })
            }
            const followerUser = await databaseService.users.findOne({
              _id: new ObjectId(value)
            })
            if (followerUser === null) {
              throw new ErrorWithStatusCode({
                message: userMessages.USER_NOT_FOUND,
                statusCode: HttpStatusCode.NotFound
              })
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)
