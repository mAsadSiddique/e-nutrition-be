"use strict";
exports.__esModule = true;
exports.envValidationSchema = void 0;
var zod_1 = require("zod");
exports.envValidationSchema = zod_1.z.object({
    // General
    NODE_ENV: zod_1.z["enum"](['develop', 'production', 'local']),
    PORT: zod_1.z.coerce.number()["default"](3000),
    // Database
    DB_HOST: zod_1.z.string(),
    DB_PORT: zod_1.z.coerce.number(),
    DB_USERNAME: zod_1.z.string(),
    DB_PASSWORD: zod_1.z.string(),
    DB_NAME: zod_1.z.string(),
    DB_TYPE: zod_1.z["enum"](['postgres'])["default"]('postgres'),
    MAX_POOL_SIZE: zod_1.z.coerce.number().optional(),
    MIN_POOL_SIZE: zod_1.z.coerce.number().optional(),
    DB_SSL: zod_1.z.string().optional()["default"]('false'),
    // JWT
    JWT_SECRET: zod_1.z.string(),
    JWT_EXPIRES_IN: zod_1.z.string(),
    SALT_ROUNDS: zod_1.z.coerce.number()["default"](10),
    // S3 Bucket
    BUCKET_NAME: zod_1.z.string(),
    BUCKET_REGION: zod_1.z.string(),
    BUCKET_ACCESS_KEY_ID: zod_1.z.string(),
    BUCKET_SECRET_ACCESS_KEY: zod_1.z.string(),
    BUCKET_ENDPOINT: zod_1.z.string(),
    INTERNAL_BUCKET_NAME: zod_1.z.string(),
    // user config
    DEFAULT_USER_NAME: zod_1.z.string(),
    DEFAULT_PASSWORD: zod_1.z.string(),
    // image file size
    IMAGE_FILE_SIZE: zod_1.z.string(),
    VIDEO_FILE_SIZE: zod_1.z.string(),
    AUDIO_FILE_SIZE: zod_1.z.string(),
    IMAGE_FIELD_SIZE: zod_1.z.string(),
    // Sendgrid credentials
    SEND_GRID_API_KEY: zod_1.z.string(),
    // Suppord mails
    SUPPORT_SENDER_EMAIL: zod_1.z.string(),
    SECURITY_EMAIL: zod_1.z.string(),
    // Logout routes (optional)
    ADMIN_LOGOUT_ROUTE: zod_1.z.string().optional(),
    USER_LOGOUT_ROUTE: zod_1.z.string().optional(),
    // Google login credentials
    GOOGLE_CLIENT_ID: zod_1.z.string(),
    GOOGLE_SECRET: zod_1.z.string(),
    GOOGLE_REDIRECT_URL: zod_1.z.string(),
    GOOGLE_CANCEL_REDIRECT_URL: zod_1.z.string(),
    // fe redirect pages
    USER_EMAIL_VERIFICATION_PAGE: zod_1.z.string().url(),
    USER_RESET_PASSWORD_PAGE: zod_1.z.string().url(),
    USER_SET_PASSWORD_PAGE: zod_1.z.string().url(),
    SOCIAL_MEDIA_REDIRECT_URL: zod_1.z.string()
});
