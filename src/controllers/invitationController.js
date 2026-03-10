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

const getInvitations = async (req, res) => {
  const userId = req.jwtDecoded._id
  const invitations = await invitationService.getInvitations(userId)
  res.status(StatusCodes.OK).json(invitations)
}

const updateBoardInvitation = async (req, res) => {
  const userId = req.jwtDecoded._id
  const invitationId = req.params.id
  const { status } = req.body
  const updatedInvitation = await invitationService.updateBoardInvitation(
    userId,
    { invitationId, status }
  )
  res.status(StatusCodes.OK).json(updatedInvitation)
}

export const invitationController = {
  createBoardInvitation,
  getInvitations,
  updateBoardInvitation
}
