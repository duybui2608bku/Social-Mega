import { LoginRequestBody } from '~/models/requestes/User.requests'
import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { InstagramsRequestBody } from '~/models/requestes/Instagrams.requests'
export const InstagramsController = async (
  req: Request<ParamsDictionary, any, InstagramsRequestBody>,
  res: Response
) => {
  return res.status(200).json({
    success: true,
    message: 'InstagramsController'
  })
}
