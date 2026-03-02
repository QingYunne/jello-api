import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import * as brevo from './brevo'
import * as mailersend from './mailersend'

export const PROVIDER_TYPE = {
  BREVO: 'brevo',
  MAILERSEND: 'mailersend'
}

const providers = { brevo, mailersend }

export const getEmailProvider = (type = PROVIDER_TYPE.MAILERSEND) => {
  if (!providers[type])
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `Provider ${type} not found`
    )
  return providers[type]
}

export const sendEmail = async (type, params) => {
  const provider = getEmailProvider(type)
  return await provider.send(params)
}
