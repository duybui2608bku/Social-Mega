import { Request, Response } from 'express'
import { LikeInstagrameRequestBody } from '~/models/requestes/LikeInstagrams.requests'
import { ParamsDictionary } from 'express-serve-static-core'
import { TokenPayload } from '~/models/requestes/User.requests'
import { HttpStatusCode } from '~/constants/enum'
import likeInstagramsService from '../../services/likeInstagrams.services'
import { InstagramsMessgaes } from '~/constants/messages'

export const likeInstagramsController = async (
  req: Request<ParamsDictionary, any, LikeInstagrameRequestBody>,
  res: Response
) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const instagram_id = req.body.instagram_id
  const result = await likeInstagramsService.likeInstagrams(user_id, instagram_id)
  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message: InstagramsMessgaes.LIKE_INSTAGRAM_CREATE_SUCCESS,
    result
  })
}

export const unLikeInstagramsController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const instagram_id = req.params.instagram_id
  const result = await likeInstagramsService.unLikeInstagrams(user_id, instagram_id)
  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message: result === null ? InstagramsMessgaes.INSTAGRAMS_NOT_LIKED : InstagramsMessgaes.UN_LIKE_INSTAGRAM_SUCCESS,
    result: result === null ? {} : result
  })
}
