import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { HttpStatusCode } from '~/constants/enum'
import { SearchQuery, SearchQueryHashtags, SearchQueryUsers } from '~/models/requestes/Search.requests'
import searchServices from '../../services/search.services'
import { InstagramsMessgaes } from '~/constants/messages'

export const searchController = async (req: Request<ParamsDictionary, any, any, SearchQuery>, res: Response) => {
  const limit = Number(req.query.limit) || 5
  const page = Number(req.query.page) || 1
  const result = await searchServices.search({
    limit,
    page,
    content: req.query.content,
    user_id: req.decode_authorization?.user_id as string,
    people_follow: req.query.people_follow
  })

  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message: InstagramsMessgaes.SEARCH_SUCCESS,
    result: {
      instagrams: result.Instagrams,
      total: result.total,
      page,
      limit,
      total_page: Math.ceil(result.total / limit)
    }
  })
}

export const searchHashtagsController = async (
  req: Request<ParamsDictionary, any, any, SearchQueryHashtags>,
  res: Response
) => {
  const limit = Number(req.query.limit) || 5
  const page = Number(req.query.page) || 1

  const result = await searchServices.searchHashtags({
    limit,
    page,
    hashtag: req.query.hashtag
  })

  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message: InstagramsMessgaes.SEARCH_SUCCESS,
    result: {
      instagrams: result.Instagrams,
      total: result.total,
      page,
      limit,
      total_page: Math.ceil(result.total / limit)
    }
  })
}

export const searchUsersController = async (
  req: Request<ParamsDictionary, any, any, SearchQueryUsers>,
  res: Response
) => {
  const result = await searchServices.searchUsers(req.query.name)
  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message: InstagramsMessgaes.SEARCH_SUCCESS,
    result
  })
}
