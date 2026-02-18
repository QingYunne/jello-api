import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { BOARD_TYPE } from '~/utils/constants'
import columnModel from '~/models/columnModel'
import cardModel from '~/models/cardModel'

const COLLECTION_NAME = 'boards'
const COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(100).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(255).trim().strict(),
  type: Joi.string().valid(BOARD_TYPE.PUBLIC, BOARD_TYPE.PRIVATE).required(),
  columnOrderIds: Joi.array().items(Joi.string()).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validate = async (data) => {
  return await COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const create = async (board) => {
  const validBoard = await validate(board)
  const res = await GET_DB().collection(COLLECTION_NAME).insertOne(validBoard)
  return {
    ...validBoard,
    _id: res.insertedId.toString()
  }
}

const find = async (boardId) => {
  // const res = await GET_DB()
  //   .collection(COLLECTION_NAME)
  //   .findOne({ _id: new ObjectId(boardId) })
  const res = await GET_DB()
    .collection(COLLECTION_NAME)
    .aggregate([
      {
        $match: {
          _id: new ObjectId(boardId),
          _destroy: false
        }
      },
      {
        $lookup: {
          from: columnModel.COLLECTION_NAME,
          localField: '_id',
          foreignField: 'boardId',
          as: 'columns'
        }
      },
      {
        $lookup: {
          from: cardModel.COLLECTION_NAME,
          localField: '_id',
          foreignField: 'boardId',
          as: 'cards'
        }
      }
    ])
    .toArray()

  return res[0] || {}
}

export default {
  COLLECTION_NAME,
  COLLECTION_SCHEMA,
  create,
  find
}
