import Joi from 'joi'
import { ObjectId } from 'mongodb'

export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/
export const OBJECT_ID_RULE_MESSAGE =
  'Your string fails to match the Object Id pattern!'

export const EMAIL_RULE = /^\S+@\S+\.\S+$/
export const EMAIL_RULE_MESSAGE = 'Email is invalid. (example@mail.com)'
export const PASSWORD_RULE = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d\W]{8,256}$/
export const PASSWORD_RULE_MESSAGE =
  'Password must include at least 1 letter, a number, and at least 8 characters.'

export const LIMIT_COMMON_FILE_SIZE = 10485760 // byte = 10 MB
export const ALLOW_COMMON_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png']

export const JoiExtended = Joi.extend((joi) => ({
  type: 'objectId',
  base: joi
    .alternatives()
    .try(joi.string().pattern(OBJECT_ID_RULE), joi.object().instance(ObjectId)),
  messages: {
    'objectId.invalid': '{{#label}} must be a valid ObjectId'
  },
  coerce(value, helpers) {
    if (typeof value === 'string') {
      if (ObjectId.isValid(value)) {
        return { value: new ObjectId(value) }
      }
      return { errors: [helpers.error('objectId.invalid')] }
    }

    if (value instanceof ObjectId) {
      return { value }
    }

    return { errors: [helpers.error('objectId.invalid')] }
  }
}))
