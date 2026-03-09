import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { commonFields, updateTimestamps } from '~/helpers'
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE
} from '~/utils/validators'
import { USER_ROLES } from '~/utils/constants'

const COLLECTION_NAME = 'users'
const INVALID_UPDATE_FIELDS = ['_id', 'email', 'username', 'createdAt']

const COLLECTION_SCHEMA = Joi.object({
  email: Joi.string()
    .required()
    .pattern(EMAIL_RULE)
    .message(EMAIL_RULE_MESSAGE),
  password: Joi.string()
    .required()
    .pattern(PASSWORD_RULE)
    .message(PASSWORD_RULE_MESSAGE),

  username: Joi.string().required().trim().strict(),
  displayName: Joi.string().required().trim().strict(),
  avatar: Joi.string().default(null),
  role: Joi.string()
    .valid(...Object.values(USER_ROLES))
    .default(USER_ROLES.CLIENT),

  isActive: Joi.boolean().default(false),
  verifyToken: Joi.string(),

  ...commonFields
})

const validate = async (data) => {
  return await COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const create = async (data) => {
  const validData = await validate(data)
  const res = await GET_DB().collection(COLLECTION_NAME).insertOne(validData)
  return {
    ...validData,
    _id: res.insertedId.toString()
  }
}

const existById = async (id) => {
  return await GET_DB()
    .collection(COLLECTION_NAME)
    .findOne({ _id: new ObjectId(id), _destroy: false, isActive: true })
}

const findOneByEmail = async (email) => {
  return await GET_DB().collection(COLLECTION_NAME).findOne({ email })
}

const update = async (id, data) => {
  const sanitizedData = Object.fromEntries(
    Object.entries(data).filter(
      ([key, value]) =>
        !INVALID_UPDATE_FIELDS.includes(key) && value !== undefined
    )
  )

  const res = await GET_DB()
    .collection(COLLECTION_NAME)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateTimestamps(sanitizedData) },
      { returnDocument: 'after' }
    )

  return res || null
}

export default {
  COLLECTION_NAME,
  validate,
  existById,
  create,
  update,
  findOneByEmail
}
