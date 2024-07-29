import { Router } from 'express'
import { uploadleImageController, uploadleVideoController } from '~/controllers/medias.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const mediaRouters = Router()

mediaRouters.post('/image', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(uploadleImageController))
mediaRouters.post('/video', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(uploadleVideoController))
export default mediaRouters
