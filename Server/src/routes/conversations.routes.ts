import { Router } from 'express'
import { wrap } from 'module'
import { conversationController } from '~/controllers/conversations.controllers'
import { paginatonValidator } from '~/middlewares/instagrams.middlewares'
import { accessTokenValidator, getConversationValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const conversationsRouter = Router()

/**
 * Description: Get Conversation
 * Path: '/receiver/:receiver_id'
 * Method: GET
 * Headers: {Authorization : Bearer <access_token>}
 * Params:{ receiver_id: string , limit?: number, page?: number}
 */

conversationsRouter.get(
  '/receiver/:receiver_id',
  accessTokenValidator,
  verifiedUserValidator,
  paginatonValidator,
  getConversationValidator,
  wrapRequestHandler(conversationController)
)

export default conversationsRouter
