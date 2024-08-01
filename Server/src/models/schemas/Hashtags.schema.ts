import { ObjectId } from 'mongodb'

interface HashtagsType {
  _id?: ObjectId
  name: string
  created_at?: Date
}

export default class Hashtags {
  _id?: ObjectId
  name: string
  created_at: Date
  constructor({ _id, name, created_at }: HashtagsType) {
    this._id = _id || new ObjectId()
    this.name = name
    this.created_at = created_at || new Date()
  }
}
