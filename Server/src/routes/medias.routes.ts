import { Router } from 'express'
import { uploadSingleImage } from '~/controllers/medias.controllers'
import { wrapRequestHandler } from '~/utils/handlers'
const mediaRouters = Router()

mediaRouters.post('/image', wrapRequestHandler(uploadSingleImage))

export default mediaRouters
