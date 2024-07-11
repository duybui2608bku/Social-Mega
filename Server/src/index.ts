import express from 'express'
import userRouters from '~/routes/users.routes'
import databaseService from '../services/database.services'
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/users', userRouters)
databaseService.connect()
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
