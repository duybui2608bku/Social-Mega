import { Request } from 'express'
import User from './models/schemas/User.schema'
import { TokenPayload } from './models/requestes/User.requests'
import Instagrams from './models/schemas/Instagrams.schema'
import { userStatus } from '~/constants/enum'
declare module 'express' {
  interface Request {
    user?: User
    decode_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
    decoded_email_verify_token?: TokenPayload
    decoded_forgot_password_token?: TokenPayload
    instagram?: Instagrams
    statusUser?: userStatus
  }
}
