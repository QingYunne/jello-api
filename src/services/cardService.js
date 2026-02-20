import { StatusCodes } from 'http-status-codes'
import boardModel from '~/models/boardModel'
import cardModel from '~/models/cardModel'
import columnModel from '~/models/columnModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'

const createCard = async (card) => {
  const foundBoard = await boardModel.existById(card.boardId)
  if (!foundBoard) throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
  const foundColumn = await columnModel.existById(card.columnId)
  if (!foundColumn)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found')
  const newCard = { ...card, slug: slugify(card.title) }
  const createdCard = await cardModel.create(newCard)
  const updatedColumn = await columnModel.addCardOrderIds(createdCard)
  if (!updatedColumn) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to add card to column'
    )
  }
  return createdCard
}

export const cardService = {
  createCard
}
