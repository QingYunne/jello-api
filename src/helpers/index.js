import Joi from 'joi'
import { ObjectId } from 'mongodb'

export const updateTimestamps = (data) => ({
  ...data,
  updatedAt: Date.now()
})

export const commonFields = {
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
}

export const convertToObjectId = (id) => {
  if (ObjectId.isValid(id)) return new ObjectId(id)
}
