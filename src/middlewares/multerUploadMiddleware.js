import { StatusCodes } from 'http-status-codes'
import multer from 'multer'
import { getUploadStrategy } from '~/config/uploadConfig'
import ApiError from '~/utils/ApiError'

/**
 * Create file filter based on upload config
 */
const createFileFilter = (allowedMimeTypes) => {
  return (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new ApiError(
          StatusCodes.UNPROCESSABLE_ENTITY,
          `Invalid file type. Allowed: ${allowedMimeTypes.join(', ')}`
        ),
        false
      )
    }
    cb(null, true)
  }
}

/**
 * DYNAMIC upload middleware
 * @param {string} strategyType - 'AVATAR' | 'BOARD_COVER' | 'CARD_ATTACHMENT' | ...
 * @returns {Function} Multer middleware
 */
export const uploadMiddleware = (strategyType) => {
  const strategy = getUploadStrategy(strategyType)

  const multerInstance = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: strategy.maxSize,
      files: strategy.maxFiles
    },
    fileFilter: createFileFilter(strategy.allowedMimeTypes)
  })

  const handler =
    strategy.maxFiles === 1
      ? multerInstance.single(strategy.fieldName)
      : multerInstance.array(strategy.fieldName, strategy.maxFiles)

  return (req, res, next) => {
    handler(req, res, (err) => {
      if (!err && strategy.maxFiles === 1 && req.file) {
        req[strategy.fieldName] = req.file
      }
      next(err)
    })
  }
}

/**
 * Error handler for multer
 */
export const handleMulterError = (err, req, res, next) => {
  if (!err) {
    return next()
  }
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(
        new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'File size too large')
      )
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return next(
        new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Too many files')
      )
    }
    return next(new ApiError(StatusCodes.BAD_REQUEST, err.message))
  }
  next(err)
}
