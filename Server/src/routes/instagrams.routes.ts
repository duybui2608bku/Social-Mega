import { Router } from 'express'
import { getInstagramsController, InstagramsController } from '~/controllers/instagrams.controllers'
import { likeInstagramsController, unLikeInstagramsController } from '~/controllers/likeInstagrams.controllers'
import {
  audienceValidator,
  createInstagramsValidator,
  instagramsIDValidator
} from '~/middlewares/instagrams.middlewares'
import { accessTokenValidator, isUserLoggedValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const InstagramsRouters = Router()

/**
 * Description: Create instagrams
 * Path: '/'
 * Method: POST
 * Body:InstagramsRequestBody
 */

InstagramsRouters.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  createInstagramsValidator,
  wrapRequestHandler(InstagramsController)
)

/**
 * Description: like instagrams
 * Path: '/like'
 * Method: POST
 * Body:{instagram_id: string}
 */

InstagramsRouters.post(
  '/like',
  accessTokenValidator,
  verifiedUserValidator,
  instagramsIDValidator,
  wrapRequestHandler(likeInstagramsController)
)

/**
 * Description: like instagrams
 * Path: '/like'
 * Method: POST
 * Body:{instagram_id: string}
 */

InstagramsRouters.delete(
  '/un-like/:instagram_id',
  accessTokenValidator,
  verifiedUserValidator,
  instagramsIDValidator,
  wrapRequestHandler(unLikeInstagramsController)
)

/**
 * Description: Get Instagrams Details
 * Path: '/'
 * Method: GET
 * Headers: {Authorization ?: Bearer <access_token>}
 */

InstagramsRouters.get(
  '/:instagram_id',
  instagramsIDValidator,
  isUserLoggedValidator(accessTokenValidator),
  isUserLoggedValidator(verifiedUserValidator),
  audienceValidator,
  wrapRequestHandler(getInstagramsController)
)

export default InstagramsRouters
