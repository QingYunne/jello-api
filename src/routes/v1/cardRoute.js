import express from 'express'
import { cardController } from '~/controllers/cardController'
import { asyncHandler } from '~/helpers/asyncHandler'
import { cardValidation } from '~/validations/cardValidation'

const Router = express.Router()

Router.route('/').post(
  asyncHandler(cardValidation.create),
  asyncHandler(cardController.createCard)
)
Router.route('/:id/move').patch(asyncHandler(cardValidation.moveCardToDiffColumn), asyncHandler(cardController.moveCardToDiffColumn))

export const cardRoute = Router
