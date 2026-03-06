import Joi, { valid } from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { commonFields } from '~/helpers'
import cardModel from '~/models/cardModel'
import columnModel from '~/models/columnModel'
import { pagingSkipValue } from '~/utils/algorithms'
import { BOARD_TYPE } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']
const COLLECTION_NAME = 'boards'

const COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(100).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(255).trim().strict(),
  type: Joi.string().valid(BOARD_TYPE.PUBLIC, BOARD_TYPE.PRIVATE).required(),
  columnOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  ownerIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  memberIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  ...commonFields
})

const validate = async (data) => {
  return await COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const create = async (userId, board) => {
  const validBoard = await validate(board)
  const boardWithOwner = { ...validBoard, ownerIds: [new ObjectId(userId)] }
  const res = await GET_DB()
    .collection(COLLECTION_NAME)
    .insertOne(boardWithOwner)
  return {
    ...validBoard,
    _id: res.insertedId.toString()
  }
}

const find = async (userId, boardId) => {
  const filter = [
    { _id: new ObjectId(boardId) },
    { _destroy: false },
    {
      $or: [
        { ownerIds: { $all: [new ObjectId(userId)] } },
        { memberIds: { $all: [new ObjectId(userId)] } }
      ]
    }
  ]
  // const res = await GET_DB()
  //   .collection(COLLECTION_NAME)
  //   .findOne({ _id: new ObjectId(boardId) })
  const res = await GET_DB()
    .collection(COLLECTION_NAME)
    .aggregate([
      {
        $match: { $and: filter }
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

  return res[0] || null
}

const existById = async (id) => {
  return await GET_DB()
    .collection(COLLECTION_NAME)
    .findOne({ _id: new ObjectId(id) })
}

const update = async (
  boardId,
  { pushData = {}, setData = {}, pullData = {} }
) => {
  const sanitizedSetData = Object.fromEntries(
    Object.entries(setData).filter(
      ([key]) => !INVALID_UPDATE_FIELDS.includes(key)
    )
  )
  const updateOperation = {}
  if (Object.keys(setData).length > 0) {
    updateOperation.$set = { ...sanitizedSetData }
  }

  if (Object.keys(pushData).length > 0) {
    updateOperation.$push = { ...pushData }
  }
  if (Object.keys(pullData).length > 0) {
    updateOperation.$pull = { ...pullData }
  }

  if (Object.keys(updateOperation).length === 0) return null
  updateOperation.$set = {
    ...(updateOperation.$set || {}),
    updatedAt: Date.now()
  }
  const res = await GET_DB()
    .collection(COLLECTION_NAME)
    .findOneAndUpdate({ _id: new ObjectId(boardId) }, updateOperation, {
      returnDocument: 'after'
    })

  return res || null
}

const findAll = async (userId, page, limit) => {
  const filter = [
    { _destroy: false },
    {
      $or: [
        { ownerIds: { $all: [new ObjectId(userId)] } },
        { memberIds: { $all: [new ObjectId(userId)] } }
      ]
    }
  ]

  const query = await GET_DB()
    .collection(COLLECTION_NAME)
    .aggregate(
      [
        { $match: { $and: filter } },
        { $sort: { title: 1 } },
        {
          $facet: {
            //thread1: query board
            queryBoards: [
              { $skip: pagingSkipValue(page, limit) },
              { $limit: limit }
            ],
            //thread2: query total of boards
            queryCount: [{ $count: 'total' }]
          }
        }
      ],
      { collation: { locale: 'en' } }
    )
    .toArray()
  const res = query[0]
  return {
    boards: res.queryBoards,
    total: res.queryCount[0]?.total || 0
  }
}

export default {
  COLLECTION_NAME,
  COLLECTION_SCHEMA,
  create,
  find,
  findAll,
  existById,
  update
}
