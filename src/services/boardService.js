import { slugify } from '~/utils/formatters'
import boardModel from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { cardService } from './cardService'
import { userService } from './userService'

export const DEFAULT_PAGE = '1'
export const DEFAULT_LIMIT = '12'

const createBoard = async (userId, board) => {
  const newBoard = { ...board, slug: slugify(board.title) }
  return await boardModel.create(userId, newBoard)
}

const getBoard = async (userId, boardId) => {
  const board = await boardModel.find(userId, boardId)
  if (!board) throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')

  const cardsByColumn = {}
  board.cards.forEach((card) => {
    const columnId = card.columnId.toString()
    if (!cardsByColumn[columnId]) {
      cardsByColumn[columnId] = []
    }
    cardsByColumn[columnId].push(cardService.getCardWithCover(card))
  })

  board.columns.forEach((column) => {
    const columnId = column._id.toString()
    column.cards = cardsByColumn[columnId] || []
  })

  board.owners = board.owners?.map((owner) =>
    userService.getUserWithAvatarUrl(owner)
  )
  board.members = board.members?.map((member) =>
    userService.getUserWithAvatarUrl(member)
  )

  delete board.cards
  return board
}

const getAllBoards = async (
  userId,
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT
) => {
  return await boardModel.findAll(
    userId,
    parseInt(page, 10),
    parseInt(limit, 10)
  )
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

const pullColumnOrderIds = async (boardId, columnId) => {
  const data = { columnOrderIds: new ObjectId(columnId) }
  return await boardModel.update(boardId, { pullData: data })
}

export const boardService = {
  createBoard,
  getBoard,
  getAllBoards,
  updateBoard,
  pushColumnOrderIds,
  pullColumnOrderIds
}
