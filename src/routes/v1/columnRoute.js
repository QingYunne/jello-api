import express from 'express'
import { columnController } from '~/controllers/columnController'
import { asyncHandler } from '~/helpers/asyncHandler'
import { columnValidation } from '~/validations/columnValidation'

const Router = express.Router()

Router.route('/').post(
  columnValidation.create, // validation method was named create, not createNew
  asyncHandler(columnController.createColumn)
)

// add update route with validation and controller
Router.route('/:id').patch(
  columnValidation.update,
  asyncHandler(columnController.updateColumn)
)

export const columnRoute = Router
