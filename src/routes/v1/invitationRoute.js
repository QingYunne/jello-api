import express from 'express'
import { invitationController } from '~/controllers/invitationController'
import { asyncHandler } from '~/helpers/asyncHandler'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { invitationValidation } from '~/validations/invitationValidation'

const Router = express.Router()

Router.use(asyncHandler(authMiddleware.isAuthorized))

Router.route('/board').post(
  asyncHandler(invitationValidation.createBoardInvitation),
  asyncHandler(invitationController.createBoardInvitation)
)

export const invitationRoute = Router
