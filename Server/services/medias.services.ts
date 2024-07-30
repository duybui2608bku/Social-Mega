import { Request } from 'express'
import { getNameFromFullName, handleUploadImage, handleUploadVideo, handleUploadVideoHLS } from '../src/utils/file'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import path from 'path'
import fs from 'fs'
import { isProduction } from '~/constants/config'
import { config } from 'dotenv'
import { MediaType } from '~/constants/enum'
import { Media } from '~/models/other'
import { encodeHLSWithMultipleVideoStreams } from '~/utils/video'
config()
class MediasService {
  async UploadImage(req: Request) {
    const file = await handleUploadImage(req)
    const results: Media[] = await Promise.all(
      file.map(async (file) => {
        const newName = getNameFromFullName(file.newFilename)
        const newPath = path.resolve(UPLOAD_IMAGE_DIR + `\\${newName}.jpg`)
        await sharp(file.filepath).jpeg().toFile(newPath)
        fs.unlinkSync(file.filepath)
        return {
          url: !isProduction
            ? `${process.env.HOST}/static/image/${newName}.jpg`
            : `http://localhost:${process.env.PORT}/static/image/${newName}.jpg`,
          type: MediaType.Image
        }
      })
    )
    return results
  }

  async UploadVideo(req: Request) {
    const file = await handleUploadVideo(req)
    const { newFilename } = file[0]
    // const results: Media[] = await Promise.all(
    //   file.map(async (file) => {
    //     const newName = getNameFromFullName(file.newFilename)
    //     const newPath = path.resolve(UPLOAD_IMAGE_DIR + `\\${newName}.jpg`)
    //     await sharp(file.filepath).jpeg().toFile(newPath)
    //     fs.unlinkSync(file.filepath)
    //     return {
    //       url: !isProduction
    //         ? `${process.env.HOST}/static/image/${newName}.jpg`
    //         : `http://localhost:${process.env.PORT}/static/image/${newName}.jpg`,
    //       type: MediaType.Image
    //     }
    //   })
    // )
    return {
      url: !isProduction
        ? `${process.env.HOST}/static/video/${newFilename}`
        : `http://localhost:${process.env.PORT}/static/video/${newFilename}`,
      type: MediaType.Video
    }
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
    console.log(results)
    return results
  }
}
const mediasService = new MediasService()
export default mediasService
