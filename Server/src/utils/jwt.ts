import jwt, { SignOptions } from 'jsonwebtoken'
import { config } from 'dotenv'
config()
const signToken = ({
  payload,
  priveKey = process.env.JWT_KEY as string,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | Buffer | object
  priveKey?: string
  options?: SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, priveKey, options, (error, token) => {
      if (error) {
        throw reject(error)
      }
      resolve(token as string)
    })
  })
}

export default signToken
