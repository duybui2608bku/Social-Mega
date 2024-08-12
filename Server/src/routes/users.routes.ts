import { Router } from 'express'
import {
  addInstagramsCircleController,
  changePasswordController,
  deleteUserOutOfInstagramsCircleController,
  emailVerifyController,
  followAppectController,
  followCancleRequestController,
  followController,
  forgotPasswordController,
  getInforConversationController,
  getInforConversationGroupController,
  getMeController,
  loginController,
  logUotController,
  refreshTokenController,
  registerController,
  resendEmailVerifyController,
  resetPasswordController,
  unfollowController,
  updateMeController,
  verifyForgotPasswordController
} from '~/controllers/users.controllers'
import {
  loginValidator,
  accessTokenValidator,
  refreshTokenValidator,
  registerValidator,
  emailVerifyValidator,
  forgotPasswordValidator,
  verifyForgotPasswordValidator,
  resetPasswordValidator,
  verifiedUserValidator,
  updateMevValidator,
  followerUserValidator,
  unfollowerUserValidator,
  changePasswordValidator,
  followUserAcceptValidator,
  followUserCancleValidator,
  addIntagramsCircleValidator,
  deleteIntagramsCircleValidator
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
Description: User logout
path: /logout
method: POST
Header:{Authorization: Bearer <access_token>}
Body:{refresh_token: string}
*/

userRouters.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logUotController))

/*
Description: Refresh token
path: /refresh-token
method: POST
Body:{refre: string}
*/

userRouters.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

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

/*
Description: Reset password
path: /reset-password
method: POST
Body:{forgot_password_token: string, password: string, confirm_password: string}
*/
userRouters.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

/*
Description: Change password
path: /change-password
method: POST
Body:{old_password:string,password: string, confirm_password: string}
*/
userRouters.post(
  '/change-password',
  accessTokenValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)

/*
Description: Update user profile
path: /me
method: Patch
Header:{Authorization: Bearer <access_token>}
Body:UserSchema
*/
userRouters.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

/*
Description: Get user profile
path: /me
method: GET
Header:{Authorization: Bearer <access_token>}
*/
userRouters.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  updateMevValidator,
  wrapRequestHandler(updateMeController)
)

/*
Description: Fllow some one
path: /follow
method: POST
Header:{Authorization: Bearer <access_token>}
Body:{flow_user_id: string}
*/

userRouters.post(
  '/follow',
  accessTokenValidator,
  verifiedUserValidator,
  followerUserValidator,
  wrapRequestHandler(followController)
)

/*
Description: Accept some one
path: /follow-accept/:follow_user_id_accept
method: POST
Header:{Authorization: Bearer <access_token>}
Body:{flow_user_id_accept: string}
*/

userRouters.post(
  '/follow-accept/:follow_user_id_accept',
  accessTokenValidator,
  verifiedUserValidator,
  followUserAcceptValidator,
  wrapRequestHandler(followAppectController)
)

/*
Description: Cancle request follow some one
path: /follow-accept/:follow_user_id_accept
method: DELETE
Header:{Authorization: Bearer <access_token>}
Body:{flow_user_id_cancle_request: string}
*/

userRouters.delete(
  '/follow-cancle-request/:follow_user_id_cancle_request',
  accessTokenValidator,
  verifiedUserValidator,
  followUserCancleValidator,
  wrapRequestHandler(followCancleRequestController)
)

/*
Description: UnFllow some one
path: /follow/unfllow_user_id
method: DELETE
Header:{Authorization: Bearer <access_token>}
*/

userRouters.delete(
  '/follow/:unfollow_user_id',
  accessTokenValidator,
  verifiedUserValidator,
  unfollowerUserValidator,
  wrapRequestHandler(unfollowController)
)

/*
Description: Add instagrams cricle
path: /instagrams-circle
method: POST
Header:{Authorization: Bearer <access_token>}
Body:{instagrams_circle: string[]}
*/

userRouters.post(
  '/instagrams-circle',
  accessTokenValidator,
  verifiedUserValidator,
  addIntagramsCircleValidator,
  wrapRequestHandler(addInstagramsCircleController)
)

/*
Description: Delete user out of instagrams cricle
path: /delete-instagrams-circle
method: POST
Header:{Authorization: Bearer <access_token>}
Body:{instagrams_circle: string[]}
*/

userRouters.post(
  '/delete-instagrams-circle',
  accessTokenValidator,
  verifiedUserValidator,
  deleteIntagramsCircleValidator,
  wrapRequestHandler(deleteUserOutOfInstagramsCircleController)
)

/*
Description: Get infor conversation
path: /conversation
method: GET
Header:{Authorization: Bearer <access_token>}
*/

userRouters.get(
  '/conversation',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(getInforConversationController)
)

/*
Description: Get infor conversation Group
path: /conversation-group
method: GET
Header:{Authorization: Bearer <access_token>}
*/
userRouters.get(
  '/conversation-group',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(getInforConversationGroupController)
)

export default userRouters
