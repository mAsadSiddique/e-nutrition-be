import { BadRequestException } from '@nestjs/common'
import { S3, SES } from 'aws-sdk'
import { callbackType } from './types/generic_types.type'
import { ENV } from 'src/config/constant'
import { plainToInstance } from 'class-transformer'

/**
 * @description returns AWS S3 client (Canada region by default)
 */
export const getS3Object = () => {
	return new S3({
		accessKeyId: ENV.S3_BUCKET.ACCESS_KEY_ID,
		secretAccessKey: ENV.S3_BUCKET.SECRET_ACCESS_KEY,
		signatureVersion: 'v4',
		region: ENV.S3_BUCKET.REGION,
	})
}

/**
 * @description returns AWS Simple Email Service (SES) client
 */
export const getSesObject = () => {
	return new SES({
		accessKeyId: ENV.S3_BUCKET.ACCESS_KEY_ID,
		secretAccessKey: ENV.S3_BUCKET.SECRET_ACCESS_KEY,
		signatureVersion: 'v4',
		region: ENV.AWS_SES.REGION,
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

export function parseToJson(value: string, validationDTO: any) {
	try {
		// let parsed = undefined
		if (typeof value === 'string' && !value?.length) throw Error('Input value must be a non-empty JSON string')
		const parsed = typeof value === 'string' ? JSON.parse(/%[0-9A-Fa-f]{2}/.test(value) ? decodeURIComponent(value) : value) : value
		// Return transformed data based on the type of parsed value

		return Array.isArray(parsed)
			? parsed.map((item) => plainToInstance(validationDTO, item))
			: parsed && typeof parsed === 'object'
				? plainToInstance(validationDTO, parsed)
				: (() => {
						throw new TypeError('Parsed value is neither an array nor an object.')
					})()
	} catch (error) {
		// Catch JSON.parse errors or any other issues
		throw new BadRequestException(`Failed to parse value: ${error?.['message']}`, parseToJson.name)
	}
}