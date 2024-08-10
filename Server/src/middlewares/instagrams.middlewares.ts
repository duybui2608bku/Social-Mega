import { checkSchema } from 'express-validator'
import { isEmpty } from 'lodash'
import { ObjectId } from 'mongodb'
import databaseService from 'services/database.services'
import { HttpStatusCode, InstagramsAudiance, InstagramsType, MediaType, UserVerifyStatus } from '~/constants/enum'
import { InstagramsMessgaes, userMessages } from '~/constants/messages'
import { ErrorWithStatusCode } from '~/models/Errors'
import { numberEnumToArr } from '~/utils/other'
import { validate } from '~/utils/validation'
import { NextFunction, Request, Response } from 'express'
import Instagrams from '~/models/schemas/Instagrams.schema'
import { TokenPayload } from '~/models/requestes/User.requests'
import { wrapRequestHandler } from '~/utils/handlers'
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
          options: (value) => {
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
          options: (value) => {
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
          options: async (value, { req }) => {
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatusCode({
                statusCode: HttpStatusCode.BadRequest,
                message: InstagramsMessgaes.INVALID_INSTAGRAMS_ID
              })
            }

            const Intagram = (
              await databaseService.instagrams
                .aggregate<Instagrams>([
                  {
                    $match: {
                      _id: new ObjectId(value as ObjectId)
                    }
                  },
                  {
                    $lookup: {
                      from: 'hashtags',
                      localField: 'hashtags',
                      foreignField: '_id',
                      as: 'hashtags'
                    }
                  },
                  {
                    $lookup: {
                      from: 'users',
                      localField: 'mentions',
                      foreignField: '_id',
                      as: 'mentions'
                    }
                  },
                  {
                    $addFields: {
                      mentions: {
                        $map: {
                          input: '$mentions',
                          as: 'mention',
                          in: {
                            _id: '$$mention._id',
                            name: '$$mention.name',
                            email: '$$mention.email'
                          }
                        }
                      }
                    }
                  },
                  {
                    $lookup: {
                      from: 'bookmarks',
                      localField: '_id',
                      foreignField: 'instagram_id',
                      as: 'bookmarks'
                    }
                  },
                  {
                    $lookup: {
                      from: 'like_instagrams',
                      localField: '_id',
                      foreignField: 'instagram_id',
                      as: 'like'
                    }
                  },
                  {
                    $lookup: {
                      from: 'instagrams',
                      localField: '_id',
                      foreignField: 'parent_id',
                      as: 'instagrams_children'
                    }
                  },
                  {
                    $addFields: {
                      like: {
                        $size: '$like'
                      },
                      bookmarks: {
                        $size: '$bookmarks'
                      },
                      reInstagrams: {
                        $size: {
                          $filter: {
                            input: '$instagrams_children',
                            as: 'item',
                            cond: {
                              $eq: ['$$item.type', InstagramsType.ReInstagrams]
                            }
                          }
                        }
                      },
                      commentInstagrams: {
                        $size: {
                          $filter: {
                            input: '$instagrams_children',
                            as: 'item',
                            cond: {
                              $eq: ['$$item.type', InstagramsType.Comment]
                            }
                          }
                        }
                      },
                      qouteInstagrams: {
                        $size: {
                          $filter: {
                            input: '$instagrams_children',
                            as: 'item',
                            cond: {
                              $eq: ['$$item.type', InstagramsType.QuoteInstagrams]
                            }
                          }
                        }
                      }
                    }
                  },
                  {
                    $project: {
                      instagrams_children: 0
                    }
                  },
                  {
                    $addFields: {
                      hashtags: {
                        $map: {
                          input: '$hashtags',
                          as: 'hashtag',
                          in: {
                            name: '$$hashtag.name',
                            _id: '$$hashtag._id'
                          }
                        }
                      }
                    }
                  }
                ])
                .toArray()
            )[0]

            if (!Intagram) {
              throw new ErrorWithStatusCode({
                statusCode: HttpStatusCode.NotFound,
                message: InstagramsMessgaes.INSTAGRAMS_ID_NOT_FOUND
              })
            }
            ;(req as Request).instagram = Intagram
            return true
          }
        }
      }
    },
    ['params', 'body']
  )
)

export const audienceValidator = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const instagram = req.instagram as Instagrams
  if (instagram.audiance === InstagramsAudiance.InstagramsCircle) {
    if (!req.decode_authorization) {
      throw new ErrorWithStatusCode({
        statusCode: HttpStatusCode.Unauthorized,
        message: userMessages.ACCESS_TOKEN_REQUIRED
      })
    }
  }
  const author = await databaseService.users.findOne({ _id: new ObjectId(instagram.user_id) })

  if (!author || author.verify === UserVerifyStatus.Banned) {
    throw new ErrorWithStatusCode({
      statusCode: HttpStatusCode.NotFound,
      message: userMessages.USER_NOT_FOUND
    })
  }
  const { user_id } = req.decode_authorization as TokenPayload
  const isIntagramsCircle = author.instagrams_circle.some((user_circle_id) => user_circle_id.equals(user_id))
  if (!isIntagramsCircle && !author._id.equals(new ObjectId(user_id))) {
    throw new ErrorWithStatusCode({
      statusCode: HttpStatusCode.Forbidden,
      message: InstagramsMessgaes.INSTAGRAMS_NOT_PUBLIC
    })
  }

  next()
})

export const getInstagramsChildrenValidator = validate(
  checkSchema(
    {
      instagrams_type: {
        isIn: {
          options: [InstagramsTypes],
          errorMessage: InstagramsMessgaes.INSTAGRAMS_TYPE_INVALID
        }
      }
    },
    ['query']
  )
)

export const paginatonValidator = validate(
  checkSchema(
    {
      limit: {
        isNumeric: true,
        custom: {
          options: (value) => {
            const num = Number(value)
            if (num > 100) {
              throw new Error(InstagramsMessgaes.LIMIT_MUST_BE_LESS_THAN_100)
            } else if (num < 1) {
              throw new Error(InstagramsMessgaes.LIMIT_MUST_BE_BIGGER_THAN_0)
            }
            return true
          }
        }
      },
      page: {
        isNumeric: true,
        custom: {
          options: (value) => {
            const num = Number(value)
            if (num < 1) {
              throw new Error(InstagramsMessgaes.PAGE_MUST_BE_BIGGER_THAN_0)
            }
            return true
          }
        }
      }
    },
    ['query']
  )
)
