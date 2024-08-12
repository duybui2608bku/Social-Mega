import { UserProfileAggregationsType } from './User.type'
import { SuccessResponse } from './Ulti.type'
export interface ConversationsType {
  success: boolean
  message: string
  result: {
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
  }
}

export interface GroupConversation {
  _id: string
  name: string
  admin: string
  members: UserProfileAggregationsType[]
  created_at: string
  updated_at: string
}

export type PrivateConversation = UserProfileAggregationsType[]

export type UserInforConversationType = SuccessResponse<
  [
    {
      _id: string
      name: string
      group_conversations: GroupConversation[]
      private_conversations: PrivateConversation
    }
  ]
>
