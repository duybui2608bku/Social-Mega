import { NextFunction, Request, Response } from 'express'
import { HttpStatusCode } from '~/constants/enum'
import { omit } from 'lodash'
import { ErrorWithStatusCode } from '~/models/Errors'
export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorWithStatusCode) {
    return res.status(err.statusCode).json(omit(err, 'statusCode'))
  }
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true })
  })
  res.status(HttpStatusCode.InternalServerError).json({
    message: err.message,
    infoError: omit(err, 'stack')
  })
}
