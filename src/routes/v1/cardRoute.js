import express from 'express'
import { cardController } from '~/controllers/cardController'
import { asyncHandler } from '~/helpers/asyncHandler'
import { authMiddleware } from '~/middlewares/authMiddleware'
import {
  handleMulterError,
  uploadMiddleware
} from '~/middlewares/multerUploadMiddleware'
import { cardValidation } from '~/validations/cardValidation'

const Router = express.Router()

Router.use(asyncHandler(authMiddleware.isAuthorized))

Router.route('/').post(
  asyncHandler(cardValidation.create),
  asyncHandler(cardController.createCard)
)

Router.route('/:id').patch(
  asyncHandler(cardValidation.update),
  asyncHandler(cardController.updateCard)
)

Router.route('/:id/cover').put(
  asyncHandler(uploadMiddleware('CARD_COVER')),
  handleMulterError,
  asyncHandler(cardController.uploadCardCover)
)
Router.route('/:id/move').patch(
  asyncHandler(cardValidation.moveCardToDiffColumn),
  asyncHandler(cardController.moveCardToDiffColumn)
)

export const cardRoute = Router
