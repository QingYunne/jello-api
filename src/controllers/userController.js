import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'
import ms from 'ms'

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
  res.cookie('accessToken', userInfo.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ms('14d')
  })
  res.cookie('refreshToken', userInfo.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ms('14d')
  })
  res.status(StatusCodes.OK).json(userInfo)
}

const logout = async (req, res, next) => {
  res.clearCookie('accessToken')
  res.clearCookie('refreshToken')

  res.status(StatusCodes.OK).json({ logout: true })
}

const refreshToken = async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken
  const tokens = await userService.refreshToken(refreshToken)
  res.cookie('accessToken', tokens.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ms('14d')
  })
  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ms('14d')
  })
  res.status(StatusCodes.OK).json({ refreshToken: true })
}

const updateUser = async (req, res, next) => {
  const userId = req.jwtDecoded._id
  const updatedUser = await userService.update(userId, req.body)
  res.status(StatusCodes.OK).json(updatedUser)
}

export const userController = {
  registerUser,
  verifyUser,
  loginUser,
  logout,
  refreshToken,
  updateUser
}
