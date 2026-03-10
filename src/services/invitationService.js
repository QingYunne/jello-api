import { StatusCodes } from 'http-status-codes'
import boardModel from '~/models/boardModel'
import invitationModel from '~/models/invitationModel'
import ApiError from '~/utils/ApiError'
import {
  BOARD_INVITATION_STATUS,
  INVITATION_TYPES,
  USER_FIELDS
} from '~/utils/constants'
import { getInfoData } from '~/utils/formatters'
import { userService } from './userService'
import { updateNestedObjectParser } from '~/utils/algorithms'
import { boardService } from './boardService'

const createBoardInvitation = async ({ inviterId, inviteeEmail, boardId }) => {
  const inviter = await userService.getActiveUserById(inviterId)
  const invitee = await userService.getActiveUserByEmail(inviteeEmail)
  const board = await boardModel.existById(boardId)
  console.log(JSON.stringify([inviter, invitee, board]))

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

const getInvitations = async (userId) => {
  const invitations = await invitationModel.findByUser(userId)
  const res =
    invitations?.map((i) => {
      return {
        ...i,
        board: i.board[0] || {},
        inviter: i.inviter[0] || {},
        invitee: i.invitee[0] || {}
      }
    }) || null
  return res
}

const updateBoardInvitation = async (userId, { invitationId, status }) => {
  const foundInvitation = await invitationModel.findOneById(invitationId)
  if (!foundInvitation)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Invitation not found!')

  const boardId = foundInvitation.boardInvitation.boardId
  const foundBoard = await boardModel.existById(boardId)
  if (!foundBoard) throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
  const boardOwnersAndMemberIds = JSON.stringify([
    ...foundBoard.ownerIds,
    ...foundBoard.memberIds
  ])
  if (
    status === BOARD_INVITATION_STATUS.ACCEPTED &&
    boardOwnersAndMemberIds.includes(userId)
  ) {
    throw new ApiError(
      StatusCodes.NOT_ACCEPTABLE,
      'You are already a member of this board.'
    )
  }
  const inputData = {
    boardInvitation: {
      status
    }
  }

  const updatedInvitation = await invitationModel.update(
    invitationId,
    updateNestedObjectParser(inputData)
  )
  if (
    updatedInvitation.boardInvitation.status ===
    BOARD_INVITATION_STATUS.ACCEPTED
  )
    boardService.pushMemberIds(boardId, userId)
  return updatedInvitation
}

export const invitationService = {
  createBoardInvitation,
  getInvitations,
  updateBoardInvitation
}
