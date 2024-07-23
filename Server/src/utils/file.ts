import formidable from 'formidable'
import fs from 'fs'
import { Request } from 'express'
import { File } from 'formidable'
import { UPLOAD_TERM_DIR } from '~/constants/dir'
export const handleUploadImage = async (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_TERM_DIR,
    maxFiles: 10,
    keepExtensions: true,
    maxFileSize: 3000 * 1024 * 4,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('Invalid file type') as any)
      }
      return valid
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      if (!files.image) {
        reject(new Error('Image is required'))
      }
      resolve(files.image as File[])
    })
  })
}

export const initFolder = () => {
  if (!fs.existsSync(UPLOAD_TERM_DIR)) {
    fs.mkdirSync(UPLOAD_TERM_DIR, { recursive: true })
  }
}

export const getNameFromFullName = (fullname: string) => {
  const name = fullname.split('.')[0]
  return name
}
