import express from 'express'
import userRouters from '~/routes/users.routes'
import databaseService from '../services/database.services'
import { defaultErrorHandler } from './middlewares/errorsMiddlewares'
import { omit } from 'lodash'

databaseService.connect()
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/users', userRouters)
app.use(defaultErrorHandler)

app.listen(8081, () => {
  console.log(`Server is running on http://localhost:8081`)
})
