import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enum'

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
}

export interface LogoutRequestBody {
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

export interface FlowRequestBody {
  fllow_user_id: string
}
