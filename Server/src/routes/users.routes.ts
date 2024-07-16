import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { registerValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const userRouters = Router()

userRouters.post('/login', loginController)
/*
Description: Register a new user
path: /register
Body:{name: string, email: string, password: string, confirm_password: string, date_of_birth: ISO8601}
*/
userRouters.post('/register', registerValidator, wrapRequestHandler(registerController))
export default userRouters
