import { checkSchema } from 'express-validator'
import { PeopleFollow } from '~/constants/enum'
import { SearchMessgaes } from '~/constants/messages'
import { validate } from '~/utils/validation'
export const searchValidator = validate(
  checkSchema(
    {
      content: {
        isString: {
          errorMessage: SearchMessgaes.CONTENT_MUST_BE_STRING
        }
      },
      people_follow: {
        optional: true,
        isIn: {
          options: [Object.values(PeopleFollow)],
          errorMessage: SearchMessgaes.PEOPLE_FOLLOW_MUST_BE_0_OR_1
        }
      }
    },
    ['query']
  )
)
