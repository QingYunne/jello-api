import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { commonFields, getSelectedFields } from '~/helpers'
import {
  BOARD_INVITATION_STATUS,
  INVITATION_TYPES,
  USER_FIELDS
} from '~/utils/constants'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, JoiExtended } from '~/utils/validators'
import userModel from './userModel'
import boardModel from './boardModel'

const COLLECTION_NAME = 'invitations'
const INVALID_UPDATE_FIELDS = [
  '_id',
  'inviterId',
  'inviteeId',
  'boardInvitation.boardId',
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

const findOneById = async (userId) => {
  return await GET_DB()
    .collection(COLLECTION_NAME)
    .findOne({ _id: new ObjectId(userId), _destroy: false })
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

const findByUser = async (userId) => {
  const filter = {
    inviteeId: new ObjectId(userId),
    _destroy: false
  }
  // const res = await GET_DB()
  //   .collection(COLLECTION_NAME)
  //   .findOne({ _id: new ObjectId(boardId) })
  const res = await GET_DB()
    .collection(COLLECTION_NAME)
    .aggregate([
      {
        $match: filter
      },
      {
        $lookup: {
          from: userModel.COLLECTION_NAME,
          localField: 'inviterId',
          foreignField: '_id',
          as: 'inviter',
          pipeline: [{ $project: getSelectedFields(USER_FIELDS.PUBLIC) }]
        }
      },
      {
        $lookup: {
          from: userModel.COLLECTION_NAME,
          localField: 'inviteeId',
          foreignField: '_id',
          as: 'invitee',
          pipeline: [{ $project: getSelectedFields(USER_FIELDS.PUBLIC) }]
        }
      },
      {
        $lookup: {
          from: boardModel.COLLECTION_NAME,
          localField: 'boardInvitation.boardId',
          foreignField: '_id',
          as: 'board',
          pipeline: [{ $project: { title: 1 } }]
        }
      }
    ])
    .toArray()

  return res || null
}

const update = async (invitationId, data) => {
  const sanitizedData = Object.fromEntries(
    Object.entries(data).filter(
      ([key, value]) =>
        !INVALID_UPDATE_FIELDS.includes(key) && value !== undefined
    )
  )
  return await GET_DB()
    .collection(COLLECTION_NAME)
    .findOneAndUpdate(
      { _id: new ObjectId(invitationId), _destroy: false },
      { $set: sanitizedData },
      { returnDocument: 'after' }
    )
}
export default {
  COLLECTION_NAME,
  findOneById,
  validate,
  create,
  findByUser,
  update
}
