import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/apiError'

const createNew = async (req, res, next) => {
  try {
    res
      .status(StatusCodes.CREATED)
      .json({ message: 'POST from Validation: API create new board' })
  } catch (err) {
    next(err)
  }
}

export const boardController = {
  createNew
}
