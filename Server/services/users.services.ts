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
}

const usersService = new UsersService()
export default usersService
