import { Collection, Db, MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import User from '~/models/schemas/User.schema'
import { RefreshToken } from '~/models/schemas/RefreshToekn.chema'
import Fllowers from '~/models/schemas/Fllowers.chema'
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
  get users(): Collection<User> {
    return this.db.collection(process.env.USERS_COLLECTION as string)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.REFRESH_TOKENS_COLLECTION as string)
  }

  get fllowers(): Collection<Fllowers> {
    return this.db.collection(process.env.USERS_FLLOWERS_COLLECTION as string)
  }
}

const databaseService = new DatabaseService()
export default databaseService
