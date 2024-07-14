import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import usersService from '../../services/users.services'
import { RegisterRequestBody } from '~/models/requestes/User.requests'
export const loginController = (req: Request, res: Response) => {
  res.json({ message: req.body })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterRequestBody>, res: Response) => {
  try {
    const result = await usersService.register(req.body)
    return res.status(200).json({
      success: true,
      message: 'User registered successfully',
      result
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Registration failed ${error}`
    })
  }
}
