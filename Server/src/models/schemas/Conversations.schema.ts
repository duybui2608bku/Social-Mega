import { ObjectId } from 'mongodb'
import { Media } from '../other'

interface ConversationType {
  _id?: ObjectId
  sender_id: ObjectId
  receiver_id: ObjectId
  content?: string
  image_url?: string[]
  video_url?: string[]
  document_url?: Media[]
  created_at?: Date
  updated_at?: Date
}

export class Conversation {
  _id?: ObjectId
  sender_id: ObjectId
  receiver_id: ObjectId
  content?: string
  image_url?: string[]
  video_url?: string[]
  document_url?: Media[]
  created_at: Date
  updated_at: Date
  constructor({
    _id,
    sender_id,
    receiver_id,
    content,
    image_url,
    video_url,
    document_url,
    created_at,
    updated_at
  }: ConversationType) {
    this._id = _id
    this.sender_id = sender_id
    this.receiver_id = receiver_id
    this.content = content || ''
    this.image_url = image_url || []
    this.video_url = video_url || []
    this.document_url = document_url || []
    this.created_at = created_at || new Date()
    this.updated_at = updated_at || new Date()
  }
}
