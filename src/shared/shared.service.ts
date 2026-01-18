import { Injectable, Logger } from '@nestjs/common'
import { ExceptionService } from './exception.service'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { getWasabiS3Object } from '../utils/utils'
import * as crypto from 'crypto'
import { PreviewableFileType } from '../utils/types/previewable_file.type'
import { ObjectType } from '../utils/types/generic_types.type'
import  sharp from 'sharp'
import { BucketParamType } from 'src/utils/types/bucket-param.type'
import { ENV } from 'src/config/constant'
import { RESPONSE_MESSAGES } from 'src/utils/enums/response-messages.enum'
import { DimDTO, ImgDimDTO } from 'src/blog/dtos/dim.dto'
import { S3 } from 'aws-sdk'

/**
 * JWT error message mapping
 */
const JWT_ERRORS = {
	'invalid token': RESPONSE_MESSAGES.JWT_INVALID,
	'jwt malformed': RESPONSE_MESSAGES.JWT_INVALID,
	'jwt expired': RESPONSE_MESSAGES.JWT_EXPIRED,
	'invalid signature': RESPONSE_MESSAGES.INVALID_SIGNATURE,
}

/**
 * Image compression constants
 */
const IMAGE_CONSTANTS = {
	COMPRESSION_THRESHOLD: 25600, // bytes
	MAX_HEIGHT: 1200,
	MAX_WIDTH: 900,
	JPEG_QUALITY: 60,
}


@Injectable()
export class SharedService {
	private readonly logger = new Logger(SharedService.name)
	private readonly s3 = getWasabiS3Object()

	constructor(
		private readonly exceptionService: ExceptionService) { }

	/**
	 * @description send response to client
	 * @param message
	 * @param data
	 * @author Waqar Hussain
	 */
	sendResponse(message: string, data: any = {}) {
		return { message, data, status: 200 }
	}

	/**
	 * @description send error to client
	 * @param error
	 * @param funName
	 * @author Waqar Hussain
	 */
	sendError(error: any, funName: string) {
		this.logger.error(error.message, error, funName)
		if (!error.response) {
			this.exceptionService.sendInternalServerErrorException(RESPONSE_MESSAGES.SERVER_TEMPORY_DOWN)
		}
		throw error
	}

	/**
	 * @description print error in logs
	 * @param error
	 * @param funName
	 * @author Waqar Hussain
	 */
	printError(error: any, funName: string) {
		this.logger.error(error.message, error, funName)
	}

	/**
	 * @description find difference between two date in days
	 * if difference is less than 1 day it will be zero
	 * @param date1
	 * @param date2
	 * @author Waqar Hussain
	 */
	async dateDiffInDays(date1: Date, date2: Date): Promise<number> {
		try {
			const MS_PER_DAY = 1000 * 60 * 60 * 24
			// Discard the time and time-zone information.
			const utc1 = Date.UTC(
				date1.getFullYear(),
				date1.getMonth(),
				date1.getDate(),
				date1.getHours(),
				date1.getMinutes(),
				date1.getSeconds()
			)
			const utc2 = Date.UTC(
				date2.getFullYear(),
				date2.getMonth(),
				date2.getDate(),
				date2.getHours(),
				date2.getMinutes(),
				date2.getSeconds()
			)

			return Math.floor((utc2 - utc1) / MS_PER_DAY)
		} catch (error) {
			this.sendError(error, this.dateDiffInDays.name)
			return 0
		}
	}

	/**
	 * @description find difference between two date in minutes
	 * @param date1
	 * @param date2
	 * @author Waqar Hussain
	 */
	dateDiffInMins(date1: Date, date2: Date) {
		try {
			let diff = (date1.getTime() - date2.getTime()) / 1000
			diff /= 60
			return Math.abs(Math.round(diff))
		} catch (error) {
			this.sendError(error, this.dateDiffInMins.name)
		}
	}

	/**
	 * @description verify password and confirm password are same
	 * @param password
	 * @param confirmPassword
	 * @author Waqar Hussain
	 */
	passwordsVerificatoin(password: string, confirmPassword: string) {
		try {
			if (password !== confirmPassword) {
				this.exceptionService.sendNotAcceptableException(RESPONSE_MESSAGES.PASSWORD_NOT_MATCHED)
			}
			return true
		} catch (error) {
			this.sendError(error, this.passwordsVerificatoin.name)
		}
	}

	/**
	 * @description return hashed password
	 * @param password
	 * @author Waqar Hussain
	 */
	hashedPassword(password: string) {
		try {
			return bcrypt.hashSync(password, ENV.JWT.SALT_ROUNDS)
		} catch (error) {
			this.sendError(error, this.hashedPassword.name)
		}
	}

	/**
	 * @description verify password are same or not
	 * @param password
	 * @param secondPassword
	 * @author Waqar Hussain
	 */
	passwordVerification(password: string, secondPassword: string) {
		try {
			const isPasswordMatched = bcrypt.compareSync(password, secondPassword)
			if (!isPasswordMatched) {
				this.exceptionService.sendForbiddenException(RESPONSE_MESSAGES.INVALID_CREDENTIALS)
			}
			return true
		} catch (error) {
			this.sendError(error, this.passwordVerification.name)
		}
	}

	/**
	 * @description verify password are same or not
	 * @param password
	 * @param secondPassword
	 * @author Waqar Hussain
	 */
	isValidPassword(defaultPassword: string, hashedPassword: string) {
		try {
			return bcrypt.compareSync(defaultPassword, hashedPassword)
		} catch (error) {
			this.sendError(error, this.isValidPassword.name)
		}
	}

	/**
	 * @description returns jwt
	 * @param payload
	 * @author Waqar Hussain
	 */
	generateJwt(payload: ObjectType) {
		try {
		return jwt.sign( payload , ENV.JWT.SECRET, { expiresIn: ENV.JWT.EXPIRES_IN } as any)
		} catch (error) {
			this.sendError(error, this.generateJwt.name)
		}
	}

	/**
	 * @description returns unique id of 16 digit
	 * @author Waqar Hussain
	 */
	getUniqueId() {
		try {
			return crypto.randomBytes(4 * 2).toString('hex')
		} catch (error) {
			this.sendError(error, this.getUniqueId.name)
		}
	}

	/**
	 * @description verify time delay between to two dates in minutes
	 * and validate it to be more than 5
	 * @param oldDate
	 * @param currentDate
	 * @author Waqar Hussain
	 */
	timeDelayVerification(oldDate: Date, currentDate: Date) {
		try {
			const timeDiff = this.dateDiffInMins(oldDate, currentDate)
			if (timeDiff && timeDiff < 5) {
				this.exceptionService.sendNotAcceptableException(RESPONSE_MESSAGES.WAIT_TO_RESEND_AGAIN)
			}
			return true
		} catch (error) {
			this.sendError(error, this.timeDelayVerification.name)
		}
	}

	/**
	 * @description upload single file to bucket and returns key
	 * @param file
	 * @author Waqar Hussain
	 */
	async uploadFileToS3Bucket(file: Express.Multer.File) {
		try {
			const key = Date.now() + file.originalname
		const bucketName = ENV.S3_BUCKET.NAME
		const params = {
			Body: file.buffer,
			Bucket: bucketName,
			Key: key,
		}
			await this.s3.putObject(params).promise()
			return key
		} catch (error) {
			this.sendError(error, this.uploadFileToS3Bucket.name)
		}
	}


	async getFileFromS3Bucket(key: string) {
		try {
			const params = {
				Bucket: ENV.S3_BUCKET.NAME,
				Key: key,
				Expires: 604800
			}
			return await Promise.resolve(this.s3.getSignedUrl('getObject', params))
		} catch (error) {
			throw error
		}
	}

	/**
	 * @description upload multiple file to bucket and returns array of keys
	 * @param files
	 * @author Waqar Hussain
	 */
	async uploadFilesToS3Bucket(files: Express.Multer.File[]) {
		try {
			const requests: Promise<any>[] = []
			const keys: any = {}
			const bucketName = ENV.S3_BUCKET.NAME
			for (const [objKey, file] of Object.entries(files)) {
				const key = Date.now() + file[0].originalname
				keys[objKey] = key
				const param = {
					Body: file[0].buffer,
					Bucket: bucketName,
					Key: key,
				}
				requests.push(this.s3.putObject(param).promise())
			}
			await Promise.all(requests)
			return keys
		} catch (error) {
			this.sendError(error, this.uploadFilesToS3Bucket.name)
		}
	}

	async findAndRemoveImage(images: ObjectType, imageUrls: ObjectType, imagesToBeRemoved: string[]) {
		try {
			const params: BucketParamType[] = []
			const bucketName = ENV.S3_BUCKET.NAME
			if (images) {
				for (const [keyInDb, value] of Object.entries(images)) {
					const isKeyFound = imagesToBeRemoved.findIndex((key) => key === keyInDb)
					if (isKeyFound !== -1) {
						const param = {
							Bucket: bucketName,
							Key: value,
						}
						params.push(param)
						delete images[keyInDb]
						delete imageUrls[keyInDb]
					}
				}
			}
			return { images, imageUrls, params }
		} catch (error) {
			throw error
		}
	}

	async deleteFilesFromS3Bucket(keys: string[]): Promise<void> {
		try {
			const deleteRequests: Promise<any>[] = []

			keys.forEach((key) => {
				const params = {
					Bucket: ENV.S3_BUCKET.NAME,
					Key: key,
				}
				deleteRequests.push(this.s3.deleteObject(params).promise())
			})
			await Promise.all(deleteRequests)
		} catch (error) {
			this.logger.error('Failed to delete files from S3 bucket', error)
			throw error
		}
	}

	/**
	 * @description upload multiple previewable file to bucket with file type and returns array of objects
	 * @param files
	 * @author Waqar Hussain
	 */
	async uploadFilesWithMimeTypeToBucket(files: Express.Multer.File[]) {
		try {
			const requests: Promise<any>[] = []
			const keys: string[] = []
			const keysWithMimeTypes: PreviewableFileType[] = []
			const bucketName = ENV.S3_BUCKET.NAME
			for (const file of files) {
				const keyHolder: any = {
					name: file.originalname,
				}
				const key = Date.now() + file.originalname
				const param = {
					Body: file.buffer,
					Bucket: bucketName,
					Key: key,
				}
				requests.push(this.s3.putObject(param).promise())
				keys.push(key)
				keyHolder[file.mimetype] = key
				keysWithMimeTypes.push(keyHolder)
			}
			await Promise.all(requests)
			return keysWithMimeTypes
		} catch (error) {
			this.sendError(error, this.uploadFilesWithMimeTypeToBucket.name)
		}
	}

	/**
	 * @description fetch file from bucket
	 * @param key
	 * @author Waqar Hussain
	 */
	async getFileFromBucket(key: string) {
		try {
			const bucketName = ENV.S3_BUCKET.NAME
			const params = {
				Bucket: bucketName,
				Key: key,
			}
			try {
				await this.s3.headObject(params).promise()
			} catch (error) {
				console.log(error)
				this.exceptionService.sendNotFoundException(RESPONSE_MESSAGES.IMAGE_NOT_FOUND)
			}
			const signedUrl = this.s3.getSignedUrl('getObject', params)
			return signedUrl
		} catch (error) {
			this.sendError(error, this.getFileFromBucket.name)
		}
	}

	/**
	 * @description fetch multiple files from bucket
	 * @param keys
	 * @author Waqar Hussain
	 */
	async getFilesFromS3Bucket(keysWithValue: {}) {
		try {
			const requests: string[] = []
			const urlsToBeReturn: any = {}
			const bucketName = ENV.S3_BUCKET.NAME
			let counter = 0
			for (const [key, value] of Object.entries(keysWithValue)) {
				const param = {
					Bucket: bucketName,
					Key: value,
					Expires: 604800,
				}
				requests.push(this.s3.getSignedUrl('getObject', param))
			}
			const urls = await Promise.all(requests)
			for (const [key, value] of Object.entries(keysWithValue)) {
				urlsToBeReturn[key] = urls[counter]
				counter++
			}
			return urlsToBeReturn
		} catch (error) {
			this.exceptionService.sendNotFoundException(RESPONSE_MESSAGES.IMAGE_NOT_FOUND)
		}
	}

	/**
	 * @description fetch multiple previewable files from bucket returns original name and url
	 * @param keys
	 * @author Waqar Hussain
	 */
	async getMultipleFileWithMimeTypeByKeys(keys: PreviewableFileType[]) {
		try {
			const requests: string[] = []
			const docNames: string[] = []
			const bucketName = ENV.S3_BUCKET.NAME
			for (const keyObj of keys) {
				const [[, name], [key, value]] = Object.entries(keyObj)
				const param = {
					Bucket: bucketName,
					Key: value,
					ResponseContentType: key,
					ResponseContentDisposition: 'inline',
				}
				requests.push(this.s3.getSignedUrl('getObject', param))
				docNames.push(name)
			}
			return { urls: await Promise.all(requests), docNames }
		} catch (error) {
			console.log(error)
			this.exceptionService.sendNotFoundException(RESPONSE_MESSAGES.IMAGE_NOT_FOUND)
		}
	}

	/**
	 * @description delete file from bucket
	 * @param key
	 * @author Waqar Hussain
	 */
	async deleteFileFromS3Bucket(key: string) {
		try {
			const bucketName = ENV.S3_BUCKET.NAME
			const params = {
				Bucket: bucketName,
				Key: key,
			}
			return await this.s3.deleteObject(params).promise()
		} catch (error) {
			this.exceptionService.sendNotFoundException(RESPONSE_MESSAGES.IMAGE_NOT_FOUND)
		}
	}



	bcryptCompareVerificatoin(password: string, userInput: string) {
		try {
			const isPasswordMatched = bcrypt.compareSync(password, userInput)
			if (!isPasswordMatched) {
				this.exceptionService.sendNotAcceptableException(RESPONSE_MESSAGES.INVALID_CREDENTIALS)
			}
			return true
		} catch (error) {
			throw error
		}
	}

	getJwt(payload: ObjectType) {
		try {
			return jwt.sign( payload , ENV.JWT.SECRET, { expiresIn: ENV.JWT.EXPIRES_IN } as any)
		} catch (error) {
			throw error
		}
	}
	getDecodedToken(token: string, requestedRoute?: string) {
		try {
			return jwt.verify(token,ENV.JWT.SECRET)
		} catch (error) {
			if (
				error.message === 'jwt expired' &&
				(requestedRoute === process.env.ADMIN_LOGOUT_ROUTE || requestedRoute === process.env.USER_LOGOUT_ROUTE)
			) {
				return jwt.decode(token)
			} else {
				this.exceptionDetector(error)
				this.sendError(error, this.getDecodedToken.name)
			}
		}
	}

	exceptionDetector(error) {
		console.error(error)
		if (error.message === 'invalid token' || error.message === 'jwt malformed')
			this.exceptionService.sendUnauthorizedException(RESPONSE_MESSAGES.JWT_INVALID)

		if (error.message === 'jwt expired') this.exceptionService.sendUnauthorizedException(RESPONSE_MESSAGES.JWT_EXPIRED)

		if (error.message === 'invalid signature')
			this.exceptionService.sendUnauthorizedException(RESPONSE_MESSAGES.INVALID_SIGNATURE)

		if (error.response) {
			this.exceptionService.sendUnauthorizedException(error.message)
		}
	}

	// appendDateFilterQuery(args: any, query: any) {
	// 	try {
	// 		if (args.fromDate && args.toDate) {
	// 			if (args.fromDate > args.toDate) {
	// 				this.exceptionService.sendUnprocessableEntityException(RESPONSE_MESSAGES.FROM_DATE_MUST_BE_GREATER_THAN_TO_DATE)
	// 			}
	// 			query['createdAt'] = {
	// 				$gte: new Date(args.fromDate),
	// 				$lte: new Date(new Date(args.toDate).setDate(new Date(args.toDate).getDate() + 1))
	// 			}
	// 		} else if (args.fromDate) {
	// 			query['createdAt'] = { $gte: new Date(args.fromDate) }
	// 		} else if (args.toDate) {
	// 			query['createdAt'] = { $lte: new Date(new Date(args.toDate).setDate(new Date(args.toDate).getDate() + 1)) }
	// 		}
	// 	} catch (error) {
	// 		this.sendError(error, this.appendDateFilterQuery.name)
	// 	}
	// }

	// appendDateFilterCondition(args, whereClause: ObjectType) {
	// 	try {
	// 		if (args.fromDate && args.toDate) {
	// 			if (args.fromDate > args.toDate) {
	// 				this.exceptionService.sendUnprocessableEntityException(RESPONSE_MESSAGES.FROM_DATE_MUST_BE_GREATER_THAN_TO_DATE)
	// 			}

	// 			whereClause['createdAt'] = {
	// 				$gte: new Date(args.fromDate),
	// 				$lte: new Date(new Date(args.toDate).setDate(new Date(args.toDate).getDate() + 1))
	// 			}
	// 		} else if (args.fromDate) {
	// 			whereClause['createdAt'] = { $gte: new Date(args.fromDate) }
	// 		} else if (args.toDate) {
	// 			whereClause['createdAt'] = { $lte: new Date(new Date(args.toDate).setDate(new Date(args.toDate).getDate() + 1)) }
	// 		}
	// 	} catch (error) {
	// 		this.sendError(error, this.appendDateFilterCondition.name)
	// 	}
	// }

	/**
	 * Detects and handles JWT-related exceptions
	 *
	 * Maps common JWT error messages to appropriate exception responses
	 *
	 * @param error - The error object from JWT operations
	 */
	jwtExceptionDetector(error: any): void {
		this.logger.debug(`JWT error detected: ${error.message}`)

		// Handle known JWT errors
		const errorMessage = error.message
		if (JWT_ERRORS[errorMessage]) {
			this.logger.warn(`Handling known JWT error: ${errorMessage}`)
			this.exceptionService.sendUnauthorizedException(JWT_ERRORS[errorMessage])
		}

		// Handle response errors
		if (error.response && !error?.status) {
			this.logger.warn(`JWT response error: ${errorMessage}`)
			this.exceptionService.sendUnauthorizedException(errorMessage)
		}
	}

		/**
	 * Generates a random alphanumeric string of the given length using
	 * cryptographically secure random bytes.
	 *
	 * Note: Uniqueness is not guaranteed. For unique values, add a check (e.g., DB or memory).
	 *
	 * @param length - Length of the string to generate.
	 * @returns A random alphanumeric string.
	 */
	generateRandomString(length: number): string {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
		let result = ''

		// Generate random bytes and map them to the chars array
		const bytes = crypto.randomBytes(length)
		for (let i = 0; i < length; i++) {
			const index = bytes[i] % chars.length
			result += chars[index]
		}

		return result
	}

	async uploadMultipleFileToS3Bucket(mediaFiles: Array<Express.Multer.File> | {[key: string]: Express.Multer.File[]}, dims: ImgDimDTO | undefined, isCompressable = false) {
		try {
			const requests: Promise<S3.PutObjectOutput>[] = []
			const keys = {}
			for (const [objKey, files] of Object.entries(mediaFiles)) {
				for (const file of files) {
					const mimetype = file.mimetype.split('/')[0]

					const key = `${objKey}_${(Date.now() + file.originalname).replace(/\s+/g, '')}`
					
					keys[key] = objKey
					let compressedData: Buffer
					if (['video', 'videos', 'audio'].includes(mimetype)) {
						// TODO: will implement video compression logic
						compressedData = file.buffer
					} else {
						compressedData = isCompressable ? await this.compressImageData(file.buffer, dims && dims[objKey]) : file.buffer
					}
					if (!compressedData) continue
					const param = {
						Body: compressedData,
						Bucket: ENV.S3_BUCKET.NAME,
						Key: key,
					}
					requests.push(this.s3.putObject(param).promise())
				}
			}
			await Promise.all(requests)
			return keys
		} catch (error) {
			throw error
		}
	}

	async getMultipleFilesFromS3Bucket(keysWithValue: Record<string, string>): Promise<Record<string, string>> {
		try {
			const requests: Promise<string>[] = []
			const urlsToBeReturn: ObjectType = {}

			// Create signed URL requests for each file key
			for (const [key, value] of Object.entries(keysWithValue)) {
				const param = {
					Bucket: ENV.S3_BUCKET.NAME,
					Key: key,
					Expires: 604800, // 7 days in seconds
				}
				requests.push(Promise.resolve(this.s3.getSignedUrl('getObject', param))) // Wrap in Promise for consistency
			}

			// Resolve all signed URLs
			const urls = await Promise.all(requests)

			// Map signed URLs back to their original keys
			let counter = 0
			for (const key of Object.keys(keysWithValue)) {
				urlsToBeReturn[key] = urls[counter]
				counter++
			}
			return urlsToBeReturn
		} catch (error) {
			this.exceptionService.sendNotFoundException(RESPONSE_MESSAGES.IMAGE_NOT_FOUND)
		}
	}

	/**
	 * Compresses an image buffer with optional dimension constraints
	 *
	 * Uses the sharp library to resize and compress images above the threshold size
	 *
	 * @param data - Image buffer
	 * @param dim - Optional dimension constraints (width and height)
	 * @returns Promise resolving to the compressed image buffer
	 */
	private async compressImageData(data: Buffer, dim?: DimDTO): Promise<Buffer> {
		const startSize = data.length
		this.logger.debug(`Compressing image, original size: ${startSize} bytes`)

		// Return original if below threshold and no dimensions provided
		if (startSize <= IMAGE_CONSTANTS.COMPRESSION_THRESHOLD && (!dim || !dim.height || !dim.width)) {
			this.logger.debug('Image below compression threshold, returning original')
			return data
		}

		try {
			// Process image with dimensions if provided
			if (dim && dim.height && dim.width) {
				return await this.resizeAndCompressImage(data, dim.width, dim.height)
			}

			// Basic compression without resizing
			const compressed = await sharp(data).jpeg({quality: IMAGE_CONSTANTS.JPEG_QUALITY}).withMetadata().toBuffer()

			this.logger.debug(`Image compressed from ${startSize} to ${compressed.length} bytes`)
			return compressed
		} catch (error) {
			this.logger.error(`Image compression failed: ${error}`)
			// Return original data if compression fails
			return data
		}
	}

	/**
	 * Resizes and compresses an image based on target dimensions
	 *
	 * Maintains aspect ratio while fitting within maximum dimensions
	 *
	 * @param data - Image buffer
	 * @param width - Original width
	 * @param height - Original height
	 * @returns Promise resolving to the resized and compressed image
	 */
	private async resizeAndCompressImage(data: Buffer, width: number, height: number): Promise<Buffer> {
		const {MAX_HEIGHT, MAX_WIDTH, JPEG_QUALITY} = IMAGE_CONSTANTS

		// Calculate new dimensions while preserving aspect ratio
		let newWidth = width
		let newHeight = height
		const aspectRatio = width / height
		const maxAspectRatio = MAX_WIDTH / MAX_HEIGHT

		if (height > MAX_HEIGHT || width > MAX_WIDTH) {
			if (aspectRatio < maxAspectRatio) {
				// Height limited by MAX_HEIGHT
				const ratio = MAX_HEIGHT / height
				newWidth = Math.round(ratio * width)
				newHeight = MAX_HEIGHT
			} else {
				// Width limited by MAX_WIDTH
				const ratio = MAX_WIDTH / width
				newHeight = Math.round(ratio * height)
				newWidth = MAX_WIDTH
			}
		}

		this.logger.debug(`Resizing image from ${width}x${height} to ${newWidth}x${newHeight}`)

		try {
			return await sharp(data).jpeg({quality: JPEG_QUALITY}).resize(newWidth, newHeight, {fit: 'outside'}).withMetadata().toBuffer()
		} catch (error) {
			this.logger.error(`Image resize failed: ${error}`)
			throw error
		}
	}
}
