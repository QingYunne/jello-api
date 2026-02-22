import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
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

const moveCardToDiffColumn = async (cardId, data) => {
  if (!cardId)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Card ID is required')
  const foundCard = await cardModel.existById(cardId)
  if (!foundCard) throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found')
  const prevColumnId = foundCard.columnId

  const foundNextColumn = await columnModel.existById(data.nextColumnId)
  if (!foundNextColumn)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Next column not found')
  const prevCardOrderIds = data.prevCardOrderIds.map((id) => new ObjectId(id))
  await columnModel.update(prevColumnId, {
    setData: { cardOrderIds: prevCardOrderIds }
  })
  const nextCardOrderIds = data.nextCardOrderIds.map((id) => new ObjectId(id))
  await columnModel.update(data.nextColumnId, {
    setData: { cardOrderIds: nextCardOrderIds }
  })

  const updatedCard = await cardModel.update(foundCard._id, {
    setData: { columnId: foundNextColumn._id }
  })
  if (!updatedCard) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to update card column'
    )
  }
}

export const cardService = {
  createCard,
  moveCardToDiffColumn
}
