import express from 'express'
import { columnController } from '~/controllers/columnController'
import { asyncHandler } from '~/helpers/asyncHandler'
import { columnValidation } from '~/validations/columnValidation'

const Router = express.Router()

Router.route('/').post(
  columnValidation.create,
  asyncHandler(columnController.createColumn)
)

Router.route('/:id').patch(
  asyncHandler(columnValidation.update),
  asyncHandler(columnController.updateColumn)
)

export const columnRoute = Router
