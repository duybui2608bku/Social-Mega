import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import usersService from '../../services/users.services'
import {
  changePasswordRequestBody,
  EmailVerifyRequestBody,
  FollowRequestBody,
  ForgotPasswordRequestBody,
  getProfileRequestBody,
  LoginRequestBody,
  LogoutRequestBody,
  RefreshTokenRequestBody,
  RegisterRequestBody,
  resetPasswordRequestBody,
  TokenPayload,
  UnfollowerRequestBody,
  updateMeRequestBody,
  VerifyForgotPasswordRequestBody
} from '~/models/requestes/User.requests'
import { HttpStatusCode, UserVerifyStatus } from '~/constants/enum'
import { userMessages } from '~/constants/messages'
import { ObjectId } from 'mongodb'
import databaseService from 'services/database.services'
import User from '~/models/schemas/User.schema'
import { omit } from 'lodash'

export const loginController = async (req: Request<ParamsDictionary, any, LoginRequestBody>, res: Response) => {
  const { user } = req
  const user_id = user?._id as unknown as ObjectId
  const result = await usersService.login({ user_id: user_id.toString(), verify: user?.verify as UserVerifyStatus })
  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message: userMessages.LOGIN_SUCCESS,
    result
  })
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await usersService.register(req.body)
  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message: userMessages.REGISTER_SUCCESS,
    result
  })
}

export const logUotController = async (req: Request<ParamsDictionary, any, LogoutRequestBody>, res: Response) => {
  const { refresh_token } = req.body
  const result = await usersService.logout(refresh_token)
  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message: result.message
  })
}

export const refreshTokenController = async (
  req: Request<ParamsDictionary, any, RefreshTokenRequestBody>,
  res: Response
) => {
  const { user_id, verify } = req.decoded_refresh_token as TokenPayload
  const { refresh_token } = req.body
  const result = await usersService.refreshToken({ user_id, verify, refresh_token })
  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message: userMessages.REFRESH_TOKEN_SUCCESS,
    result
  })
}

export const emailVerifyController = async (
  req: Request<ParamsDictionary, any, EmailVerifyRequestBody>,
  res: Response
) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  const user = await databaseService.users.findOne({
    _id: new ObjectId(user_id)
  })
  if (!user) {
    return res.status(HttpStatusCode.NotFound).json({
      success: false,
      message: userMessages.USER_NOT_FOUND
    })
  }
  if (user.email_verify_token === '') {
    return res.status(HttpStatusCode.BadRequest).json({
      success: false,
      message: userMessages.EMAIL_ALREADY_VERIFIED
    })
  }
  const result = await usersService.verifyEmail(user_id)
  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message: result.message
  })
}

export const resendEmailVerifyController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const user = await databaseService.users.findOne({
    _id: new ObjectId(user_id)
  })
  if (!user) {
    return res.status(HttpStatusCode.NotFound).json({
      success: false,
      message: userMessages.USER_NOT_FOUND
    })
  }

  if (user.verify === UserVerifyStatus.Verified) {
    return res.status(HttpStatusCode.BadRequest).json({
      success: false,
      message: userMessages.EMAIL_ALREADY_VERIFIED
    })
  }

  const result = await usersService.resendEmailVerify(user_id)
  return res.json({
    success: true,
    message: result.message
  })
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordRequestBody>,
  res: Response
) => {
  const { _id, verify } = req.user as User
  const result = await usersService.forgotPassword({
    user_id: (_id as ObjectId).toString(),
    verify
  })
  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message: result.message
  })
}

export const verifyForgotPasswordController = async (
  req: Request<ParamsDictionary, any, VerifyForgotPasswordRequestBody>,
  res: Response
) => {
  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message: userMessages.VERIFY_FORGOT_PASSWORD_SUCCESS
  })
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, resetPasswordRequestBody>,
  res: Response
) => {
  const { user_id } = req.decoded_forgot_password_token as TokenPayload
  const { password } = req.body
  const result = await usersService.resetPassword(user_id, password)
  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message: result.message
  })
}

export const changePasswordController = async (
  req: Request<ParamsDictionary, any, changePasswordRequestBody>,
  res: Response
) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { password, old_password } = req.body
  const result = await usersService.changePassword(user_id, old_password)
  if (password === old_password) {
    return res.status(HttpStatusCode.BadRequest).json({
      success: false,
      message: userMessages.NEW_PASSWORD_MUST_BE_DIFFERENT
    })
  }
  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message: result.message
  })
}

export const getMeController = async (req: Request<ParamsDictionary, any, getProfileRequestBody>, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const result = await usersService.getProfile(user_id)
  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message: result.message,
    user: result.user
  })
}

export const updateMeController = async (req: Request<ParamsDictionary, any, updateMeRequestBody>, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const body = omit(req.body, ['forgot_password_token', 'email_verify_token'])
  const user = await usersService.updateProfile(user_id, body)
  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message: userMessages.UPDATE_PROFILE_SUCCESS,
    user
  })
}

export const followController = async (req: Request<ParamsDictionary, any, FollowRequestBody>, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { follow_user_id } = req.body
  const result = await usersService.follow(user_id, follow_user_id)
  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message: result.message
  })
}

export const unfollowController = async (req: Request<ParamsDictionary, any, UnfollowerRequestBody>, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { unfollow_user_id } = req.params
  const result = await usersService.unfollow(user_id, unfollow_user_id)
  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message: result.message
  })
}
