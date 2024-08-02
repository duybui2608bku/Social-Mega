import { ObjectId } from 'mongodb'

interface LikeInstagramsType {
  _id?: ObjectId
  user_id: ObjectId
  instagram_id: ObjectId
  created_at?: Date
}

export class LikeInstagrams {
  _id?: ObjectId
  user_id: ObjectId
  instagram_id: ObjectId
  created_at?: Date
  constructor({ _id, user_id, instagram_id, created_at }: LikeInstagramsType) {
    this._id = _id || new ObjectId()
    this.user_id = user_id
    this.instagram_id = instagram_id
    this.created_at = created_at || new Date()
  }
}
