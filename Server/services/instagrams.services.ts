import Instagrams from '~/models/schemas/Instagrams.schema'
import { InstagramsRequestBody } from '../src/models/requestes/Instagrams.requests'
import databaseService from './database.services'
import { ObjectId, WithId } from 'mongodb'
import Hashtags from '~/models/schemas/Hashtags.schema'
import { InstagramsType } from '~/constants/enum'
import { TokenPayload } from '~/models/requestes/User.requests'

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
    const result = await databaseService.instagrams.insertOne(
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
    const InstagramsResult = await databaseService.instagrams.findOne({ _id: result.insertedId })
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
        projection: { user_view: 1, guest_view: 1, updated_at: 1 }
      }
    )
    return result
  }

  async getInstagramsChildrent({
    instagrams_id,
    instagrams_type,
    limit,
    page,
    user_id
  }: {
    instagrams_id: string
    instagrams_type: InstagramsType
    limit: number
    page: number
    user_id?: string
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

    const ids = Instagrams.map((instagram) => instagram._id as ObjectId)
    const inc = user_id ? { user_view: 1 } : { guest_view: 1 }

    const [, total] = await Promise.all([
      databaseService.instagrams.updateMany(
        {
          _id: {
            $in: ids
          }
        },
        {
          $inc: inc,
          $set: {
            updated_at: new Date()
          }
        }
      ),
      databaseService.instagrams.countDocuments({
        parent_id: new ObjectId(instagrams_id),
        type: instagrams_type
      })
    ])

    Instagrams.forEach((instagram) => {
      instagram.updated_at = new Date()
      if (user_id) {
        instagram.user_view += 1
      } else {
        instagram.guest_view += 1
      }
    })

    return {
      Instagrams,
      total
    }
  }

  async getNewFeed({ user_id, limit, page }: { user_id: TokenPayload; limit: number; page: number }) {
    const user_id_object = new ObjectId(user_id.user_id)
    const follower_user_ids = await databaseService.followers
      .find(
        {
          user_id: user_id_object
        },
        {
          projection: {
            follow_user_id: 1,
            _id: 0
          }
        }
      )
      .toArray()
    const ids = follower_user_ids.map((follower) => follower.follow_user_id)
    ids.push(user_id_object)

    const [Instagrams, total] = await Promise.all([
      databaseService.instagrams
        .aggregate<Instagrams>([
          {
            $match: {
              user_id: {
                $in: ids
              }
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user'
            }
          },
          {
            $unwind: {
              path: '$user'
            }
          },
          {
            $match: {
              $or: [
                {
                  audiance: 0
                },
                {
                  $and: [
                    {
                      audiance: 1
                    },
                    {
                      'user.instagrams_circle': {
                        $in: [user_id_object]
                      }
                    }
                  ]
                }
              ]
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
              instagrams_children: 0,
              user: {
                password: 0,
                email_verify_token: 0,
                forgot_password_token: 0,
                instagrams_circle: 0,
                bio: 0,
                location: 0,
                website: 0,
                verify: 0,
                cover_photo: 0,
                date_of_birth: 0,
                created_at: 0,
                updated_at: 0
              }
            }
          },
          {
            $skip: limit * (page - 1)
          },
          {
            $limit: limit
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
        .toArray(),
      databaseService.instagrams
        .aggregate([
          {
            $match: {
              user_id: {
                $in: ids
              }
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user'
            }
          },
          {
            $unwind: {
              path: '$user'
            }
          },
          {
            $match: {
              $or: [
                {
                  audiance: 0
                },
                {
                  $and: [
                    {
                      audiance: 1
                    },
                    {
                      'user.instagrams_circle': {
                        $in: [user_id_object]
                      }
                    }
                  ]
                }
              ]
            }
          },
          {
            $count: 'total'
          }
        ])
        .toArray()
    ])

    const InstagramsId = Instagrams.map((instagram) => instagram._id as ObjectId)
    await databaseService.instagrams.updateMany(
      {
        _id: {
          $in: InstagramsId
        }
      },
      {
        $inc: { user_view: 1 },
        $set: {
          updated_at: new Date()
        }
      }
    )

    Instagrams.forEach((instagram) => {
      instagram.updated_at = new Date()
      instagram.user_view += 1
    })

    return {
      Instagrams,
      total: total[0].total
    }
  }
}

const instagramsService = new InstagramsService()

export default instagramsService
