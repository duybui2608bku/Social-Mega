import { Router } from 'express'

import {
  addMembersToGroupConversationController,
  conversationController,
  createGroupConversationController,
  deleteGroupConversationController,
  deleteMembersFromGroupConversationController,
  getConversationGroupMessagesController,
  leaveGroupConversationController
} from '~/controllers/conversations.controllers'
import {
  checkAddMember,
  checkdeleteMember,
  createGroupConversationValidator,
  deleteGroupConversationValidator,
  leaveGroupConversationValidator
} from '~/middlewares/conversations.middlewares'
import { paginatonValidator } from '~/middlewares/instagrams.middlewares'
import {
  accessTokenValidator,
  getConversationGroupValidator,
  getConversationValidator,
  verifiedUserValidator
} from '~/middlewares/users.middlewares'
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

/**
 * Description: Get Conversation Group
 * Path: '/group/:group_id'
 * Method: GET
 * Headers: {Authorization : Bearer <access_token>}
 * Params:{ group_id: string , limit?: number, page?: number}
 */

conversationsRouter.get(
  '/group/:group_id',
  accessTokenValidator,
  verifiedUserValidator,
  paginatonValidator,
  getConversationGroupValidator,
  wrapRequestHandler(getConversationGroupMessagesController)
)

/**
 * Description: Create Group Conversation
 * Path: '/create-group'
 * Method: POST
 * Headers: {Authorization : Bearer <access_token>}
 * Body: { name: string, members: string[] }
 */

conversationsRouter.post(
  '/create-group',
  accessTokenValidator,
  verifiedUserValidator,
  createGroupConversationValidator,
  wrapRequestHandler(createGroupConversationController)
)

/**
 * Description: Add member to group conversation
 * Path: '/add-member'
 * Method: POST
 * Headers: {Authorization : Bearer <access_token>}
 * Body: { members: string[],group_id: string }
 */

conversationsRouter.post(
  '/add-member',
  accessTokenValidator,
  verifiedUserValidator,
  checkAddMember,
  wrapRequestHandler(addMembersToGroupConversationController)
)

/**
 * Description: Delete member to group conversation
 * Path: '/delete-member'
 * Method: POST
 * Headers: {Authorization : Bearer <access_token>}
 * Body: { members: string[],group_id: string }
 */

conversationsRouter.post(
  '/delete-member',
  accessTokenValidator,
  verifiedUserValidator,
  checkdeleteMember,
  wrapRequestHandler(deleteMembersFromGroupConversationController)
)

/**
 * Description: Delete group conversation
 * Path: '/delete-group'
 * Method: DELETE
 * Headers: {Authorization : Bearer <access_token>}
 * Params: { group_id: string }
 */

conversationsRouter.delete(
  '/delete-group/:group_id',
  accessTokenValidator,
  verifiedUserValidator,
  deleteGroupConversationValidator,
  wrapRequestHandler(deleteGroupConversationController)
)

/**
 * Description: Leave group conversation
 * Path: '/leave-group'
 * Method: DELETE
 * Headers: {Authorization : Bearer <access_token>}
 * Params: { group_id: string }
 */

conversationsRouter.delete(
  '/leave-group/:group_id',
  accessTokenValidator,
  verifiedUserValidator,
  leaveGroupConversationValidator,
  wrapRequestHandler(leaveGroupConversationController)
)

export default conversationsRouter
