import express from 'express'
import { userController } from '~/controllers/userController'
import { asyncHandler } from '~/helpers/asyncHandler'
import { userValidation } from '~/validations/userValidation'

const Router = express.Router()

Router.route('/register').post(
  asyncHandler(userValidation.create),
  asyncHandler(userController.registerUser)
)

Router.route('/verify').put(
  asyncHandler(userValidation.verify),
  asyncHandler(userController.verifyUser)
)

Router.route('/login').post(
  asyncHandler(userValidation.login),
  asyncHandler(userController.loginUser)
)

Router.route('/logout').post(asyncHandler(userController.logout))

Router.route('/refresh_token').get(asyncHandler(userController.refreshToken))

export const userRouter = Router
