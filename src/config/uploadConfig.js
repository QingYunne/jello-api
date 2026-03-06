import { randomImageName } from '~/helpers'
import {
  CLOUDINARY_FOLDERS,
  RESOURCE_TYPES,
  FILE_SIZE_LIMITS,
  ALLOWED_MIME_TYPES,
  IMAGE_TRANSFORM_PRESETS
} from '~/utils/constants'

/**
 * Upload strategies confg
 */
export const UPLOAD_STRATEGIES = {
  AVATAR: {
    fieldName: 'avatar',
    folder: CLOUDINARY_FOLDERS.USER_AVATARS,
    resourceType: RESOURCE_TYPES.IMAGE,
    maxSize: FILE_SIZE_LIMITS.AVATAR,
    allowedMimeTypes: ALLOWED_MIME_TYPES.IMAGE,
    maxFiles: 1,
    generatePublicId: (userId) => `user_${userId}_avatar_${Date.now()}`,
    // Transform presets when return
    transformPresets: {
      small: IMAGE_TRANSFORM_PRESETS.AVATAR_SMALL,
      medium: IMAGE_TRANSFORM_PRESETS.AVATAR_MEDIUM,
      large: IMAGE_TRANSFORM_PRESETS.AVATAR_LARGE
    },
    defaultTransform: IMAGE_TRANSFORM_PRESETS.AVATAR_MEDIUM
  }
}

export const UPLOAD_TYPE_KEY = {
  AVATAR: 'AVATAR'
}

/**
 * Get upload strategy by type
 */
export const getUploadStrategy = (strategyType) => {
  const strategy = UPLOAD_STRATEGIES[strategyType]
  if (!strategy) {
    throw new Error(`Upload strategy "${strategyType}" not found`)
  }
  return strategy
}
