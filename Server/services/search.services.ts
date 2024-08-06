import { ObjectId } from 'mongodb'
import databaseService from '../services/database.services'
import { InstagramsType, PeopleFollow } from '~/constants/enum'

class SearchServices {
  async search({
    limit,
    page,
    content,
    user_id,
    people_follow
  }: {
    limit: number
    page: number
    content: string
    user_id: string
    people_follow?: PeopleFollow
  }) {
    const $match: any = {
      $text: {
        $search: content
      }
    }

    if (people_follow && people_follow === PeopleFollow.Following) {
      const user_id_object = new ObjectId(user_id)
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
      $match['user_id'] = {
        $in: ids
      }
    }

    const [Instagrams, total] = await Promise.all([
      databaseService.instagrams
        .aggregate([
          {
            $match
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
                        $in: [new ObjectId(user_id)]
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
            $skip: (page - 1) * limit
          },
          {
            $limit: limit
          }
        ])
        .toArray(),
      databaseService.instagrams
        .aggregate([
          {
            $match
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
                        $in: [new ObjectId(user_id)]
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
      total: total.length > 0 ? total[0].total : 0
    }
  }

  async searchHashtags({ limit, page, hashtag }: { limit: number; page: number; hashtag: string }) {
    const [Instagrams, total] = await Promise.all([
      databaseService.hashtags
        .aggregate([
          {
            $match: {
              $text: {
                $search: hashtag
              }
            }
          },
          {
            $lookup: {
              from: 'instagrams',
              localField: '_id',
              foreignField: 'hashtags',
              as: 'instagrams'
            }
          },
          {
            $unwind: {
              path: '$instagrams'
            }
          },
          {
            $replaceRoot: {
              newRoot: '$instagrams'
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
            $addFields: {
              hashtags: {
                $map: {
                  input: '$hashtags',
                  as: 'hashtag',
                  in: {
                    name: '$$hashtag.name'
                  }
                }
              }
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
            $skip: (page - 1) * limit
          },
          {
            $limit: limit
          }
        ])
        .toArray(),
      databaseService.hashtags
        .aggregate([
          {
            $match: {
              $text: {
                $search: hashtag
              }
            }
          },
          {
            $lookup: {
              from: 'instagrams',
              localField: '_id',
              foreignField: 'hashtags',
              as: 'instagrams'
            }
          },
          {
            $unwind: {
              path: '$instagrams'
            }
          },
          {
            $replaceRoot: {
              newRoot: '$instagrams'
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
            $addFields: {
              hashtags: {
                $map: {
                  input: '$hashtags',
                  as: 'hashtag',
                  in: {
                    name: '$$hashtag.name'
                  }
                }
              }
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
      total: total.length > 0 ? total[0].total : 0
    }
  }

  async searchUsers(name: string) {
    const user = await databaseService.users
      .aggregate([
        {
          $match: {
            $text: {
              $search: name
            }
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            avatar: 1
          }
        }
      ])
      .toArray()
    return user
  }
}

const searchServices = new SearchServices()
export default searchServices
