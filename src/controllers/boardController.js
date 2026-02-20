import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'

const createBoard = async (req, res, next) => {
  const createdBoard = await boardService.createBoard(req.body)
  res.status(StatusCodes.CREATED).json(createdBoard)
}

const getBoard = async (req, res, next) => {
  const boardId = req.params.id
  const board = await boardService.getBoard(boardId)
  res.status(StatusCodes.OK).json(board)
}

export const boardController = {
  createBoard,
  getBoard
}
