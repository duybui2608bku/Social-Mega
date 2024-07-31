import { Collection, Db, MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import User from '~/models/schemas/User.schema'
import { RefreshToken } from '~/models/schemas/RefreshToekn.chema'
import Followers from '~/models/schemas/Fllowers.chema'
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

  get users(): Collection<User> {
    return this.db.collection(process.env.USERS_COLLECTION as string)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.REFRESH_TOKENS_COLLECTION as string)
  }

  get followers(): Collection<Followers> {
    return this.db.collection(process.env.USERS_FLLOWERS_COLLECTION as string)
  }
}

const databaseService = new DatabaseService()
export default databaseService
