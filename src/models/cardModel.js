import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { commonFields } from '~/helpers'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const COLLECTION_NAME = 'cards'
const COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),

  title: Joi.string().required().min(3).max(100).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().optional(),
  ...commonFields
})

const validate = async (data) => {
  return await COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const create = async (card) => {
  const validCard = await validate(card)
  const cardToAdd = {
    ...validCard,
    boardId: new ObjectId(validCard.boardId),
    columnId: new ObjectId(validCard.columnId)
  }
  const res = await GET_DB().collection(COLLECTION_NAME).insertOne(cardToAdd)
  return {
    ...cardToAdd,
    _id: res.insertedId.toString()
  }
}

export default { COLLECTION_NAME, COLLECTION_SCHEMA, create }
