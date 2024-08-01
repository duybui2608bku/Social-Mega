import { Router } from 'express'
import { InstagramsController } from '~/controllers/instagrams.controllers'
import { createInstagramsValidator } from '~/middlewares/instagrams.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
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

export default InstagramsRouters
