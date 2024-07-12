import databaseService from '../services/database.services'
import User from '../src/models/schemas/User.schema'
class UsersService {
  async register(payload: { email: string; password: string }) {
    const { email, password } = payload
    const results = await databaseService.users.insertOne(
      new User({
        email,
        password
      })
    )
    return results
  }
  async checkEmail(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }
}

const usersService = new UsersService()
export default usersService
