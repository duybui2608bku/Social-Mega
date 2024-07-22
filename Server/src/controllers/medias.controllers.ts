import { NextFunction, Request, Response } from 'express'
import mediasService from '../../services/medias.services'
import { HttpStatusCode } from '~/constants/enum'

export const uploadSingleImage = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediasService.handleUploadSingleImage(req)
  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message: 'Upload image successfully',
    result
  })
}
