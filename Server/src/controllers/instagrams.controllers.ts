import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  InstagramsChildrenParams,
  InstagramsChildrentQuery,
  InstagramsRequestBody,
  Pagination
} from '~/models/requestes/Instagrams.requests'
import instagramsService from '../../services/instagrams.services'
import { TokenPayload } from '~/models/requestes/User.requests'
import { InstagramsMessgaes } from '~/constants/messages'
import { HttpStatusCode, InstagramsType } from '~/constants/enum'
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

export const getInstagramsController = async (req: Request, res: Response) => {
  const result = await instagramsService.increaseView(req.params.instagram_id, req.decode_authorization?.user_id)
  const instagram = {
    ...req.instagram,
    guest_view: result?.guest_view,
    user_view: result?.user_view,
    updated_at: result?.updated_at
  }
  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message: InstagramsMessgaes.GET_INSTAGRAMS_SUCCESS,
    result: instagram
  })
}

export const getInstagramsChildrentController = async (
  req: Request<InstagramsChildrenParams, any, any, InstagramsChildrentQuery>,
  res: Response
) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const instagrams_type = Number(req.query.instagrams_type) as InstagramsType
  const page = Number(req.query.page)
  const limit = Number(req.query.limit)
  const { Instagrams, total } = await instagramsService.getInstagramsChildrent({
    instagrams_id: req.params.instagram_id,
    instagrams_type,
    page,
    limit,
    user_id
  })
  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message: InstagramsMessgaes.GET_CHILDRENT_INSTAGRAMS_SUCCESS,
    result: {
      Instagrams,
      page,
      limit,
      total_pages: Math.ceil(total / limit)
    }
  })
}

export const getNewFeedController = async (req: Request<ParamsDictionary, any, any, Pagination>, res: Response) => {
  const user_id = req.decode_authorization as TokenPayload
  const page = Number(req.query.page)
  const limit = Number(req.query.limit)
  const result = await instagramsService.getNewFeed({ user_id, limit, page })

  res.status(HttpStatusCode.Ok).json({
    success: true,
    message: InstagramsMessgaes.GET_NEW_FEED_SUCCESS,
    result: {
      instagrams: result.Instagrams,
      total: result.total,
      page,
      limit,
      total_pages: Math.ceil(result.total / limit)
    }
  })
}
