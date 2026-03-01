import { StatusCodes } from 'http-status-codes'
import userModel from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { getInfoData } from '~/utils/formatters'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { getEmailProvider, PROVIDER_TYPE, sendEmail } from '~/providers'

const FIELD_USER_RETURN = [
  '_id',
  'email',
  'username',
  'displayName',
  'avatar',
  'role',
  'isActive',
  'createdAt'
]

const register = async ({ email, password }) => {
  const foundUser = await userModel.findOneByEmail(email)
  // console.log('foudUser', foundUser)

  if (foundUser)
    throw new ApiError(StatusCodes.CONFLICT, 'Email already exists!')

  const username = email.split('@')[0]
  const userData = {
    email,
    password: bcryptjs.hashSync(password, 8),
    username,
    displayName: username,
    verifyToken: uuidv4()
  }
  const createdUser = await userModel.create(userData)

  const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${createdUser?.email}&token=${createdUser?.verifyToken}`

  const customSubject = 'Please verify your email before using our services'
  const htmlContent = `
    <h1>Here is your verification link:</h1>
    <h2>${verificationLink}</h2>
    <h3>Sincerely<br /> - Qing Yun</h3>
  `

  await sendEmail(PROVIDER_TYPE.MAILERSEND, {
    to: createdUser.email,
    toName: createdUser.displayName,
    subject: customSubject,
    html: htmlContent
  })

  return getInfoData({ fields: FIELD_USER_RETURN, object: createdUser })
}

export const userService = {
  register
}
