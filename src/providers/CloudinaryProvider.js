import { v2 as cloudinary } from 'cloudinary'
import streamifier from 'streamifier'
import { env } from '~/config/environment'

const cloudinaryConfig = {
  cloud_name: env.CLOUDINARY_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET
}

cloudinary.config(cloudinaryConfig)

/**
 * Upload file từ buffer
 */
export const streamUpload = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'uploads',
        resource_type: options.resource_type || 'auto',
        public_id: options.public_id,
        ...options
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )
    streamifier.createReadStream(fileBuffer).pipe(uploadStream)
  })
}

/**
 * Delete file
 */
export const deleteFile = async (publicId, resourceType = 'image') => {
  if (!publicId) return null

  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    invalidate: true
  })
  return result
}

/**
 * Get URL with transformation
 */
export const getTransformedUrl = (publicId, transformations = {}) => {
  if (!publicId) return null

  return cloudinary.url(publicId, {
    secure: true,
    ...transformations
  })
}

/**
 * Get URLs with diff transformations
 */
export const getMultipleTransformedUrls = (
  publicId,
  transformationsMap = {}
) => {
  if (!publicId) return null

  const urls = {}
  for (const [key, transformations] of Object.entries(transformationsMap)) {
    urls[key] = getTransformedUrl(publicId, transformations)
  }
  return urls
}

export { cloudinary }
