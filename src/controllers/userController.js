import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'

const registerUser = async (req, res, next) => {
  const { email, password } = req.body
  const createdUser = await userService.register({ email, password })
  return res.status(StatusCodes.CREATED).json(createdUser)
}

const verifyUser = async (req, res, next) => {
  const { email, token } = req.body
  const userInfo = await userService.verify({ email, token })
  return res.status(StatusCodes.OK).json(userInfo)
}

const loginUser = async (req, res, next) => {
  const { email, password } = req.body
  const userInfo = await userService.login({ email, password })
  res.status(StatusCodes.OK).json(userInfo)
}

export const userController = { registerUser, verifyUser, loginUser }
