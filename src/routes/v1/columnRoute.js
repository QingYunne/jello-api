import express from 'express'
import { columnController } from '~/controllers/columnController'
import { asyncHandler } from '~/helpers/asyncHandler'
import { columnValidation } from '~/validations/columnValidation'

const Router = express.Router()

Router.route('/').post(
  columnValidation.createNew,
  asyncHandler(columnController.createColumn)
)

export const columnRoute = Router
