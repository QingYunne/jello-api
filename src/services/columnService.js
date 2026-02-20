import { StatusCodes } from 'http-status-codes'
import boardModel from '~/models/boardModel'
import columnModel from '~/models/columnModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'

const createColumn = async (column) => {
  const foundBoard = boardModel.existById(column.boardId)
  if (!foundBoard) throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
  const newColumn = { ...column, slug: slugify(column.title) }
  const createdColumn = await columnModel.create(newColumn)
  const updatedBoard = await boardModel.addColumnOrderIds(createdColumn)
  if (!updatedBoard) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to add column to board'
    )
  }
  return { ...createdColumn, cards: [] }
}

export const columnService = {
  createColumn
}
