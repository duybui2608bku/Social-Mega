import { HttpStatusCode } from '~/constants/enum'
import { userMessages } from '~/constants/messages'
import { ErrorWithStatusCode } from '~/models/Errors'
import { verifyToken } from './jwt'
import { capitalize } from 'lodash'
import { JsonWebTokenError } from 'jsonwebtoken'
import { Request } from 'express'

export const numberEnumToArr = (numberEnum: { [key: string]: string | number }) => {
  return Object.values(numberEnum).filter((value) => typeof value === 'number')
}

export const verifyAccessToken = async (access_token: string, req?: Request) => {
  if (!access_token) {
    throw new ErrorWithStatusCode({
      message: userMessages.ACCESS_TOKEN_REQUIRED,
      statusCode: HttpStatusCode.Unauthorized
    })
  }
  try {
    const decode_authorization = await verifyToken({
      token: access_token,
      secretOrPublicKey: process.env.JWT_SECRET_ACCESSTOKEN as string
    })
    if (req) {
      ;(req as Request).decode_authorization = decode_authorization
      return true
    }

    return req ? true : decode_authorization
  } catch (error) {
    throw new ErrorWithStatusCode({
      message: capitalize((error as JsonWebTokenError).message),
      statusCode: HttpStatusCode.Unauthorized
    })
  }
}

export function getContentTypeByExtension(ext: string): string {
  const mimeTypes: { [key: string]: string } = {
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
    '.mkv': 'video/x-matroska',
    '.webm': 'video/webm',
    '.dwg': 'application/acad'
  }

  return mimeTypes[ext] || 'application/octet-stream'
}
