import Instagrams from '~/models/schemas/Instagrams.schema'
import { InstagramsRequestBody } from '../src/models/requestes/Instagrams.requests'
import databaseService from './database.services'
import { ObjectId, WithId } from 'mongodb'
import Hashtags from '~/models/schemas/Hashtags.schema'
import { InstagramsType } from '~/constants/enum'

class InstagramsService {
  async checkAndCreateHashtags(hashtags: string[]) {
    const hashtagsDocument = Promise.all(
      hashtags.map((hashtag) => {
        return databaseService.hashtags.findOneAndUpdate(
          { name: hashtag },
          { $setOnInsert: new Hashtags({ name: hashtag }) },
          { upsert: true, returnDocument: 'after' }
        )
      })
    )
    return (await hashtagsDocument).map((hashtag) => (hashtag as WithId<Hashtags>)._id)
  }
  async createInstagram(user_id: string, body: InstagramsRequestBody) {
    const hashtags = await this.checkAndCreateHashtags(body.hashtags)
    console.log(hashtags)
    const result = databaseService.instagrams.insertOne(
      new Instagrams({
        audiance: body.audiance,
        content: body.content,
        hashtags,
        mentions: body.mentions,
        medias: body.medias,
        parent_id: body.parent_id,
        type: body.type,
        user_id: new ObjectId(user_id)
      })
    )
    const InstagramsResult = await databaseService.instagrams.findOne({ _id: (await result).insertedId })
    return InstagramsResult
  }

  async increaseView(instagrams_id: string, user_id?: string) {
    const inc = user_id ? { user_view: 1 } : { guest_view: 1 }

    const result = await databaseService.instagrams.findOneAndUpdate(
      {
        _id: new ObjectId(instagrams_id)
      },
      {
        $inc: inc,
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after',
        projection: { user_view: 1, guest_view: 1 }
      }
    )
    return result
  }

  async getInstagramsChildrent({
    instagrams_id,
    instagrams_type,
    limit,
    page
  }: {
    instagrams_id: string
    instagrams_type: InstagramsType
    limit: number
    page: number
  }) {
    const Instagrams = await databaseService.instagrams
      .aggregate<Instagrams>([
        {
          $match: {
            parent_id: new ObjectId(instagrams_id),
            type: instagrams_type
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
            },
            views: {
              $add: ['$user_view', '$guest_view']
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
        },
        {
          $skip: limit * (page - 1)
        },
        {
          $limit: limit
        }
      ])
      .toArray()
    const total = await databaseService.instagrams.countDocuments({
      parent_id: new ObjectId(instagrams_id),
      type: instagrams_type
    })
    return {
      Instagrams,
      total
    }
  }
}

const instagramsService = new InstagramsService()

export default instagramsService
