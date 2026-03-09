import { StatusCodes } from 'http-status-codes'
import boardModel from '~/models/boardModel'
import invitationModel from '~/models/invitationModel'
import { BOARD_INVITATION_STATUS, INVITATION_TYPES } from '~/utils/constants'
import userModel from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { getInfoData } from '~/utils/formatters'
import { USER_FIELDS } from '~/utils/constants'

const createBoardInvitation = async ({ inviterId, inviteeEmail, boardId }) => {
  const inviter = await userModel.existById(inviterId)
  const invitee = await userModel.findOneByEmail(inviteeEmail)
  const board = await boardModel.existById(boardId)
  if (!inviter || !invitee || !board)
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Inviter, invitee or board not found!'
    )

  const inputData = {
    inviterId: inviter._id,
    inviteeId: invitee._id,
    type: INVITATION_TYPES.BOARD_INVITATION,
    boardInvitation: {
      boardId: board._id,
      status: BOARD_INVITATION_STATUS.PENDING
    }
  }

  const createdInvitation = await invitationModel.create(inputData)
  return {
    ...createdInvitation,
    board,
    inviter: getInfoData({ fields: USER_FIELDS.PRIVATE, object: inviter }),
    invitee: getInfoData({ fields: USER_FIELDS.PUBLIC, object: invitee })
  }
}

export const invitationService = { createBoardInvitation }
