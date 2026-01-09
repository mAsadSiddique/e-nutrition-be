import * as dotenv from 'dotenv'
import { envValidationSchema } from './env.validation'

dotenv.config()
dotenv.config({ path: `envConfig/${process.env.NODE_ENV}.env` })

const parsed = envValidationSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format())
  throw new Error('Environment validation error. Check your .env file.')
}

const env = parsed.data

/**
 * Parse file size string to bytes
 * @param sizeStr - Size string like "5MB", "100MB", "1GB"
 * @returns Size in bytes
 */
function parseFileSize(sizeStr: string): number {
  const units: { [key: string]: number } = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
  }

  const match = sizeStr.trim().match(/^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB)$/i)
  if (!match) {
    throw new Error(`Invalid file size format: ${sizeStr}`)
  }

  const value = parseFloat(match[1])
  const unit = match[2].toUpperCase()

  return Math.floor(value * units[unit])
}

export const ENV = {
  NODE_ENV: env.NODE_ENV,
  PORT: Number(env.PORT),

  DB: {
    HOST: env.DB_HOST,
    PORT: env.DB_PORT,
    USERNAME: env.DB_USERNAME,
    PASSWORD: env.DB_PASSWORD,
    NAME: env.DB_NAME,
    TYPE: env.DB_TYPE,
    MAX_POOL_SIZE: env.MAX_POOL_SIZE,
    MIN_POOL_SIZE: env.MIN_POOL_SIZE,
    SSL: env.DB_SSL === 'true',
  },

  JWT: {
    SECRET: env.JWT_SECRET,
    EXPIRES_IN: env.JWT_EXPIRES_IN,
    SALT_ROUNDS: env.SALT_ROUNDS,
  },

  S3_BUCKET: {
    NAME: env.BUCKET_NAME,
    REGION: env.BUCKET_REGION,
    ACCESS_KEY_ID: env.BUCKET_ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: env.BUCKET_SECRET_ACCESS_KEY,
    ENDPOINT: env.BUCKET_ENDPOINT,
    INTERNAL_BUCKET_NAME: env.INTERNAL_BUCKET_NAME,
  },

  DEFAULT_USER: {
    NAME: env.DEFAULT_USER_NAME,
    PASSWORD: env.DEFAULT_PASSWORD,
  },

  FILE_SIZE: {
    IMAGE_FILE_SIZE: parseFileSize(env.IMAGE_FILE_SIZE),
    VIDEO_FILE_SIZE: parseFileSize(env.VIDEO_FILE_SIZE),
    AUDIO_FILE_SIZE: parseFileSize(env.AUDIO_FILE_SIZE),
    FIELD_SIZE: parseFileSize(env.IMAGE_FIELD_SIZE),
  },

  EMAIL_CONFIG: {
    SEND_GRID_API_KEY: env.SEND_GRID_API_KEY,
    SUPPORT_SENDER_EMAIL: env.SUPPORT_SENDER_EMAIL,
    SECURITY_EMAIL: env.SECURITY_EMAIL,
  },

  GOOGLE_LOGIN: {
    CLIENT_ID: env.GOOGLE_CLIENT_ID,
    SECRET: env.GOOGLE_SECRET,
    REDIRECT_URL: env.GOOGLE_REDIRECT_URL,
    CANCEL_REDIRECT_URL: env.GOOGLE_CANCEL_REDIRECT_URL,
  },

  FE_REDIRECT_PAGES: {
    USER_EMAIL_VERIFICATION_PAGE: env.USER_EMAIL_VERIFICATION_PAGE,
    USER_RESET_PASSWORD_PAGE: env.USER_RESET_PASSWORD_PAGE,
    USER_SET_PASSWORD_PAGE: env.USER_SET_PASSWORD_PAGE,
    SOCIAL_MEDIA_REDIRECT_URL: env.SOCIAL_MEDIA_REDIRECT_URL,
  },

  // Add more groups as needed
}
