import { checkSchema } from 'express-validator'
import { has } from 'lodash'
import databaseService from 'services/database.services'
import usersService from 'services/users.services'
import { HttpStatusCode } from '~/constants/enum'
import { userMessages } from '~/constants/messages'
import { ErrorWithStatusCode } from '~/models/Errors'
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

export const logoutValidator = validate(
  checkSchema(
    {
      Authorization: {
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatusCode({
                message: userMessages.ACCESS_TOKEN_REQUIRED,
                statusCode: HttpStatusCode.Unauthorized
              })
            }
            const access_token = value.split(' ')[1]
            if (!access_token) {
              throw new ErrorWithStatusCode({
                message: userMessages.ACCESS_TOKEN_REQUIRED,
                statusCode: HttpStatusCode.Unauthorized
              })
            }
            const decodeAuthorization = await verifyToken({ token: access_token })
            req.decodeAuthorization = decodeAuthorization
            return true
          }
        }
      }
    },
    ['headers']
  )
)
