import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardService'

const createCard = async (req, res) => {
  const createdCard = await cardService.createCard(req.body)
  res.status(StatusCodes.CREATED).json(createdCard)
}

const updateCard = async (req, res) => {
  const { id } = req.params
  const updatedCard = await cardService.updateCard(id, req.body)
  res.status(StatusCodes.OK).json(updatedCard)
}

const uploadCardCover = async (req, res) => {
  const { id } = req.params
  const cardCoverBuffer = req.file?.buffer
  const updatedCard = await cardService.updateCardCover(id, cardCoverBuffer)
  res.status(StatusCodes.OK).json(updatedCard)
}

const addCommentToCard = async (req, res) => {
  const cardId = req.params.id
  const userId = req.jwtDecoded._id
  const updatedCard = await cardService.addCommentToCard(
    cardId,
    userId,
    req.body?.commentToAdd
  )
  res.status(StatusCodes.OK).json(updatedCard)
}
const moveCardToDiffColumn = async (req, res) => {
  const { id } = req.params
  await cardService.moveCardToDiffColumn(id, req.body)
  res
    .status(StatusCodes.OK)
    .json({ message: `Card with id ${id} moved successfully` })
}

export const cardController = {
  createCard,
  updateCard,
  addCommentToCard,
  uploadCardCover,
  moveCardToDiffColumn
}
