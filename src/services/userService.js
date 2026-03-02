import bcryptjs from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import { v4 as uuidv4 } from 'uuid'
import userModel from '~/models/userModel'
import { PROVIDER_TYPE, sendEmail } from '~/providers'
import ApiError from '~/utils/ApiError'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { getInfoData } from '~/utils/formatters'
import { createTokenPair } from '~/helpers/auth'
import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'

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

const verify = async ({ email, token }) => {
  const foundUser = await userModel.findOneByEmail(email)
  // console.log('foudUser', foundUser)

  if (!foundUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Email not found!')
  if (foundUser.isActive)
    throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your email already active!')
  if (token !== foundUser.verifyToken)
    throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Token is invalid!')

  const inputData = {
    isActive: true,
    verifyToken: null
  }

  const updatedData = await userModel.update(foundUser._id, inputData)

  return getInfoData({ fields: FIELD_USER_RETURN, object: updatedData })
}

const login = async ({ email, password }) => {
  const foundUser = await userModel.findOneByEmail(email)
  // console.log('foudUser', foundUser)

  if (!foundUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Email not found!')
  if (!foundUser.isActive)
    throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your email is not active!')

  if (!bcryptjs.compareSync(password, foundUser.password))
    throw new ApiError(
      StatusCodes.NOT_ACCEPTABLE,
      'Your email or password is incorrect!'
    )

  const userInfo = {
    _id: foundUser._id,
    email: foundUser.email
  }

  const tokens = await createTokenPair(userInfo)

  return {
    ...tokens,
    ...getInfoData({ fields: FIELD_USER_RETURN, object: foundUser })
  }
}

const refreshToken = async (refreshToken) => {
  try {
    const decoded = await JwtProvider.verifyToken(
      refreshToken,
      env.REFRESH_TOKEN_SECRET_KEY
    )

    const { _id, email } = decoded

    return await createTokenPair({ _id, email })
  } catch (error) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Please login!')
  }
}

export const userService = {
  register,
  verify,
  login,
  refreshToken
}
