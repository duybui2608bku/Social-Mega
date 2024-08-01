import Instagrams from '~/models/schemas/Instagrams.schema'
import { InstagramsRequestBody } from '../src/models/requestes/Instagrams.requests'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'

class InstagramsService {
  async createInstagram(user_id: string, body: InstagramsRequestBody) {
    const result = databaseService.instagrams.insertOne(
      new Instagrams({
        audiance: body.audiance,
        content: body.content,
        hashtags: [],
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
}

const instagramsService = new InstagramsService()

export default instagramsService
