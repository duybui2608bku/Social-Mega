import { checkSchema } from 'express-validator'
import { isEmpty } from 'lodash'
import { ObjectId } from 'mongodb'
import databaseService from 'services/database.services'
import { HttpStatusCode, InstagramsAudiance, InstagramsType, MediaType } from '~/constants/enum'
import { InstagramsMessgaes } from '~/constants/messages'
import { ErrorWithStatusCode } from '~/models/Errors'
import { numberEnumToArr } from '~/utils/other'
import { validate } from '~/utils/validation'
const InstagramsTypes = numberEnumToArr(InstagramsType)
const InstagramsAudiances = numberEnumToArr(InstagramsAudiance)
const mediaType = numberEnumToArr(MediaType)

export const createInstagramsValidator = validate(
  checkSchema(
    {
      type: {
        isIn: {
          options: [InstagramsTypes],
          errorMessage: InstagramsMessgaes.INSTAGRAMS_TYPE_INVALID
        }
      },
      audiance: {
        isIn: {
          options: [InstagramsAudiances],
          errorMessage: InstagramsMessgaes.INSTAGRAMS_AUDIANCE_INVALID
        }
      },
      parent_id: {
        custom: {
          options: (value, { req }) => {
            const type = req.body.type as InstagramsType
            if (
              [InstagramsType.ReInstagrams, InstagramsType.Comment, InstagramsType.QuoteInstagrams].includes(type) &&
              !ObjectId.isValid(value)
            ) {
              throw new Error(InstagramsMessgaes.PARENT_ID_MUST_BE_INSTAGRAMS_ID)
            }
            if (type === InstagramsType.Instagrams && value !== null) {
              throw new Error(InstagramsMessgaes.PARENT_ID_MUST_BE_NULL)
            }
            return true
          }
        }
      },
      content: {
        isString: true,
        custom: {
          options: (value, { req }) => {
            const type = req.body.type as InstagramsType
            const hashtags = req.body.hashtags as string[]
            const mentions = req.body.mentions as string[]
            if (
              [InstagramsType.Comment, InstagramsType.QuoteInstagrams, InstagramsType.Instagrams].includes(type) &&
              isEmpty(mentions) &&
              isEmpty(hashtags) &&
              value === ''
            ) {
              throw new Error(InstagramsMessgaes.CONTENT_MUST_BE_NON_EMPTY_STRING)
            }
            if (type === InstagramsType.ReInstagrams && value !== '') {
              throw new Error(InstagramsMessgaes.CONTENT_MUST_BE_EMPTY_STRING)
            }
            return true
          }
        }
      },
      hashtags: {
        isArray: true,
        custom: {
          options: (value, { req }) => {
            if (!value.every((item: any) => typeof item === 'string')) {
              throw new Error(InstagramsMessgaes.HASHTAGS_MUST_BE_AN_ARRAY_OF_STRING)
            }
            return true
          }
        }
      },
      mentions: {
        isArray: true,
        custom: {
          options: (value) => {
            if (!value.every((item: any) => ObjectId.isValid(item))) {
              throw new Error(InstagramsMessgaes.MENTIONS_MUST_BE_AN_ARRAY_OF_USER_ID)
            }
            return true
          }
        }
      },
      medias: {
        isArray: true,
        custom: {
          options: (value, { req }) => {
            if (
              value.some((item: any) => {
                return typeof item.url !== 'string' || !mediaType.includes(item.type)
              })
            ) {
              throw new Error(InstagramsMessgaes.MEDIA_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const instagramsIDValidator = validate(
  checkSchema(
    {
      instagram_id: {
        custom: {
          options: async (value) => {
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatusCode({
                statusCode: HttpStatusCode.BadRequest,
                message: InstagramsMessgaes.INVALID_INSTAGRAMS_ID
              })
            }
            const Intagram = await databaseService.instagrams.findOne({ _id: new ObjectId(value) })
            if (!Intagram) {
              throw new ErrorWithStatusCode({
                statusCode: HttpStatusCode.NotFound,
                message: InstagramsMessgaes.INSTAGRAMS_ID_NOT_FOUND
              })
            }
            return true
          }
        }
      }
    },
    ['params', 'body']
  )
)
