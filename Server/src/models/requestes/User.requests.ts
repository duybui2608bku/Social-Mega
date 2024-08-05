import { JwtPayload } from 'jsonwebtoken'
import { TokenType, UserVerifyStatus } from '~/constants/enum'
import { ParamsDictionary } from 'express-serve-static-core'
export interface RegisterRequestBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
  verify: UserVerifyStatus
  exp: number
  iat: number
}

export interface LogoutRequestBody {
  refresh_token: string
}

export interface RefreshTokenRequestBody {
  refresh_token: string
}

export interface LoginRequestBody {
  email: string
  password: string
}

export interface EmailVerifyRequestBody {
  email_verify_token: string
}

export interface ForgotPasswordRequestBody {
  email: string
}

export interface VerifyForgotPasswordRequestBody {
  forgot_password_token: string
}

export interface resetPasswordRequestBody {
  password: string
  confirm_password: string
  forgot_password_token: string
}

export interface getProfileRequestBody {
  user_id: string
}

export interface verifiedUserValidator {
  decoded_authorization: TokenPayload
}

export interface updateMeRequestBody {
  name?: string
  date_of_birth?: string
  bio?: string
  website?: string
  location?: string
  username?: string
  avatar?: string
  coverphoto?: string
}

export interface FollowRequestBody {
  follow_user_id: string
}

export interface UnfollowerRequestBody extends ParamsDictionary {
  unfollow_user_id: string
}

export interface FollowerAcceptRequestBody extends ParamsDictionary {
  follow_user_id_accept: string
}

export interface FollowerCancleRequestBody extends ParamsDictionary {
  follow_user_id_cancle_request: string
}

export interface changePasswordRequestBody {
  old_password: string
  password: string
  confirm_password: string
}
