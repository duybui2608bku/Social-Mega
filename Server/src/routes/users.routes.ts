import { Router } from 'express'
import {
  emailVerifyController,
  forgotPasswordController,
  loginController,
  logUotController,
  registerController,
  resendEmailVerifyController,
  verifyForgotPasswordController
} from '~/controllers/users.controllers'
import {
  loginValidator,
  accessTokenValidator,
  refreshTokenValidator,
  registerValidator,
  emailVerifyValidator,
  forgotPasswordValidator,
  verifyForgotPasswordValidator
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

/*
Description: Verify Email User
path: /verify-email
method: POST
Body:{email_verify_token: string}
*/

userRouters.post('/verify-email', emailVerifyValidator, wrapRequestHandler(emailVerifyController))

/*
Description: Resend Verify Email User
path: /resend-verify-email
method: POST
Header:{Authorization: Bearer <access_token>}
Body:{}
*/
userRouters.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendEmailVerifyController))

/*
Description: Submit email to reset password, send email to user
path: /forgot-password
method: POST
Body:{email: string}
*/
userRouters.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

/*
Description: Verify link in email to reset password
path: /verify-forgot-password
method: POST
Body:{forgot_password_token: string}
*/
userRouters.post(
  '/verify-forgot-password',
  verifyForgotPasswordValidator,
  wrapRequestHandler(verifyForgotPasswordController)
)

export default userRouters
