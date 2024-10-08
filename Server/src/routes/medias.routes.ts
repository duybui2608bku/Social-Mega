import { Router } from 'express'
import {
  uploadleDocumentController,
  uploadleImageController,
  uploadleVideoController,
  uploadleVideoHLSController
} from '../controllers/medias.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const mediaRouters = Router()

mediaRouters.post('/image', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(uploadleImageController))
mediaRouters.post('/video', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(uploadleVideoController))
mediaRouters.post(
  '/document',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(uploadleDocumentController)
)
mediaRouters.post(
  '/video-hls',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(uploadleVideoHLSController)
)
export default mediaRouters
