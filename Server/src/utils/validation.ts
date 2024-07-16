import { NextFunction, Request, Response } from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import { ReturnDocument } from 'mongodb'
import { HttpStatusCode } from '~/constants/enum'
import { EntityError, ErrorWithStatusCode } from '~/models/Errors'

export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await validation.run(req)
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    const errorsObject = errors.mapped()
    console.log(errorsObject)
    const entityErrors = new EntityError({ errors: {} })
    for (const key in errorsObject) {
      const { msg } = errorsObject[key]
      if (msg instanceof ErrorWithStatusCode && msg.statusCode !== HttpStatusCode.UnprocessableEntity) {
        return next(msg)
      }
      entityErrors.errors[key] = errorsObject[key]
    }
    next(entityErrors)
  }
}
