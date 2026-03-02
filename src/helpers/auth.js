import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'

const {
  ACCESS_TOKEN_SECRET_KEY,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_EXPIRES_IN
} = env

export const createTokenPair = async (payload) => {
  const [accessToken, refreshToken] = await Promise.all([
    JwtProvider.generateToken(
      payload,
      ACCESS_TOKEN_SECRET_KEY,
      ACCESS_TOKEN_EXPIRES_IN
    ),
    JwtProvider.generateToken(
      payload,
      REFRESH_TOKEN_SECRET_KEY,
      REFRESH_TOKEN_EXPIRES_IN
    )
  ])

  return {
    accessToken,
    refreshToken
  }
}
