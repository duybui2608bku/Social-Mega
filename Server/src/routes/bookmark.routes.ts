import { Router } from 'express'
import { bookmarkController } from '~/controllers/bookmark.controllers'
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

bookmarkRouters.post('/', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(bookmarkController))

export default bookmarkRouters
