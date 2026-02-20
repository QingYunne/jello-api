import { StatusCodes } from 'http-status-codes'
import { columnService } from '~/services/columnService'

const createColumn = async (req, res, next) => {
  const createdColumn = await columnService.createColumn(req.body)
  res.status(StatusCodes.CREATED).json(createdColumn)
}

export const columnController = {
  createColumn
}
