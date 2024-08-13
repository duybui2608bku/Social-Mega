import { UserProfileAggregationsType } from './User.type'
import { SuccessResponse } from './Ulti.type'
export type ConversationsType = SuccessResponse<{
  conversation: [
    {
      _id: string
      sender_id: string
      receiver_id: string
      content: string
      created_at: string
      updated_at: string
    }
  ]
  limit: number
  page: number
  total: number
}>

export type GroupConversationsType = SuccessResponse<{
  conversationGroupMessages: [
    {
      _id: string
      sender_id: string
      group_id: string
      content: string
      created_at: string
      updated_at: string
    }
  ]
  limit: number
  page: number
  total: number
}>

export interface GroupConversationType {
  _id: string
  name: string
  admin: string
  members: UserProfileAggregationsType[]
}

export type PrivateConversation = UserProfileAggregationsType[]

export type UserInforConversationType = SuccessResponse<
  [
    {
      _id: string
      name: string

      private_conversations: PrivateConversation
    }
  ]
>

export type UserInforConversationGroupType = SuccessResponse<
  [
    {
      _id: string
      name: string
      group_conversations: GroupConversationType[]
    }
  ]
>
