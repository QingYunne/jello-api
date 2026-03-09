import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE
} from '~/utils/validators'

const createBoardInvitation = async (req, res, next) => {
  const correctCondition = Joi.object({
    inviteeEmail: Joi.string()
      .pattern(EMAIL_RULE)
      .message(EMAIL_RULE_MESSAGE)
      .required(),
    boardId: Joi.string()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
      .required()
  })
  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false
    })
    next()
  } catch (err) {
    const customError = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      err.message
    )
    next(customError)
  }
}

export const invitationValidation = {
  createBoardInvitation
}
