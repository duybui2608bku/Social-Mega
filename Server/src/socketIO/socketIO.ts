import { Server } from 'socket.io'
import { ObjectId } from 'mongodb'
import { Conversation } from '../models/schemas/Conversations.schema'
import databaseService from '../../services/database.services'
import { verifyAccessToken } from '~/utils/other'
import { TokenPayload } from '~/models/requestes/User.requests'
import { HttpStatusCode, UserVerifyStatus } from '~/constants/enum'
import { ErrorWithStatusCode } from '~/models/Errors'
import { userMessages } from '~/constants/messages'

const users: {
  [key: string]: {
    socket_id: string
    connected_at: Date
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

  io.on('connection', (socket) => {
    const { user_id } = socket.handshake.auth.decode_authorization as TokenPayload
    users[user_id] = {
      socket_id: socket.id,
      connected_at: new Date()
    }

    socket.use(async (packet, next) => {
      const { access_token } = socket.handshake.auth
      try {
        await verifyAccessToken(access_token)
        next()
      } catch (error) {
        next(new Error('Unauthorized'))
      }
    })

    socket.on('error', (error) => {
      if (error.message === 'Unauthorized') {
        socket.disconnect()
      }
    })

    socket.on('private message', async (data) => {
      const { payload } = data
      const receiver_socket_id = users[payload.receiver_id]?.socket_id
      const conversation = new Conversation({
        sender_id: new ObjectId(payload.sender_id),
        receiver_id: new ObjectId(payload.receiver_id),
        content: payload.content
      })
      const result = await databaseService.conversations.insertOne(conversation)
      conversation._id = result.insertedId
      if (receiver_socket_id) {
        socket.to(receiver_socket_id).emit('receive private message', {
          payload: conversation
        })
      }
    })

    socket.on('disconnect', () => {
      const disconnect_time = new Date()
      for (const [sender_id, sender] of Object.entries(users)) {
        if (sender_id !== user_id) {
          socket.to(sender.socket_id).emit('receiver disconnected', {
            receiver_id: user_id,
            disconnect_time
          })
        }
      }

      delete users[user_id]
    })

    socket.on('reconnect', () => {
      users[user_id] = {
        socket_id: socket.id,
        connected_at: new Date()
      }
      for (const [sender_id, sender] of Object.entries(users)) {
        if (sender_id !== user_id) {
          socket.to(sender.socket_id).emit('receiver online', {
            receiver_id: user_id
          })
        }
      }
    })
  })

  return io
}

export default setupSocket
