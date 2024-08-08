import { ConversationsType } from 'src/Types/Conversations.type'
import axiosInstance from 'src/Utils/Axios'

export const getConversation = ({
  receiver_id,
  limit,
  page
}: {
  receiver_id: string
  limit?: number
  page?: number
}) => {
  return axiosInstance.get<ConversationsType>(`/conversation/receiver/${receiver_id}?limit=${limit}&page=${page}`)
}
