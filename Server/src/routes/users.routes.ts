import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const userRouters = Router()

/*
Description: Register a new user
path: /register
Body:{name: string, email: string, password: string, confirm_password: string, date_of_birth: ISO8601}
*/
userRouters.post('/register', registerValidator, wrapRequestHandler(registerController))
userRouters.post('/login', loginValidator, wrapRequestHandler(loginController))
export default userRouters
