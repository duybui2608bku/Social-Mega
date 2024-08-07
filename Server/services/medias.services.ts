import { Request } from 'express'
import { getNameFromFullName, handleUploadImage, handleUploadVideo, handleUploadVideoHLS } from '../src/utils/file'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import path from 'path'
import fs from 'fs'
import { isProduction } from '~/constants/config'
import { config } from 'dotenv'
import { MediaType } from '~/constants/enum'
import { Media } from '~/models/other'
import { encodeHLSWithMultipleVideoStreams } from '~/utils/video'
import { uploadFileToS3 } from '~/utils/s3'
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3'
let mime: any

config()
class MediasService {
  async UploadImage(req: Request) {
    const file = await handleUploadImage(req)
    const results: Media[] = await Promise.all(
      file.map(async (file) => {
        const newName = getNameFromFullName(file.newFilename)
        const newFullFileName = `${newName}.jpg`
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, newFullFileName)
        await sharp(file.filepath).jpeg().toFile(newPath)
        const s3Result = await uploadFileToS3({
          filename: newFullFileName,
          filepath: newPath,
          contenType: 'image/jpeg'
        })
        await Promise.all([fs.unlinkSync(file.filepath), fs.unlinkSync(newPath)])
        return {
          url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string,
          type: MediaType.Image
        }
      })
    )
    return results
  }

  async UploadVideo(req: Request) {
    const file = await handleUploadVideo(req)
    const results: Media[] = await Promise.all(
      file.map(async (file) => {
        const newName = getNameFromFullName(file.newFilename)
        const newFullFileName = `${newName}.mp4`
        const newPath = path.resolve(UPLOAD_VIDEO_DIR, newFullFileName)
        const s3Result = await uploadFileToS3({ filename: newFullFileName, filepath: newPath, contenType: 'video/mp4' })
        fs.unlinkSync(newPath)
        return {
          url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string,
          type: MediaType.Video
        }
      })
    )
    return results
  }

  async UploadVideoHLS(req: Request) {
    const file = await handleUploadVideoHLS(req)
    const results: Media[] = await Promise.all(
      file.map(async (file) => {
        await encodeHLSWithMultipleVideoStreams(file.filepath)
        return {
          url: !isProduction
            ? `${process.env.HOST}/static/video-hls/${file.newFilename}`
            : `http://localhost:${process.env.PORT}/static/video-hls/${file.newFilename}`,

          type: MediaType.Video
        }
      })
    )
    return results
  }
}
const mediasService = new MediasService()
export default mediasService
