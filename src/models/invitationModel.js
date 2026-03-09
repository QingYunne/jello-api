import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { commonFields } from '~/helpers'
import { BOARD_INVITATION_STATUS, INVITATION_TYPES } from '~/utils/constants'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, JoiExtended } from '~/utils/validators'

const COLLECTION_NAME = 'invitations'
const INVALID_UPDATE_FIELDS = [
  '_id',
  'inviterId',
  'inviteeId',
  'type',
  'createdAt'
]

const COLLECTION_SCHEMA = Joi.object({
  inviterId: JoiExtended.objectId().required(),
  inviteeId: JoiExtended.objectId().required(),
  type: Joi.string()
    .required()
    .valid(...Object.values(INVITATION_TYPES)),

  boardInvitation: Joi.object({
    boardId: JoiExtended.objectId().required(),
    status: Joi.string()
      .required()
      .valid(...Object.values(BOARD_INVITATION_STATUS))
  }).optional(),

  ...commonFields
})

const validate = async (data) => {
  return await COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
    convert: true
  })
}

const create = async (data) => {
  const validData = await validate(data)
  const createdInvitation = await GET_DB()
    .collection(COLLECTION_NAME)
    .insertOne(validData)
  return {
    ...validData,
    _id: createdInvitation.insertedId.toString()
  }
}

export default {
  COLLECTION_NAME,
  validate,
  create
}
