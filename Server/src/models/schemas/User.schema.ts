import { ObjectId } from 'mongodb'
import { userStatus, UserVerifyStatus } from '~/constants/enum'

interface UserType {
  _id?: ObjectId
  name: string
  email: string
  date_of_birth?: Date
  password: string
  created_at?: Date
  updated_at?: Date
  email_verify_token?: string
  forgot_password_token?: string
  verify?: UserVerifyStatus
  instagrams_circle?: ObjectId[]
  bio?: string
  location?: string
  website?: string
  avatar?: string
  cover_photo?: string
  status?: userStatus
  request_follow?: ObjectId[]
  group_conversations?: ObjectId[]
}

export default class User {
  _id?: ObjectId
  name: string
  email: string
  date_of_birth: Date
  password: string
  created_at: Date
  updated_at: Date
  email_verify_token: string
  forgot_password_token: string
  verify: UserVerifyStatus
  instagrams_circle: ObjectId[]
  bio: string
  location: string
  website: string
  avatar: string
  cover_photo: string
  status: userStatus
  request_follow?: ObjectId[]
  group_conversations?: ObjectId[]
  constructor(user: UserType) {
    this._id = user._id
    this.name = user.name || ''
    this.email = user.email
    this.date_of_birth = user.date_of_birth || new Date()
    this.password = user.password
    this.created_at = user.created_at || new Date()
    this.updated_at = user.updated_at || new Date()
    this.email_verify_token = user.email_verify_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
    this.verify = user.verify || UserVerifyStatus.Unverify
    this.bio = user.bio || ''
    this.location = user.location || ''
    this.website = user.website || ''
    this.avatar = user.avatar || ''
    this.cover_photo = user.cover_photo || ''
    this.instagrams_circle = user.instagrams_circle || []
    this.status = user.status || userStatus.public
    this.request_follow = user.request_follow || []
    this.group_conversations = user.group_conversations || []
  }
}
