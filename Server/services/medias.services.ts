import { Request } from 'express'
import { getNameFromFullName, handleUploadSingleImage } from '../src/utils/file'
import sharp from 'sharp'
import { UPLOAD_DIR } from '~/constants/dir'
import path from 'path'
class MediasService {
  async handleUploadSingleImage(req: Request) {
    const file = await handleUploadSingleImage(req)
    const newName = getNameFromFullName(file.newFilename)
    const newPath = path.resolve(UPLOAD_DIR + `\\${newName}.jpg`)
    console.log(newPath)
    const info = await sharp(file.filepath).jpeg({ quality: 10 }).toFile(newPath)
    return info
  }
}
const mediasService = new MediasService()
export default mediasService
