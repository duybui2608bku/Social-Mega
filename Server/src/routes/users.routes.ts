import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'

const userRouters = Router()

userRouters.post('/login', loginController)
userRouters.post('/register', registerController)
export default userRouters
