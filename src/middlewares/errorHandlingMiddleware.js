/* eslint-disable no-unused-vars */
import { StatusCodes } from 'http-status-codes'
import { log } from 'node:console'
import { env } from '~/config/environment'

export const errorHandlingMiddleware = (err, req, res, next) => {
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

  const responseError = {
    statusCode: err.statusCode,
    message: err.message || StatusCodes[err.statusCode],
    stack: err.stack
  }

  if (env.BUILD_MODE !== 'dev') delete responseError.stack

  // Set headers BEFORE sending the response
  res.set({
    'Cache-Control': 'no-store',
    Pragma: 'no-cache',
    Expires: '0'
  })

  res.status(responseError.statusCode).json(responseError)
}
