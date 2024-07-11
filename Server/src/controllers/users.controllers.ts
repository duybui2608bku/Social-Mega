import { Request, Response } from 'express'
import usersService from '../../services/users.services'
export const loginController = (req: Request, res: Response) => {
  res.json({ message: req.body })
}

export const registerController = async (req: Request, res: Response) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' })
  }
  try {
    const results = await usersService.register({ email, password })
    return res.status(200).json({
      success: true,
      message: 'User registered successfully',
      results
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Registration failed ${error}`
    })
  }
}
