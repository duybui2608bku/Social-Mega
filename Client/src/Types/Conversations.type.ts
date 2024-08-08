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
