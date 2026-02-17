import { slugify } from '~/utils/formatters'
import boardModel from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createBoard = async (board) => {
  const newBoard = { ...board, slug: slugify(board.title) }
  return await boardModel.create(newBoard)
}

const getBoard = async (boardId) => {
  const board = await boardModel.find(boardId)
  if (!board) throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
  return board
}

export const boardService = {
  createBoard,
  getBoard
}
