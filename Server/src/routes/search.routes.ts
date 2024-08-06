import { Router } from 'express'
import { wrap } from 'module'
import { searchController, searchHashtagsController } from '~/controllers/search.controllers'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const searchRouters = Router()

/**
 * Description: Search
 * Path: '/'
 * Method: GET
 * Headers: {Authorization : Bearer <access_token>}
 * Query: {page ?: number, limit ?: number, content: string}
 */

searchRouters.get('/', accessTokenValidator, wrapRequestHandler(searchController))

/**
 * Description: Search Hashtags
 * Path: '/hashtags'
 * Method: GET
 * Headers: {Authorization : Bearer <access_token>}
 * Query: {page ?: number, limit ?: number, hashtag: string}
 */

searchRouters.get('/hashtags', accessTokenValidator, wrapRequestHandler(searchHashtagsController))

export default searchRouters
