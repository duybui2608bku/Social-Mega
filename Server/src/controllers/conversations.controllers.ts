import { Request, Response } from 'express'
import conversationService from '../../services/conversations.services'
import { TokenPayload } from '~/models/requestes/User.requests'
import { HttpStatusCode } from '~/constants/enum'
import { ConversationMessages } from '~/constants/messages'
import {
  AddMembersToGroupConversationRequests,
  CreateGroupConversationRequests,
  DeleteGroupConversationRequests,
  DeleteMembersFromGroupConversationRequests,
  GetConversationsRequests,
  LeaveGroupConversationRequests
} from '~/models/requestes/Conversations.requests'
import { ParamsDictionary } from 'express-serve-static-core'
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
      total: Math.ceil(result.total / limit)
    }
  })
}

export const createGroupConversationController = async (
  req: Request<ParamsDictionary, any, CreateGroupConversationRequests>,
  res: Response
) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { members, name } = req.body
  await conversationService.createGroupConversation({ name, members, user_id })
  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message: ConversationMessages.CREATE_GROUP_CONVERSATION_SUCCESS
  })
}

export const addMembersToGroupConversationController = async (
  req: Request<ParamsDictionary, any, AddMembersToGroupConversationRequests>,
  res: Response
) => {
  const { members, group_id } = req.body
  await conversationService.addMembersToGroupConversation({ members, group_id })
  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message: ConversationMessages.ADD_MEMBERS_TO_GROUP_CONVERSATION_SUCCESS
  })
}

export const deleteMembersFromGroupConversationController = async (
  req: Request<ParamsDictionary, any, DeleteMembersFromGroupConversationRequests>,
  res: Response
) => {
  const { members, group_id } = req.body
  await conversationService.deleteMembersFromGroupConversation({ members, group_id })
  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message: ConversationMessages.DELETE_MEMBERS_FROM_GROUP_CONVERSATION_SUCCESS
  })
}

export const leaveGroupConversationController = async (req: Request<LeaveGroupConversationRequests>, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { group_id } = req.params
  await conversationService.leaveGroupConversation({ group_id, user_id })
  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message: ConversationMessages.LEAVE_GROUP_CONVERSATION_SUCCESS
  })
}

export const deleteGroupConversationController = async (
  req: Request<DeleteGroupConversationRequests>,
  res: Response
) => {
  const { group_id } = req.params
  await conversationService.deleteGroupConversation({ group_id })
  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message: ConversationMessages.DELETE_GROUP_CONVERSATION_SUCCESS
  })
}
