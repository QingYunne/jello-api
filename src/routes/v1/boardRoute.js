import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardController } from '~/controllers/boardController'
import { asyncHandler } from '~/helpers/asyncHandler'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { boardValidation } from '~/validations/boardValidation'

const Router = express.Router()

Router.use(asyncHandler(authMiddleware.isAuthorized))

Router.route('/')
  .get(asyncHandler(boardController.getAllBoards))
  .post(
    asyncHandler(boardValidation.create),
    asyncHandler(boardController.createBoard)
  )

Router.route('/:id')
  .get(asyncHandler(boardController.getBoard))
  .patch(
    asyncHandler(boardValidation.update),
    asyncHandler(boardController.updateBoard)
  )

export const boardRoute = Router
