import { Router } from 'express'
import { loginController, logUotController, registerController } from '~/controllers/users.controllers'
import {
  loginValidator,
  accessTokenValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const userRouters = Router()

/*
Description: Register a new user
path: /register
method: POST
Body:{name: string, email: string, password: string, confirm_password: string, date_of_birth: ISO8601}
*/
userRouters.post('/register', registerValidator, wrapRequestHandler(registerController))

/*
Description: User login
path: /login
method: POST
Body:{email: string, password: string}
*/
userRouters.post('/login', loginValidator, wrapRequestHandler(loginController))

/*
Description: User loout
path: /logout
method: POST
Header:{Authorization: Bearer <access_token>}
Body:{refresh_token: string}
*/

userRouters.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logUotController))
export default userRouters
