import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'

const createBoard = async (req, res) => {
  const userId = req.jwtDecoded._id
  const createdBoard = await boardService.createBoard(userId, req.body)
  res.status(StatusCodes.CREATED).json(createdBoard)
}

const getBoard = async (req, res) => {
  const userId = req.jwtDecoded._id
  const boardId = req.params.id
  const board = await boardService.getBoard(userId, boardId)
  res.status(StatusCodes.OK).json(board)
}

const getAllBoards = async (req, res) => {
  const userId = req.jwtDecoded._id
  const { page, limit, q } = req.query
  const boards = await boardService.getAllBoards(userId, page, limit, q)
  res.status(StatusCodes.OK).json(boards)
}

const updateBoard = async (req, res) => {
  const boardId = req.params.id
  const updatedBoard = await boardService.updateBoard(boardId, req.body)
  res.status(StatusCodes.OK).json(updatedBoard)
}

export const boardController = {
  createBoard,
  getBoard,
  getAllBoards,
  updateBoard
}
