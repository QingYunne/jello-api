import { StatusCodes } from 'http-status-codes'
import { columnService } from '~/services/columnService'

const createColumn = async (req, res, next) => {
  const createdColumn = await columnService.createColumn(req.body)
  res.status(StatusCodes.CREATED).json(createdColumn)
}

const updateColumn = async (req, res, next) => {
  const columnId = req.params.id
  const updatedColumn = await columnService.updateColumn(columnId, req.body)
  res.status(StatusCodes.OK).json(updatedColumn)
}

export const columnController = {
  createColumn,
  updateColumn
}
