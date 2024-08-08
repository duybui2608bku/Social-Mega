import { S3 } from '@aws-sdk/client-s3'
import { config } from 'dotenv'
import { Upload } from '@aws-sdk/lib-storage'
import fs from 'fs'

config()
const s3 = new S3({
  region: process.env.AWS_REGION,
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string
  }
})

const uploadFileToS3 = ({
  filename,
  filepath,
  contenType
}: {
  filename: string
  filepath: string
  contenType: string
}) => {
  const parallelUploads3 = new Upload({
    client: s3,
    params: { Bucket: 'social-megakorea', Key: filename, Body: fs.readFileSync(filepath), ContentType: contenType },
    tags: [],
    queueSize: 4,
    partSize: 1024 * 1024 * 5,
    leavePartsOnError: false
  })
  return parallelUploads3.done()
}

export { uploadFileToS3 }
