import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'

const registerUser = async (req, res, next) => {
  const { email, password } = req.body
  const createdUser = await userService.register({ email, password })
  return res.status(StatusCodes.CREATED).json(createdUser)
}

export const userController = { registerUser }
