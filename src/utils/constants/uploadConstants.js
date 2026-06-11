export const ALLOWED_MIME_TYPES = {
  IMAGE: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  VIDEO: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'],
  DOCUMENT: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ],
  get ALL() {
    return [...this.IMAGE, ...this.VIDEO, ...this.DOCUMENT]
  }
}

export const FILE_SIZE_LIMITS = {
  AVATAR: 10 * 1024 * 1024,
  CARD_COVER: 10 * 1024 * 1024
  // PRODUCT: 10 * 1024 * 1024,
  // VIDEO: 100 * 1024 * 1024
}
