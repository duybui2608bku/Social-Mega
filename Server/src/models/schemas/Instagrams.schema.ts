import { ObjectId } from 'mongodb'
import { Media } from '../other'
import { InstagramsAudiance, InstagramsType } from '~/constants/enum'

interface InstagramsContructor {
  _id?: ObjectId
  user_id: ObjectId
  type: InstagramsType
  audiance: InstagramsAudiance
  content: string
  parent_id?: string | null
  hashtags: ObjectId[]
  mentions: string[]
  medias: Media[]
  guest_view?: number
  user_view?: number
  created_at?: Date
  updated_at?: Date
}

export default class Instagrams {
  _id?: ObjectId
  user_id: ObjectId
  type: InstagramsType
  audiance: InstagramsAudiance
  content: string
  parent_id?: ObjectId | null
  hashtags: ObjectId[]
  mentions: ObjectId[]
  medias: Media[]
  guest_view: number
  user_view: number
  created_at?: Date
  updated_at?: Date
  constructor({
    _id,
    audiance,
    content,
    guest_view,
    hashtags,
    medias,
    mentions,
    type,
    user_id,
    user_view,
    created_at,
    parent_id,
    updated_at
  }: InstagramsContructor) {
    const date = new Date()
    this._id = _id
    this.user_id = user_id
    this.type = type
    this.audiance = audiance
    this.content = content
    this.parent_id = parent_id ? new ObjectId(parent_id) : null
    this.hashtags = hashtags
    this.mentions = mentions.map((mention) => new ObjectId(mention))
    this.medias = medias
    this.guest_view = guest_view || 0
    this.user_view = user_view || 0
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}
