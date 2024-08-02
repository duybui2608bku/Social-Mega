import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import { LikeInstagrams } from '../src/models/schemas/LikeInstagrams.chema'
class LikeInstagramsService {
  async likeInstagrams(user_id: string, instagram_id: string) {
    const result = await databaseService.likeInstagrams.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        instagram_id: new ObjectId(instagram_id)
      },
      {
        $setOnInsert: new LikeInstagrams({ user_id: new ObjectId(user_id), instagram_id: new ObjectId(instagram_id) })
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )

    return result
  }

  async unLikeInstagrams(user_id: string, instagram_id: string) {
    const result = await databaseService.likeInstagrams.findOneAndDelete({
      user_id: new ObjectId(user_id),
      instagram_id: new ObjectId(instagram_id)
    })
    return result
  }
}

const likeInstagramsService = new LikeInstagramsService()
export default likeInstagramsService
