import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import usersService from '../../services/users.services'
import { RegisterRequestBody } from '~/models/requestes/User.requests'
import { HttpStatusCode } from '~/constants/enum'
import { userMessages } from '~/constants/messages'
export const loginController = (req: Request, res: Response) => {
  res.json({ message: req.body })
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
