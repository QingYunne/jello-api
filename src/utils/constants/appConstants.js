import { env } from '~/config/environment'

// constants/app.constants.js
export const WHITELIST_DOMAINS = process.env.WHITELIST_DOMAINS?.split(',') || [
  'http://localhost:5173',
  'http://localhost:5174'
]

export const WEBSITE_DOMAIN =
  env.BUILD_MODE === 'production'
    ? env.WEBSITE_DOMAIN_PRODUCTION
    : env.WEBSITE_DOMAIN_DEVELOPMENT
