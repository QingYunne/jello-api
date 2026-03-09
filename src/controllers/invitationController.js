import { StatusCodes } from 'http-status-codes'
import { invitationService } from '~/services/invitationService'

const createBoardInvitation = async (req, res) => {
  const inviterId = req.jwtDecoded._id
  const { inviteeEmail, boardId } = req.body
  const createdInvitation = await invitationService.createBoardInvitation({
    inviterId,
    inviteeEmail,
    boardId
  })
  res.status(StatusCodes.CREATED).json(createdInvitation)
}

export const invitationController = { createBoardInvitation }
