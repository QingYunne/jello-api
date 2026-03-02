import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import { JwtProvider } from '~/providers/JwtProvider'
import ApiError from '~/utils/ApiError'

const isAuthorized = async (req, res, next) => {
  const accessToken = req.cookies?.accessToken
  if (!accessToken) {
    return next(
      new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! Token not found')
    )
  }
  const decoded = await JwtProvider.verifyToken(
    accessToken,
    env.ACCESS_TOKEN_SECRET_KEY
  )
  req.jwtDecoded = decoded
  next()
}

export const authMiddleware = { isAuthorized }
