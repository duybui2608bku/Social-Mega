import express from 'express'
import userRouters from '~/routes/users.routes'
import databaseService from '../services/database.services'
import { defaultErrorHandler } from './middlewares/errorsMiddlewares'
import mediaRouters from './routes/medias.routes'
import { initFolder } from './utils/file'
import { config } from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import staticRouter from './routes/static.routes'
import '~/utils/s3'
config()

import cors from 'cors'
import InstagramsRouters from './routes/instagrams.routes'
import bookmarkRouters from './routes/bookmark.routes'
import searchRouters from './routes/search.routes'
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}

databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshTokens()
  databaseService.indexFollowers()
  databaseService.indexInstagrams()
})
const app = express()
const httpServer = createServer(app)
const port = process.env.PORT || 8081
initFolder()
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/users', userRouters)
app.use('/upload', mediaRouters)
app.use('/instagrams', InstagramsRouters)
app.use('/bookmark', bookmarkRouters)
app.use('/search', searchRouters)
app.use('/static', staticRouter)
app.use(defaultErrorHandler)
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
})

const users: {
  [key: string]: {
    socket_id: string
  }
} = {}
io.on('connection', (socket) => {
  console.log(`${socket.id} connected`)
  const user_id = socket.handshake.auth._id
  users[user_id] = {
    socket_id: socket.id
  }
  console.log(users)
  socket.on('private message', ({ content, to }) => {
    const receiver_socket_id = users[to]?.socket_id
    if (!receiver_socket_id) {
      return
    }
    socket.to(receiver_socket_id).emit('receive private message', {
      content,
      from: user_id
    })
  })
  socket.on('disconnect', () => {
    delete users[user_id]
    console.log(`${socket.id} disconnected`)
  })
})
httpServer.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
