import { Media } from '~/models/other'

export const socketIOConversations = {
  PRIVATE_MESSAGE: 'private message',
  RECEIVE_PRIVATE_MESSAGE: 'receive private message',
  RECEIVER_DISCONNECTED: 'receiver disconnected',
  RECEIVER_ONLINE: 'receiver online',
  DISCONNECT: 'disconnect',
  RECONNECT: 'reconnect',
  ERROR: 'error',
  CONNECTIONS: 'connection',
  GROUP_MESSAGE: 'group message',
  CONNECT_ERROR: 'connect_error',
  RECEIVE_GROUP_MESSAGE: 'receive group message'
}

interface MessagePrivatePayload {
  sender_id: string
  receiver_id: string
  content: string
  image_url: []
  video_url: string[]
  document_url: Media[]
  created_at: string
  updated_at: string
  _id: string
}

interface MessageGroupPayload {
  sender_id: string
  group_id: string
  content: string
  image_url: string[]
  video_url: string[]
  document_url: Media[]
  created_at: string
  updated_at: string
  _id: string
}

export interface MessagePrivatePayloadType {
  payload: MessagePrivatePayload
}

export interface MessageGroupPayloadType {
  payload: MessageGroupPayload
}
