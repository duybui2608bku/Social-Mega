import { SuccessResponse } from './Ulti.type'
import { UserType } from './User.type'

export type AuthRegisterResponse = SuccessResponse<{
  access_token: string
  refresh_token: string
  email_verify_token: string
}>

export type AuthLoginResponse = SuccessResponse<{
  access_token: string
  refresh_token: string
  user: UserType
}>

export type AuthLogout = SuccessResponse<void>

export type AuthForgotPassword = SuccessResponse<void>

export type AuthChangePassword = SuccessResponse<void>
