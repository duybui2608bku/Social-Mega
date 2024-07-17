import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import usersService from '../../services/users.services'
import { LogoutRequestBody, RegisterRequestBody } from '~/models/requestes/User.requests'
import { HttpStatusCode } from '~/constants/enum'
import { userMessages } from '~/constants/messages'
import { ObjectId } from 'mongodb'

export const loginController = async (req: Request, res: Response) => {
  const { user } = req
  const user_id = user?._id as unknown as ObjectId
  const result = await usersService.login(user_id.toString())
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
    message: userMessages.LOGOUT_SUCCESS,
    result
  })
}
