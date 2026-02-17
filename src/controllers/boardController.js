import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'

const createNew = async (req, res, next) => {
  try {
    const createdBoard = await boardService.createBoard(req.body)
    res.status(StatusCodes.CREATED).json(createdBoard)
  } catch (err) {
    next(err)
  }
}

const getBoard = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const board = await boardService.getBoard(boardId)
    res.status(StatusCodes.OK).json(board)
  } catch (err) {
    next(err)
  }
}

export const boardController = {
  createNew,
  getBoard
}
