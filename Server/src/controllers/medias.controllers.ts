import { NextFunction, Request, Response } from 'express'
import mediasService from '../../services/medias.services'
import { HttpStatusCode } from '~/constants/enum'
import { userMessages } from '~/constants/messages'
import { config } from 'dotenv'
import path from 'path'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEO_TERM_DIR } from '~/constants/dir'
config()
export const uploadleImageController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediasService.UploadImage(req)
  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message: userMessages.UPLOAD_IMAGE_SUCCESS,
    result
  })
}

export const uploadleVideoController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediasService.UploadVideo(req)
  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message: userMessages.UPLOAD_VIDEO_SUCCESS,
    result
  })
}

export const serverImageController = async (req: Request, res: Response) => {
  const { name } = req.params
  return res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, name), (err) => {
    if (err) {
      return res.status(HttpStatusCode.NotFound).json({
        success: false,
        message: err.message
      })
    }
  })
}

export const serverVideoController = async (req: Request, res: Response) => {
  const { name } = req.params
  return res.sendFile(path.resolve(UPLOAD_VIDEO_DIR, name), (err) => {
    if (err) {
      return res.status(HttpStatusCode.NotFound).json({
        success: false,
        message: err.message
      })
    }
  })
}
