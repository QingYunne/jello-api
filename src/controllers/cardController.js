import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardService'

const createCard = async (req, res, next) => {
  const createdCard = await cardService.createCard(req.body)
  res.status(StatusCodes.CREATED).json(createdCard)
}

export const cardController = {
  createCard
}
