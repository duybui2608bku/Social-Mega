import { Request, Response } from 'express'
import conversationService from '../../services/conversations.services'
import { TokenPayload } from '~/models/requestes/User.requests'
import { HttpStatusCode } from '~/constants/enum'
import { ConversationMessages } from '~/constants/messages'
import { GetConversationsRequests } from '~/models/requestes/Conversations.requests'
export const conversationController = async (req: Request<GetConversationsRequests>, res: Response) => {
  const sender_id = req.decode_authorization as TokenPayload
  const { receiver_id } = req.params
  const limit = Number(req.query.limit) || 20
  const page = Number(req.query.page) || 1
  const result = await conversationService.getConversation({ sender_id: sender_id.user_id, receiver_id, limit, page })
  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message: ConversationMessages.GET_CONVERSATION_SUCCESS,
    result: {
      conversation: result.conversation,
      limit,
      page,
      total: result.total
    }
  })
}
