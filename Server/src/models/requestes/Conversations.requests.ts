import { ParamsDictionary } from 'express-serve-static-core'
export interface GetConversationsRequests extends ParamsDictionary {
  receiver_id: string
}

export interface CreateGroupConversationRequests {
  name: string
  members: string[]
}

export interface AddMembersToGroupConversationRequests {
  group_id: string
  members: string[]
}

export interface DeleteMembersFromGroupConversationRequests extends AddMembersToGroupConversationRequests {}
