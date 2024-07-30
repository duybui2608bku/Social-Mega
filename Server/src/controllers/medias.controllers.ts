import { NextFunction, Request, Response } from 'express'
import mediasService from '../../services/medias.services'
import { HttpStatusCode } from '~/constants/enum'
import { userMessages } from '~/constants/messages'
import path from 'path'
import fs from 'fs'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEO_TERM_DIR } from '~/constants/dir'

let mime: any

async function initializeMime() {
  if (!mime) {
    const mimeModule = await import('mime')
    mime = mimeModule.default
  }
}

export const serverVideoStreamController = async (req: Request, res: Response, next: NextFunction) => {
  await initializeMime()

  const range = req.headers.range

  if (!range) {
    return res.status(HttpStatusCode.BadRequest).json({
      success: false,
      message: 'Range header is required'
    })
  }
  const { name } = req.params
  const filePath = path.resolve(UPLOAD_VIDEO_DIR, name)
  const videoSize = fs.statSync(filePath).size
  const chunkSize = 10 ** 6 // 1MB
  const start = Number(range.replace(/\D/g, ''))
  const end = Math.min(start + chunkSize, videoSize - 1)
  const contentLength = end - start + 1
  const contentType = mime.getType(filePath) || 'video/mp4'
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType
  }
  res.writeHead(HttpStatusCode.PartialContent, headers)
  const videoStream = fs.createReadStream(filePath, { start, end })
  videoStream.pipe(res)
}

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

export const uploadleVideoHLSController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediasService.UploadVideoHLS(req)
  return res.status(HttpStatusCode.Ok).json({
    success: true,
    message: userMessages.UPLOAD_VIDEO_HLS_SUCCESS,
    result
  })
}

export const serverImageController = async (req: Request, res: Response) => {
  const { name } = req.params
  const filePath = path.resolve(UPLOAD_IMAGE_DIR, name)

  fs.access(filePath, fs.constants.F_OK, (accessErr) => {
    if (accessErr) {
      return res.status(HttpStatusCode.NotFound).json({
        success: false,
        message: 'File not found'
      })
    }

    res.sendFile(filePath, (sendErr) => {
      if (sendErr) {
        console.error(sendErr)
        if (!res.headersSent) {
          return res.status(HttpStatusCode.BadRequest).json({
            success: false,
            message: 'Error sending file'
          })
        }
      }
    })
  })
}
