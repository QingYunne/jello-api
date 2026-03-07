import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { UPLOAD_TYPE_KEY } from '~/config/uploadConfig'
import boardModel from '~/models/boardModel'
import cardModel from '~/models/cardModel'
import columnModel from '~/models/columnModel'
import { getMultipleTransformedUrls } from '~/providers/CloudinaryProvider'
import ApiError from '~/utils/ApiError'
import { RESOURCE_TYPES } from '~/utils/constants'
import { slugify } from '~/utils/formatters'
import { uploadService } from './uploadService'

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

const updateCard = async (cardId, data) => {
  const foundCard = await cardModel.existById(cardId)
  if (!foundCard) throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found!')
  const updatedCard = await cardModel.update(cardId, { setData: data })
  if (!updatedCard)
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to update card'
    )
  return updatedCard
}

const updateCardCover = async (cardId, fileBuffer) => {
  const foundCard = await cardModel.existById(cardId)
  if (!foundCard) throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found')
  const uploadResult = await uploadService.uploadFile(
    fileBuffer,
    UPLOAD_TYPE_KEY.CARD_COVER
  )
  if (foundCard.cover)
    await uploadService.deleteOldFile(foundCard.cover, RESOURCE_TYPES.IMAGE)
  const updatedCard = await cardModel.update(cardId, {
    setData: { cover: uploadResult.publicId }
  })
  if (!updatedCard)
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to upload card cover'
    )
  return getCardWithCover(updatedCard)
}

const moveCardToDiffColumn = async (cardId, data) => {
  const foundCard = await cardModel.existById(cardId)
  if (!foundCard) throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found!')
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
  return updateCard
}

const deleteManyByColumnId = async (columnId) => {
  return await cardModel.deleteMany({ columnId: new ObjectId(columnId) })
}

const getCardWithCover = (card) => {
  if (card?.cover) {
    const coverUrls = uploadService.getTransformedUrls(
      card.cover,
      UPLOAD_TYPE_KEY.CARD_COVER
    )
    card.coverUrls = coverUrls
  }
  return card
}

export const cardService = {
  createCard,
  updateCard,
  moveCardToDiffColumn,
  deleteManyByColumnId,
  getCardWithCover,
  updateCardCover
}
