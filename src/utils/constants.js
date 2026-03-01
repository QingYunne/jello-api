import { env } from '~/config/environment'

export const WHITELIST_DOMAINS = [
  'http://localhost:5173',
  'http://localhost:5174'
]

export const BOARD_TYPE = {
  PUBLIC: 'public',
  PRIVATE: 'public'
}

export const WEBSITE_DOMAIN =
  env.BUILD_MODE === 'production'
    ? env.WEBSITE_DOMAIN_PRODUCTION
    : env.WEBSITE_DOMAIN_DEVELOPMENT
