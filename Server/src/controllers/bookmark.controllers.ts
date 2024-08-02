import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TokenPayload } from '~/models/requestes/User.requests'
import { BookmarkMessgaes } from '~/constants/messages'
import { HttpStatusCode } from '~/constants/enum'
import { BookmarkInstagrameRequestBody } from '~/models/requestes/Bookmark.requests'
import bookmarService from '../../services/bookmark.services'
export const bookmarkController = async (
  req: Request<ParamsDictionary, any, BookmarkInstagrameRequestBody>,
  res: Response
) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const result = await bookmarService.bookmarkInstagrams(user_id, req.body.instagram_id)
  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message: BookmarkMessgaes.BOOKMARK_INSTAGRAM_CREATE_SUCCESS,
    result
  })
}

export const unBookmarkController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const result = await bookmarService.unBookmarkInstagrams(user_id, req.params.instagram_id)
  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message:
      result === null
        ? BookmarkMessgaes.BOOKMARK_INSTAGRAM_NOT_SAVE_OR_NOT_FOUND
        : BookmarkMessgaes.UN_BOOKMARK_INSTAGRAM_CREATE_SUCCESS,
    result: result === null ? {} : result
  })
}
