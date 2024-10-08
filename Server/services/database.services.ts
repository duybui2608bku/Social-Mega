import { Collection, Db, MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import User from '~/models/schemas/User.schema'
import { RefreshToken } from '~/models/schemas/RefreshToekn.chema'
import Followers from '~/models/schemas/Fllowers.chema'
import Instagrams from '~/models/schemas/Instagrams.schema'
import Hashtags from '~/models/schemas/Hashtags.schema'
import { Bookmark } from '~/models/schemas/Bookmark.schema'
import { LikeInstagrams } from '~/models/schemas/LikeInstagrams.chema'
import { Conversation } from '~/models/schemas/Conversations.schema'
import { ConversationGroup } from '~/models/schemas/ConversationsGroup.schema'
import { ConversationsGroupMessage } from '~/models/schemas/ConversationsGroupMessage.chema'
dotenv.config()
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@social-app.9mqzjou.mongodb.net/?appName=SOCIAL-APP?retryWrites=true&w=majority`

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }
  async connect() {
    // eslint-disable-next-line no-useless-catch
    try {
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      throw error
    }
  }

  async indexUsers() {
    const exsit = await this.users.indexExists(['email_1_password_1', 'email_1', 'name_1'])
    if (!exsit) {
      this.users.createIndex({ email: 1, password: 1 })
      this.users.createIndex({ email: 1 }, { unique: true })
      this.users.createIndex({ name: 1 })
      this.users.createIndex({ name_text: 'text' }, { default_language: 'none' })
    }
  }

  async indexRefreshTokens() {
    const exsit = await this.users.indexExists(['token_1', 'exp_1'])
    if (!exsit) {
      this.refreshTokens.createIndex({ token: 1 })
      this.refreshTokens.createIndex(
        { exp: 1 },
        {
          expireAfterSeconds: 0
        }
      )
    }
  }

  async indexFollowers() {
    const exsit = await this.users.indexExists(['user_id_1_follow_user_id_1'])
    if (!exsit) {
      this.followers.createIndex({ user_id: 1, follow_user_id: 1 })
    }
  }

  async indexInstagrams() {
    const exsit = await this.instagrams.indexExists(['content_text'])
    if (!exsit) {
      this.instagrams.createIndex({ content_text: 'text' }, { default_language: 'none' })
    }
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.USERS_COLLECTION as string)
  }

  get instagrams(): Collection<Instagrams> {
    return this.db.collection(process.env.USERS_INSTAGRAMS_COLLECTION as string)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.REFRESH_TOKENS_COLLECTION as string)
  }

  get followers(): Collection<Followers> {
    return this.db.collection(process.env.USERS_FLLOWERS_COLLECTION as string)
  }

  get hashtags(): Collection<Hashtags> {
    return this.db.collection(process.env.HASHTAGS_COLLECTION as string)
  }

  get bookmarks(): Collection<Bookmark> {
    return this.db.collection(process.env.BOOKMARKS_COLLECTION as string)
  }

  get likeInstagrams(): Collection<LikeInstagrams> {
    return this.db.collection(process.env.LIKE_INSTAGRAMS_COLLECTION as string)
  }

  get conversations(): Collection<Conversation> {
    return this.db.collection(process.env.CONVERSATIONS_COLLECTION as string)
  }

  get conversationGroups(): Collection<ConversationGroup> {
    return this.db.collection(process.env.CONVERSATION_GROUPS_COLLECTION as string)
  }

  get conversationGroupMessages(): Collection<ConversationsGroupMessage> {
    return this.db.collection(process.env.CONVERSATION_GROUP_MESSAGES_COLLECTION as string)
  }
}

const databaseService = new DatabaseService()
export default databaseService
