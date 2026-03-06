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

export const randomImageName = () => {
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 8)
  return `${timestamp}_${randomStr}.jpg`
}
