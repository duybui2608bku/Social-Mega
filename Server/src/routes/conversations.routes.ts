import { Router } from 'express'
import { conversationController } from '~/controllers/conversations.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'

const conversationsRouter = Router()

/**
 * Description: Get Conversation
 * Path: '/receiver/:receiver_id'
 * Method: GET
 * Headers: {Authorization : Bearer <access_token>}
 * Params:{ receiver_id: string , limit?: number, page?: number}
 */

conversationsRouter.get('/receiver/:receiver_id', accessTokenValidator, verifiedUserValidator, conversationController)

export default conversationsRouter
