export const CLOUDINARY_FOLDERS = {
  USER_AVATARS: 'clone-jello/user-avatars',
  CARD_COVER: 'clone-jello/card-covers'
}

export const CROP_MODES = {
  FILL: 'fill',
  LIMIT: 'limit',
  FIT: 'fit',
  SCALE: 'scale',
  CROP: 'crop',
  PAD: 'pad'
}

export const QUALITY_PRESETS = {
  HIGH: 'auto:best',
  MEDIUM: 'auto:good',
  LOW: 'auto:eco',
  AUTO: 'auto'
}

export const RESOURCE_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
  RAW: 'raw',
  AUTO: 'auto'
}

export const IMAGE_TRANSFORM_PRESETS = {
  AVATAR_SMALL: {
    width: 50,
    height: 50,
    crop: CROP_MODES.FILL,
    quality: QUALITY_PRESETS.MEDIUM
  },
  AVATAR_MEDIUM: {
    width: 100,
    height: 100,
    crop: CROP_MODES.FILL,
    quality: QUALITY_PRESETS.MEDIUM
  },
  AVATAR_LARGE: {
    width: 300,
    height: 300,
    crop: CROP_MODES.FILL,
    quality: QUALITY_PRESETS.HIGH
  },
  CARD_COVER_SMALL: {
    width: 280,
    height: 140,
    crop: CROP_MODES.FILL,
    quality: QUALITY_PRESETS.MEDIUM
  },
  CARD_COVER_MEDIUM: {
    width: 280,
    height: 140,
    crop: CROP_MODES.FILL,
    quality: QUALITY_PRESETS.MEDIUM
  },
  CARD_COVER_LARGE: {
    width: 860,
    height: 320,
    crop: CROP_MODES.FILL,
    quality: QUALITY_PRESETS.HIGH
  }
  // COVER_THUMBNAIL: { width: 400, height: 225, crop: 'fill', quality: 'auto:good' },
}
