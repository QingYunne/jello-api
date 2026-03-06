import { getUploadStrategy } from '~/config/uploadConfig'
import {
  deleteFile,
  getMultipleTransformedUrls,
  streamUpload
} from '~/providers/CloudinaryProvider'

/**
 * Upload single file
 */
const uploadFile = async (fileBuffer, strategyType, context = {}) => {
  try {
    const strategy = getUploadStrategy(strategyType)

    // Debug logging
    console.log('[uploadService] File upload started:', {
      strategyType,
      bufferSize: fileBuffer.length,
      isBuffer: Buffer.isBuffer(fileBuffer),
      context
    })

    if (!Buffer.isBuffer(fileBuffer)) {
      throw new Error(`Invalid file buffer. Expected Buffer, got ${typeof fileBuffer}`)
    }

    if (fileBuffer.length === 0) {
      throw new Error('Empty file buffer')
    }

    const publicId = strategy.generatePublicId?.(context.userId) || undefined

    const result = await streamUpload(fileBuffer, {
      folder: strategy.folder,
      resource_type: strategy.resourceType,
      public_id: publicId
    })

    console.log('[uploadService] Upload successful:', {
      publicId: result.public_id,
      size: result.bytes
    })

    return {
      publicId: result.public_id,
      resourceType: result.resource_type,
      format: result.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
      createdAt: result.created_at
    }
  } catch (error) {
    console.error('[uploadService] Upload error:', error)
    throw new Error(`Upload failed: ${error.message}`)
  }
}

/**
 * Upload multiple files
 */
const uploadMultiple = async (fileBuffers, strategyType, context = {}) => {
  try {
    const uploadPromises = fileBuffers.map((buffer) =>
      uploadFile(buffer, strategyType, context)
    )
    return await Promise.all(uploadPromises)
  } catch (error) {
    throw new Error(`Multiple upload failed: ${error.message}`)
  }
}

/**
 * Delete file with old publicId
 */
const deleteOldFile = async (publicId, resourceType = 'image') => {
  try {
    if (!publicId) return null
    return await deleteFile(publicId, resourceType)
  } catch (error) {
    console.error('Delete old file failed:', error.message)
    return null
  }
}

/**
 * Get transformed URLs theo strategy
 */
const getTransformedUrls = (publicId, strategyType) => {
  try {
    const strategy = getUploadStrategy(strategyType)

    if (!strategy.transformPresets) {
      return { original: publicId }
    }

    return getMultipleTransformedUrls(publicId, strategy.transformPresets)
  } catch (error) {
    throw new Error(`Get transformed URLs failed: ${error.message}`)
  }
}

export const uploadService = {
  uploadFile,
  uploadMultiple,
  deleteOldFile,
  getTransformedUrls
}
