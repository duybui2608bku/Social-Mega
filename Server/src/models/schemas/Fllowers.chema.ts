import { ObjectId } from 'mongodb'

interface FllowersType {
  _id?: ObjectId
  user_id: ObjectId
  flow_user_id: ObjectId
  created_at?: Date
}

export default class Fllowers {
  _id?: ObjectId
  user_id: ObjectId
  flow_user_id: ObjectId
  created_at?: Date
  constructor({ _id, user_id, flow_user_id, created_at }: FllowersType) {
    this._id = _id
    this.user_id = user_id
    this.flow_user_id = flow_user_id
    this.created_at = created_at || new Date()
  }
}
