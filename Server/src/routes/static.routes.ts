import { Router } from 'express'
import { serverImageController } from '~/controllers/medias.controllers'

const staticRouter = Router()
staticRouter.get('/image/:name', serverImageController)
export default staticRouter
