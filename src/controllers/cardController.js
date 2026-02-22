import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardService'

const createCard = async (req, res, next) => {
  const createdCard = await cardService.createCard(req.body)
  res.status(StatusCodes.CREATED).json(createdCard)
}

const moveCardToDiffColumn = async (req, res, next) => {
  const { id} = req.params
  await cardService.moveCardToDiffColumn(id, req.body)
  res.status(StatusCodes.OK).json({ message: `Card with id ${id} moved successfully` })
}

export const cardController = {
  createCard,
  moveCardToDiffColumn
}
