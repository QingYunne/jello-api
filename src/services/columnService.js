import { StatusCodes } from 'http-status-codes'
import boardModel from '~/models/boardModel'
import columnModel from '~/models/columnModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'
import { boardService } from './boardService'
import { ObjectId } from 'mongodb'
import { cardService } from './cardService'

const createColumn = async (column) => {
  const foundBoard = await boardModel.existById(column.boardId)
  if (!foundBoard) throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
  const newColumn = { ...column, slug: slugify(column.title) }
  const createdColumn = await columnModel.create(newColumn)
  const updatedBoard = await boardService.pushColumnOrderIds(
    createdColumn.boardId,
    createdColumn._id
  )
  if (!updatedBoard) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to add column to board'
    )
  }
  return { ...createdColumn, cards: [] }
}

const updateColumn = async (columnId, data) => {
  const pushData = {}
  const setData = {}
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'cardOrderIds') {
      setData[key] = value.map((id) => new ObjectId(id))
    } else {
      setData[key] = value
    }
  })
  return await columnModel.update(columnId, { pushData, setData })
}

const deleteColumn = async (columnId) => {
  const foundColumn = await columnModel.existById(columnId)
  if (!foundColumn)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found')
  const deletedColumn = await columnModel.deleteById(columnId)
  if (deletedColumn.deletedCount === 0) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to delete column'
    )
  }
  const deletedCards = await cardService.deleteManyByColumnId(columnId)
  const updatedBoard = await boardService.pullColumnOrderIds(
    foundColumn.boardId,
    columnId
  )
  if (!updatedBoard) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to remove column from board'
    )
  }
  return { deleteResult: 'Column and its cards deleted successfully' }
}

export const columnService = {
  createColumn,
  updateColumn,
  deleteColumn
}
