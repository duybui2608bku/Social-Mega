import { Router } from 'express'
import { uploadleImageController } from '~/controllers/medias.controllers'
import { wrapRequestHandler } from '~/utils/handlers'
const mediaRouters = Router()

mediaRouters.post('/image', wrapRequestHandler(uploadleImageController))

export default mediaRouters
