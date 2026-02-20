import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardController } from '~/controllers/boardController'
import { asyncHandler } from '~/helpers/asyncHandler'
import { boardValidation } from '~/validations/boardValidation'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API get list board' })
  })
  .post(boardValidation.createNew, asyncHandler(boardController.createBoard))

Router.route('/:id').get(asyncHandler(boardController.getBoard)).put()

export const boardRoute = Router
