import { slugify } from '~/utils/formatters'
import boardModel from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'

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

const updateBoard = async (boardId, data) => {
  const pushData = {}
  const setData = {}
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'columnOrderIds') {
      setData[key] = value.map((id) => new ObjectId(id))
    } else {
      setData[key] = value
    }
  })
  return await boardModel.update(boardId, { pushData, setData })
}

const pushColumnOrderIds = async (boardId, columnId) => {
  const data = { columnOrderIds: new ObjectId(columnId) }
  return await boardModel.update(boardId, { pushData: data })
}

export const boardService = {
  createBoard,
  getBoard,
  updateBoard,
  pushColumnOrderIds
}
