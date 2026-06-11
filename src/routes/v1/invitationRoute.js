import express from 'express'
import { invitationController } from '~/controllers/invitationController'
import { asyncHandler } from '~/helpers/asyncHandler'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { invitationValidation } from '~/validations/invitationValidation'

const Router = express.Router()

Router.use(asyncHandler(authMiddleware.isAuthorized))

Router.route('').get(asyncHandler(invitationController.getInvitations))

Router.route('/board').post(
  asyncHandler(invitationValidation.createBoardInvitation),
  asyncHandler(invitationController.createBoardInvitation)
)

Router.route('/board/:id').patch(
  asyncHandler(invitationController.updateBoardInvitation)
)

export const invitationRoute = Router
