import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { InstagramsRequestBody } from '~/models/requestes/Instagrams.requests'
import instagramsService from '../../services/instagrams.services'
import { TokenPayload } from '~/models/requestes/User.requests'
import { InstagramsMessgaes, userMessages } from '~/constants/messages'
import { HttpStatusCode } from '~/constants/enum'
export const InstagramsController = async (
  req: Request<ParamsDictionary, any, InstagramsRequestBody>,
  res: Response
) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const result = await instagramsService.createInstagram(user_id, req.body)
  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message: InstagramsMessgaes.CREATE_INSTAGRAM_SUCCESS,
    result
  })
}
