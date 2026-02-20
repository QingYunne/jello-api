import express from 'express'
import { cardController } from '~/controllers/cardController'
import { asyncHandler } from '~/helpers/asyncHandler'
import { cardValidation } from '~/validations/cardValidation'

const Router = express.Router()

Router.route('/').post(
  cardValidation.createNew,
  asyncHandler(cardController.createCard)
)

export const cardRoute = Router
