import express from 'express'
import { userController } from '~/controllers/userController'
import { asyncHandler } from '~/helpers/asyncHandler'
import { userValidation } from '~/validations/userValidation'

const Router = express.Router()

Router.route('/register').post(
  asyncHandler(userValidation.create),
  asyncHandler(userController.registerUser)
)
export const userRouter = Router
