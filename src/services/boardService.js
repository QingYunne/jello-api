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

  const cardsByColumn = {}
  board.cards.forEach((card) => {
    const columnId = card.columnId.toString()
    if (!cardsByColumn[columnId]) {
      cardsByColumn[columnId] = []
    }
    cardsByColumn[columnId].push(card)
  })

  board.columns.forEach((column) => {
    const columnId = column._id.toString()
    column.cards = cardsByColumn[columnId] || []
  })

  delete board.cards
  return board
}

export const boardService = {
  createBoard,
  getBoard
}
