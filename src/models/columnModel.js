import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { commonFields } from '~/helpers'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const COLLECTION_NAME = 'columns'
const INVALID_UPDATE_FIELDS = ['_id', 'createdAt', 'boardId']

const COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(100).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  cardOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),

  ...commonFields
})

const validate = async (data) => {
  return await COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const create = async (column) => {
  const validColumn = await validate(column)
  const columnToAdd = {
    ...validColumn,
    boardId: new ObjectId(validColumn.boardId)
  }
  const res = await GET_DB().collection(COLLECTION_NAME).insertOne(columnToAdd)
  return {
    ...columnToAdd,
    _id: res.insertedId.toString()
  }
}

const addCardOrderIds = async (card) => {
  const res = await GET_DB()
    .collection(COLLECTION_NAME)
    .findOneAndUpdate(
      { _id: new ObjectId(card.columnId) },
      {
        $push: { cardOrderIds: new ObjectId(card._id) },
        $set: { updatedAt: Date.now() }
      },
      { returnDocument: 'after' }
    )
  return res || null
}

const existById = async (id) => {
  return await GET_DB()
    .collection(COLLECTION_NAME)
    .findOne({ _id: new ObjectId(id) })
}

const update = async (
  columnId,
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
  if (Object.keys(updateOperation).length === 0) return null
  updateOperation.$set = {
    ...(updateOperation.$set || {}),
    updatedAt: Date.now()
  }
  const res = await GET_DB()
    .collection(COLLECTION_NAME)
    .findOneAndUpdate({ _id: new ObjectId(columnId) }, updateOperation, {
      returnDocument: 'after'
    })

  return res || null
}

export default {
  COLLECTION_NAME,
  COLLECTION_SCHEMA,
  create,
  existById,
  addCardOrderIds,
  update
}
