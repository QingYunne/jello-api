import express from 'express'
import { columnController } from '~/controllers/columnController'
import { asyncHandler } from '~/helpers/asyncHandler'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { columnValidation } from '~/validations/columnValidation'

const Router = express.Router()

Router.use(asyncHandler(authMiddleware.isAuthorized))

Router.route('/').post(
  columnValidation.create,
  asyncHandler(columnController.createColumn)
)

Router.route('/:id')
  .patch(
    asyncHandler(columnValidation.update),
    asyncHandler(columnController.updateColumn)
  )
  .delete(
    asyncHandler(columnValidation.deleteItem),
    asyncHandler(columnController.deleteColumn)
  )

export const columnRoute = Router
