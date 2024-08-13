import { ObjectId } from 'mongodb'

interface ConversationGroupType {
  _id?: ObjectId
  admin?: ObjectId
  name: string
  members: ObjectId[]
  last_time_message?: Date
  created_at: Date
  updated_at: Date
}

export class ConversationGroup {
  _id?: ObjectId
  admin?: ObjectId
  name: string
  description?: string
  members: ObjectId[]
  last_time_message?: Date
  created_at: Date
  updated_at: Date
  constructor({ _id, admin, name, members, last_time_message, created_at, updated_at }: ConversationGroupType) {
    this._id = _id
    this.admin = admin
    this.name = name
    this.members = members
    this.last_time_message = last_time_message || new Date()
    this.created_at = created_at || new Date()
    this.updated_at = updated_at || new Date()
  }
}
