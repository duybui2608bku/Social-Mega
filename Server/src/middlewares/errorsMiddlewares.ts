import { NextFunction, Request, Response } from 'express'
import { HttpStatusCode } from '~/constants/enum'
import { omit } from 'lodash'
export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.statusCode || HttpStatusCode.InternalServerError).json(omit(err, 'statusCode'))
}
