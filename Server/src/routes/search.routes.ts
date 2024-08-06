import { Router } from 'express'
import { searchController, searchHashtagsController, searchUsersController } from '~/controllers/search.controllers'
import { paginatonValidator } from '~/middlewares/instagrams.middlewares'
import { searchValidator } from '~/middlewares/search.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const searchRouters = Router()

/**
 * Description: Search
 * Path: '/'
 * Method: GET
 * Headers: {Authorization : Bearer <access_token>}
 * Query: {page ?: number, limit ?: number, content: string}
 */

searchRouters.get(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  searchValidator,
  paginatonValidator,
  wrapRequestHandler(searchController)
)

/**
 * Description: Search Hashtags
 * Path: '/hashtags'
 * Method: GET
 * Headers: {Authorization : Bearer <access_token>}
 * Query: {page ?: number, limit ?: number, hashtag: string}
 */

searchRouters.get(
  '/hashtags',
  accessTokenValidator,
  verifiedUserValidator,
  searchValidator,
  paginatonValidator,
  wrapRequestHandler(searchHashtagsController)
)

/**
 * Description: Search Users
 * Path: '/users'
 * Method: GET
 * Query: {user: string}
 */

searchRouters.get('/users', wrapRequestHandler(searchUsersController))

export default searchRouters
