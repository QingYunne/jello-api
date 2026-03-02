import { StatusCodes } from 'http-status-codes'
import JWT from 'jsonwebtoken'
import ApiError from '~/utils/ApiError'

const generateToken = (payload, privateKey, expiresIn) => {
  return new Promise((resolve, reject) => {
    JWT.sign(
      payload,
      privateKey,
      {
        algorithm: 'HS256',
        expiresIn: expiresIn
      },
      (error, token) => {
        if (error) {
          reject(
            new ApiError(
              StatusCodes.INTERNAL_SERVER_ERROR,
              'Failed to generate token'
            )
          )
        } else {
          resolve(token)
        }
      }
    )
  })
}

const verifyToken = (token, privateKey) => {
  return new Promise((resolve, reject) => {
    JWT.verify(token, privateKey, (error, decoded) => {
      if (error) {
        if (error.name === 'TokenExpiredError') {
          reject(new Error('Token has expired'))
        } else if (error.name === 'JsonWebTokenError') {
          reject(new Error('Invalid token'))
        } else if (error.name === 'NotBeforeError') {
          reject(new Error('Token is not active yet'))
        } else {
          reject(error)
        }
      } else {
        resolve(decoded)
      }
    })
  })
}

export const JwtProvider = {
  generateToken,
  verifyToken
}
