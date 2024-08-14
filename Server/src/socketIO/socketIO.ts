import { Server } from 'socket.io'
import { ObjectId } from 'mongodb'
import { Conversation } from '../models/schemas/Conversations.schema'
import databaseService from '../../services/database.services'
import { verifyAccessToken } from '~/utils/other'
import { TokenPayload } from '~/models/requestes/User.requests'
import { HttpStatusCode, UserVerifyStatus } from '~/constants/enum'
import { ErrorWithStatusCode } from '~/models/Errors'
import { userMessages } from '~/constants/messages'
import { MessageGroupPayloadType, MessagePrivatePayloadType, socketIOConversations } from '~/constants/socketIO.config'
import { ConversationsGroupMessage } from '~/models/schemas/ConversationsGroupMessage.chema'

const users: {
  [key: string]: {
    socket_id: string
  }
} = {}

const setupSocket = (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
  })

  io.use(async (socket, next) => {
    const { Authoriration } = socket.handshake.auth
    try {
      const decode_authorization = await verifyAccessToken(Authoriration)
      const { verify } = decode_authorization as TokenPayload
      if (verify !== UserVerifyStatus.Unverify) {
        new ErrorWithStatusCode({
          message: userMessages.USER_NOT_VERIFIED,
          statusCode: HttpStatusCode.Forbidden
        })
      }
      socket.handshake.auth.decode_authorization = decode_authorization
      socket.handshake.auth.access_token = Authoriration
      next()
    } catch (error) {
      next(new Error('Unauthorized'))
    }
  })

  io.on(socketIOConversations.CONNECTIONS, (socket) => {
    const { user_id } = socket.handshake.auth.decode_authorization as TokenPayload
    users[user_id] = {
      socket_id: socket.id
    }

    socket.use(async (packet: any, next: any) => {
      const { access_token } = socket.handshake.auth
      try {
        await verifyAccessToken(access_token)
        next()
      } catch (error) {
        next(new Error('Unauthorized'))
      }
    })

    socket.on(socketIOConversations.ERROR, (error: any) => {
      if (error.message === 'Unauthorized') {
        socket.disconnect()
      }
    })

    socket.on(socketIOConversations.PRIVATE_MESSAGE, async (data: MessagePrivatePayloadType) => {
      const { payload } = data
      const receiver_socket_id = users[payload.receiver_id]?.socket_id
      const conversation = new Conversation({
        sender_id: new ObjectId(payload.sender_id as string),
        receiver_id: new ObjectId(payload.receiver_id as string),
        content: payload.content,
        image_url: payload.image_url,
        video_url: payload.video_url,
        document_url: payload.document_url
      })
      const result = await databaseService.conversations.insertOne(conversation)
      conversation._id = result.insertedId
      if (receiver_socket_id) {
        socket.to(receiver_socket_id).emit(socketIOConversations.RECEIVE_PRIVATE_MESSAGE, {
          payload: conversation
        })
      }
    })

    socket.on(socketIOConversations.GROUP_MESSAGE, async (data: MessageGroupPayloadType) => {
      const { payload } = data
      const conversationsGroupMessage = new ConversationsGroupMessage({
        group_id: new ObjectId(payload.group_id as string),
        sender_id: new ObjectId(payload.sender_id as string),
        content: payload.content,
        image_url: payload.image_url,
        video_url: payload.video_url,
        document_url: payload.document_url
      })

      const [groupConversations] = await Promise.all([
        databaseService.conversationGroups
          .find({
            _id: new ObjectId(payload.group_id as string)
          })
          .toArray(),
        databaseService.conversationGroupMessages.insertOne(conversationsGroupMessage),
        databaseService.conversationGroups.updateOne(
          {
            _id: new ObjectId(payload.group_id as string)
          },
          {
            $set: {
              last_time_message: new Date()
            }
          }
        )
      ])

      if (groupConversations.length > 0) {
        groupConversations[0].members.forEach((member_id: ObjectId) => {
          if (member_id.toString() !== payload.sender_id) {
            const receiver_socket_id = users[member_id.toString()]?.socket_id
            if (receiver_socket_id) {
              socket.to(receiver_socket_id).emit(socketIOConversations.RECEIVE_GROUP_MESSAGE, {
                payload: conversationsGroupMessage
              })
            }
          }
        })
      }
    })

    socket.on(socketIOConversations.DISCONNECT, () => {
      const disconnect_time = new Date()
      for (const [sender_id, sender] of Object.entries(users)) {
        if (sender_id !== user_id) {
          socket.to(sender.socket_id).emit(socketIOConversations.RECEIVER_DISCONNECTED, {
            receiver_id: user_id,
            disconnect_time
          })
        }
      }

      delete users[user_id]
    })

    socket.on(socketIOConversations.RECONNECT, () => {
      users[user_id] = {
        socket_id: socket.id
      }
      for (const [sender_id, sender] of Object.entries(users)) {
        if (sender_id !== user_id) {
          socket.to(sender.socket_id).emit(socketIOConversations.RECEIVER_ONLINE, {
            receiver_id: user_id
          })
        }
      }
    })
  })

  return io
}

export default setupSocket
