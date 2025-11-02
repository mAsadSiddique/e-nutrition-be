import {z} from 'zod'

export const envValidationSchema = z.object({
	// General
	NODE_ENV: z.enum(['develop', 'production', 'local']),
	PORT: z.coerce.number().default(3000),

	// Database
	DB_HOST: z.string(),
	DB_PORT: z.coerce.number(),
	DB_USERNAME: z.string(),
	DB_PASSWORD: z.string(),
	DB_NAME: z.string(),
	DB_TYPE: z.enum(['postgres']).default('postgres'),
	MAX_POOL_SIZE: z.coerce.number().optional(),
	MIN_POOL_SIZE: z.coerce.number().optional(),

	// JWT
	JWT_SECRET: z.string(),
	JWT_EXPIRES_IN: z.string(),
	SALT_ROUNDS: z.coerce.number().default(10),

	// S3 Bucket
	BUCKET_NAME: z.string(),
	BUCKET_REGION: z.string(),
	BUCKET_ACCESS_KEY_ID: z.string(),
	BUCKET_SECRET_ACCESS_KEY: z.string(),
	BUCKET_ENDPOINT: z.string(),
	INTERNAL_BUCKET_NAME: z.string(),

	// user config
	DEFAULT_USER_NAME: z.string(),
	DEFAULT_PASSWORD: z.string(),

	// image file size
	IMAGE_FILE_SIZE: z.string(),
	VIDEO_FILE_SIZE: z.string(),
	AUDIO_FILE_SIZE: z.string(),
	IMAGE_FIELD_SIZE: z.string(),

	// Sendgrid credentials
	SEND_GRID_API_KEY: z.string(),

	// Suppord mails
	SUPPORT_SENDER_EMAIL: z.string(),
	
	// Logout routes (optional)
	ADMIN_LOGOUT_ROUTE: z.string().optional(),
	USER_LOGOUT_ROUTE: z.string().optional(),
	
})
