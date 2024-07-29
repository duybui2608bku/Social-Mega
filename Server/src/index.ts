import express from 'express'
import userRouters from '~/routes/users.routes'
import databaseService from '../services/database.services'
import { defaultErrorHandler } from './middlewares/errorsMiddlewares'
import mediaRouters from './routes/medias.routes'
import { initFolder } from './utils/file'
import { config } from 'dotenv'
// import { UPLOAD_IMAGE_DIR, UPLOAD_IMAGE_TERM_DIR } from './constants/dir'
import staticRouter from './routes/static.routes'
config()

databaseService.connect()
const app = express()
const port = process.env.PORT || 8081
initFolder()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/users', userRouters)
app.use('/upload', mediaRouters)
app.use(defaultErrorHandler)
// app.use('/static', express.static(UPLOAD_IMAGE_DIR))
app.use('/static', staticRouter)
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
