import { checkSchema } from 'express-validator'
import usersService from 'services/users.services'
import { validate } from '~/utils/validation'
export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: true,
      isLength: {
        options: {
          min: 1,
          max: 255
        }
      },
      trim: true
    },
    email: {
      notEmpty: true,
      isEmail: true,
      trim: true,
      custom: {
        options: async (value) => {
          const isExistsEmail = await usersService.checkEmail(value)
          if (isExistsEmail) {
            throw new Error('Email already exists !')
          }
          return true
        }
      }
    },
    password: {
      notEmpty: true,
      isString: true,
      trim: true,
      isLength: {
        options: {
          min: 6,
          max: 50
        }
      },
      isStrongPassword: {
        options: {
          minLowercase: 1,
          minNumbers: 1,
          minLength: 1,
          minUppercase: 1,
          minSymbols: 1
        },
        errorMessage:
          'Password must contain at least 1 lowercase, 1 uppercase, 1 number, 1 symbol and be at least 8 characters long'
      }
    },
    confirm_password: {
      notEmpty: true,
      isString: true,
      trim: true,
      isLength: {
        options: {
          min: 6,
          max: 50
        }
      },
      isStrongPassword: {
        options: {
          minLowercase: 1,
          minNumbers: 1,
          minLength: 1,
          minUppercase: 1,
          minSymbols: 1
        },
        errorMessage:
          'Password must contain at least 1 lowercase, 1 uppercase, 1 number, 1 symbol and be at least 8 characters long'
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Passwords do not match')
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
        }
      }
    }
  })
)
