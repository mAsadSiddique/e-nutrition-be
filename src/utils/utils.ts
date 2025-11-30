import { BadRequestException } from '@nestjs/common'
import { Credentials, S3, SES, config } from 'aws-sdk'
import { callbackType } from './types/generic_types.type'
import { ENV } from 'src/config/constant'

/**
 * @description returns Bucket S3 object
 * @author Waqar Hussain
 */
export const getS3Object = () => {
	return new S3({
		accessKeyId: process.env.AWS_ACCESSS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_KEY,
		signatureVersion: 'v4',
		region: process.env.AWS_S3_REGION,
	})
}

export const getWasabiS3Object = () => {

	const credentials: Credentials = new Credentials(ENV.S3_BUCKET.ACCESS_KEY_ID, ENV.S3_BUCKET.SECRET_ACCESS_KEY)
	config.credentials = credentials
	const s3: S3 = new S3({
		endpoint: process.env.WASABI_ENDPOINT,
	})
	return s3

}

/**
 * @description returns Aws Simple Email Service(SES) object
 * @author Waqar Hussain
 */
export const getSesObject = () => {
	return new SES({
		accessKeyId: process.env.AWS_ACCESSS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_KEY,
		signatureVersion: 'v4',
		region: process.env.AWS_SES_REGION,
	})
}

/**
 * This function takes file from multer and validate the allowed file extension
 * used in case of form data
 * @param req
 * @returns boolean
 */
export const fileExtensionFilter = (req: Request, file: Express.Multer.File, callback: callbackType) => {
	if (!file.originalname.match(/\.(docx|pdf|txt|png|jpeg|jfif|jpg|html|DOCX|PDF|TXT|PNG|JPEG|JFIF|JPG|HTML)$/)) {
		return callback(
			new BadRequestException('only image files like .jpg,jfif,jpeg,png,docx,pdf,txt,html are allowed'),
			false
		)
	}
	callback(null as any, true)
}

export const imageFileFilter = (req: Request, file: Express.Multer.File, callback: callbackType) => {
	if (!file.originalname.match(/\.(png|jpeg|jpg|gif|PNG|JPEG|JPG|GIF)$/)) {
		return callback(new BadRequestException('only image files like .jpg,jpeg,png,gif are allowed'), false)
	}
	callback(undefined as any, true)
}

export const videoFileFilter = (req: Request, file: Express.Multer.File, callback: callbackType) => {
	if (!file.originalname.match(/\.(mp4|avi|mov|wmv|flv|webm|MP4|AVI|MOV|WMV|FLV|WEBM)$/)) {
		return callback(new BadRequestException('only video files like .mp4,avi,mov,wmv,flv,webm are allowed'), false)
	}
	callback(undefined as any, true)
}

/**
 * Generate a URL-friendly slug from a string
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '') // Remove special characters
		.replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and hyphens with single hyphen
		.replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * This function takes stringify boolean or number string and convert it to boolean value
 * used in case of form data
 * @param value
 * @returns booelan value or undefined
 */
export function toBoolean(value: string): boolean {
	if (typeof value === 'boolean') return value
	value = value.toLowerCase()
	return value === 'true' || value === '1' ? true : value === 'false' || value === '0' ? false : undefined as any
}

/**
 * This function takes comma separated number string and convert it to array
 * used in case of form data
 * @param value
 * @returns array of string
 */
export function convertNumberStringToArray(value: string) {
	const stringConvertedToAray = value.trim().split(',')
	const isValid = stringConvertedToAray.every((value) => {
		return Number(value)
	})
	if (!isValid) throw new BadRequestException('should be valid comma separated number string')
	return stringConvertedToAray
}
