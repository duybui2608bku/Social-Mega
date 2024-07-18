import jwt, { SignOptions } from 'jsonwebtoken'
import { config } from 'dotenv'
import { ErrorWithStatusCode } from '~/models/Errors'
import { HttpStatusCode } from '~/constants/enum'
import { TokenPayload } from '~/models/requestes/User.requests'
config()
export const signToken = ({
  payload,
  priveKey,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | Buffer | object
  priveKey: string
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

export const verifyToken = ({ token, secretOrPublicKey }: { token: string; secretOrPublicKey: string }) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (error, decoded) => {
      if (error) {
        throw new ErrorWithStatusCode({ message: error.message, statusCode: HttpStatusCode.Unauthorized })
      }
      resolve(decoded as TokenPayload)
    })
  })
}
