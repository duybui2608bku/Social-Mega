import { ObjectId } from 'mongodb'

interface ConversationsGroupMessageType {
  _id?: ObjectId
  group_id: ObjectId
  sender_id: ObjectId
  content: string
  created_at?: Date
  updated_at?: Date
}

export class ConversationsGroupMessage {
  _id?: ObjectId
  group_id: ObjectId
  sender_id: ObjectId
  content: string
  created_at: Date
  updated_at: Date
  constructor({ _id, group_id, sender_id, content, created_at, updated_at }: ConversationsGroupMessageType) {
    this._id = _id
    this.group_id = group_id
    this.sender_id = sender_id
    this.content = content
    this.created_at = created_at || new Date()
    this.updated_at = updated_at || new Date()
  }
}
