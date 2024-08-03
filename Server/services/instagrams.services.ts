import Instagrams from '~/models/schemas/Instagrams.schema'
import { InstagramsRequestBody } from '../src/models/requestes/Instagrams.requests'
import databaseService from './database.services'
import { ObjectId, WithId } from 'mongodb'
import Hashtags from '~/models/schemas/Hashtags.schema'

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
}

const instagramsService = new InstagramsService()

export default instagramsService
