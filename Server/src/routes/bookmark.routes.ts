import { Router } from 'express'
import { bookmarkController, unBookmarkController } from '~/controllers/bookmark.controllers'
import { instagramsIDValidator } from '~/middlewares/instagrams.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const bookmarkRouters = Router()
/**
 * Description: Create bookmark Instagrams
 * Path: '/'
 * Method: POST
 * Body:{instagram_id: string}
 * Headers:{Authorization: Bearer <access_token>}
 */

bookmarkRouters.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  instagramsIDValidator,
  wrapRequestHandler(bookmarkController)
)

/**
 * Description: Un bookmark Instagrams
 * Path: '/'
 * Method: DELETE
 * Body:{instagram_id: string}
 * Headers:{Authorization: Bearer <access_token>}
 */

bookmarkRouters.delete(
  '/instagrams/:instagram_id',
  accessTokenValidator,
  verifiedUserValidator,
  instagramsIDValidator,
  wrapRequestHandler(unBookmarkController)
)

export default bookmarkRouters
