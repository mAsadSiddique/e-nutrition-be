import {Injectable, Logger} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {User} from '../entities/user.entity'
import {IsNull, LessThan, Not, QueryRunner, Repository} from 'typeorm'
import {ExceptionService} from 'src/shared/exception.service'
import {SharedService} from 'src/shared/shared.service'
import {EditUserProfileDTO} from '../dtos/edit_user_profile.dto'
import {ProfileImageType} from '../types/profile_image.type'
import {UserProfileResponseType} from '../types/api_success.response'
import {RegisterationTypeEnum, UserTypeEnum} from '../enums/user.enums'
import {UserStatusEnum} from '../enums/status.enum'
import {CheckUserAvailabilityDTO} from '../dtos/validate_user_existance.dto'
import {UserAccountService} from './user-account.service'
import {RetryAccountVerificationDTO} from '../dtos/retry_account_verification.dto'
import {JwtService} from '@nestjs/jwt'
import { RESPONSE_MESSAGES } from 'src/utils/enums/response-messages.enum'
import { BlogService } from 'src/blog/services/blog.service'
import { UserWishlistService } from 'src/shared/user_wishlist.service'

@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name)
	private isCronRunning = false

	constructor(
		@InjectRepository(User)
		private readonly userRepo: Repository<User>,
		private readonly exceptionService: ExceptionService,
		private readonly sharedService: SharedService,
		private readonly userAccountService: UserAccountService,
		private readonly jwtService: JwtService,
		private readonly userWishlistService: UserWishlistService,
	) {}

	/**
	 * Retrieves a user's profile information
	 *
	 * @param args - User entity with ID for lookup
	 * @returns Promise with the user profile data
	 */
	async getUserProfile(user: User) {
		try {
			this.logger.log(`Fetching profile for user ID: ${user.id}`)
			const profile = await this.userRepo.findOne({
				select: {
					id: true,
					username: true,
					email: true,
					firstName: true,
					lastName: true,
					phoneNumber: true,
					gender: true,
					registrationType: true,
					address: true,
					dob: {day: true, month: true, year: true},
					profileImage: {url: true},
					isNotificationEnabled: true,
					userType: true,
					userVerifications: true as {},
				},
				where: {id: user.id},
			})

			this.logger.debug(`Successfully retrieved profile for user ID: ${user.id}`)

			// Prepare base response
			const responseData: UserProfileResponseType = { profile }
			if(![RegisterationTypeEnum.EMAIL, RegisterationTypeEnum.PHONE].includes(user.registrationType)){
			responseData['userWishlist'] = await this.userWishlistService.getUserWishlistByUserId(user.id)
			}

			return this.sharedService.sendResponse(RESPONSE_MESSAGES.SUCCESS, responseData)
		} catch (error) {
			this.sharedService.sendError(error, this.getUserProfile.name)
		}
	}

	/**
	 * Updates a user's profile information including optional profile image
	 *
	 * @param editProfDto - DTO containing profile update data
	 * @param file - Optional file upload for profile image
	 * @param user - Current user entity
	 * @returns Promise with updated user profile data
	 */
	async editProfile(args: EditUserProfileDTO, user: User, queryRunner?: QueryRunner) {
		try {
			this.logger.log(`Updating profile for user ID: ${user.id}`)
			let msg: string = ''

			// Validate email uniqueness if provided
			if (args.email && args.email !== user.email) {
				this.logger.debug(`Validating email uniqueness: ${args.email}`)
				const existingUser = await this.userRepo.findOne({where: {email: args.email}})

				if (existingUser) {
					// Always enforce uniqueness - email must be unique regardless of verification status
					this.logger.warn(`Email already exists: ${args.email} for user: ${existingUser.id}`)
					this.exceptionService.sendConflictException(RESPONSE_MESSAGES.USER_EMAIL_ALREADY_EXIST)
				}

				// Only update email and send verification if it's actually changing
				user.userVerifications.email = false
				msg = await this.userAccountService.sendAccountVerificationCode({email: args.email} as RetryAccountVerificationDTO, user) as string
			}

			// Validate phone number uniqueness if provided
			if (args.phoneNumber && args.phoneNumber !== user.phoneNumber) {
				this.logger.debug(`Validating phone number uniqueness: ${args.phoneNumber}`)
				const existingUser = await this.userRepo.findOne({where: {phoneNumber: args.phoneNumber}})

				if (existingUser) {
					// Always enforce uniqueness - phone must be unique regardless of verification status
					this.logger.warn(`Phone number already exists: ${args.phoneNumber} for user: ${existingUser.id}`)
					this.exceptionService.sendConflictException(RESPONSE_MESSAGES.USER_PHONE_ALREADY_EXIST)
				}

				// Only update phone and send verification if it's actually changing
				user.userVerifications.phoneNumber = false
				msg = await this.userAccountService.sendAccountVerificationCode({phoneNumber: args.phoneNumber} as RetryAccountVerificationDTO, user) as string
			}

			// Validate username uniqueness if provided
			if (args.username && args.username !== user.username) {
				this.logger.debug(`Validating username uniqueness: ${args.phoneNumber}`)
				const username = await this.userRepo.findOne({where: {username: args.username}})
				if (username) {
					this.exceptionService.sendConflictException(RESPONSE_MESSAGES.UsernameAlreadyExist)
				}
			}

			// Process location information (city and town)
			// if (args.townId) {
			// 	this.logger.debug(`Processing town ID: ${args.townId}`)

			// 	const town = await this.locService.fetchTownWithCityInfo(args.townId)
			// 	if (town) {
			// 		args.cityId = town?.cityId.id
			// 	}
			// } else if (args.cityId) {
			// 	this.logger.debug(`Processing City ID: ${args.cityId}`)
			// 	const city = await this.locService.getCityById(args.cityId)
			// 	args.townId = null as any
			// 	if (!city) {
			// 		this.exceptionService.sendBadRequestException(RESPONSE_MESSAGES.InvalidCitySlug)
			// 	}
			// }

			// Process profile image if provided
			// if (file) {
			// 	if (file.userProfileImage) {
			// 		this.logger.debug('Processing profile image upload')
			// 		user.profileImage.key = await this.sharedService.uploadFileToS3Bucket(file.userProfileImage[0])
			// 		user.profileImage.url = await this.sharedService.getFileFromS3Bucket(user.profileImage.key, true)
			// 		user.profileImage.expiredAt = new Date().setDate(new Date().getDate() + PROFILE_IMAGE_EXPIRY_DAYS)
			// 		this.logger.debug(`Profile image uploaded with key: ${user.profileImage.key}`)
			// 	}
			// }

			// use base64 for cropped image
			// if (args.profileImage) {
			// 	const bufferConversion = Buffer.from(args.profileImage.fileBase64, 'base64') // Convert base64 to binary
			// 	const profileImage = {
			// 		originalname: args.profileImage.fileName,
			// 		buffer: bufferConversion,
			// 	}
			// 	if (user.profileImage?.key) {
			// 		await this.sharedService.deleteFileFromS3Bucket(user.profileImage.key)
			// 	}
			// 	user.profileImage = user.profileImage ? user.profileImage : ({} as ProfileImageType)
			// 	user.profileImage.key = await this.sharedService.uploadFileToS3Bucket(profileImage as Express.Multer.File) as string
			// 	user.profileImage.url = await this.sharedService.getFileFromS3Bucket(user.profileImage.key)
			// 	user.imageExpiredAt = new Date().setDate(new Date().getDate() + 6)
			// }

			delete args.profileImage
			this.logger.debug(`Applying profile updates for user ID: ${user.id}`)
			Object.assign(user, args)

			queryRunner ? await queryRunner.manager.update(User, {id: user.id}, user) : await this.userRepo.update({id: user.id}, user)
			this.logger.log(`Profile successfully updated for user ID: ${user.id}`)

			const profile = await this.getUserProfile(user)

			if (args.username && profile) profile.data['jwt'] = this.jwtService.sign(this.userAccountService.getLoginPayload(user))

			return this.sharedService.sendResponse(RESPONSE_MESSAGES.PROFILE_UPDATED + (msg?.length ? ` and ${msg}` : ''), profile?.data)
		} catch (error) {
			this.sharedService.sendError(error, this.editProfile.name)
		}
	}

	/**
	 * Cron job that runs every day at midnight to refresh expired profile image URLs.
	 * It checks for users whose `imageExpiredAt` is within the next 6 hours and
	 * updates their `profileImage.url` by fetching a fresh signed URL from S3.
	 * The `imageExpiredAt` is also extended by 6 days.
	 */
	// @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	// async refreshProfileImagesUrls() {
	// 	try {
	// 		if (!this.isCronRunning) {
	// 			this.isCronRunning = true
	// 			this.logger.log(`Cron job starting to refresh profile image URL at ${new Date().toISOString()}`, this.refreshProfileImagesUrls.name)
	// 			let users: User[]
	// 			const fetchingLimit = 50
	// 			let counter = 0
	// 			do {
	// 				const expiredUserProfile: User[] = []
	// 				const timeAfterSixHours = Date.now() + 6 * 60 * 60 * 1000 // 6 hours from now
	// 				// Fetch a batch of users with expiring profile image URLs
	// 				users = await this.userRepo.find({
	// 					where: {
	// 						imageExpiredAt: LessThan(timeAfterSixHours),
	// 						profileImage: Not(IsNull()),
	// 					},
	// 					select: {id: true, imageExpiredAt: true, profileImage: true as {}},
	// 					take: fetchingLimit,
	// 					order: {id: 'ASC'},
	// 				})
	// 				for (const user of users) {
	// 					try {
	// 						// Fetch updated signed URL for user's profile image from S3
	// 						user.profileImage.url = await this.sharedService.getFileFromS3Bucket(user.profileImage.key)
	// 						// Extend expiration date by 6 days
	// 						user.imageExpiredAt = new Date().setDate(new Date().getDate() + 6)
	// 						expiredUserProfile.push(user)
	// 					} catch (error) {
	// 						this.logger.error(`Failed to update user profile image for user ${user.id}: ${error?.['message']}`, this.refreshProfileImagesUrls.name)
	// 					}
	// 				}
	// 				counter++
	// 				if (expiredUserProfile.length) {
	// 					await this.userRepo.save(expiredUserProfile)
	// 					this.logger.log(`Successfully updated ${expiredUserProfile.length} user profile images in batch ${counter}`, this.refreshProfileImagesUrls.name)
	// 				}
	// 			} while (users.length === fetchingLimit)
	// 			this.isCronRunning = false
	// 			this.logger.log(`Cron Finished refreshing profile image URLs after ${counter} batches.`)
	// 		}
	// 	} catch (error) {
	// 		this.isCronRunning = false
	// 		this.sharedService.sendError(error, this.refreshProfileImagesUrls.name)
	// 	}
	// }

	/**
	 * Promotes a user to the "Tasker" role by updating their userType.
	 *
	 * @param user - The user entity to be promoted.
	 * @returns A promise that resolves when the operation is complete.
	 */
	async promoteUserToTasker(user: User, queryRunner: QueryRunner): Promise<void> {
		try {
			this.logger.log(`Attempting to promote user to tasker: ${user.id}`, this.promoteUserToTasker.name)
			await queryRunner.manager.update(User, {id: user.id}, {userType: UserTypeEnum.TASKER})
			this.logger.log(`User promoted to tasker successfully: ${user.id}`, this.promoteUserToTasker.name)
		} catch (error) {
			this.sharedService.sendError(error, this.promoteUserToTasker.name)
		}
	}

	/**
	 * Fetches a user from the database by their username.
	 *
	 * @param username - The username of the user to find.
	 * @returns A User entity if found, or null if not found or an error occurs.
	 */
	async getUserByUsername(username: string) {
		try {
			return await this.userRepo.findOneBy({username})
		} catch (error) {
			this.sharedService.sendError(error, this.getUserByUsername.name)
		}
	}

	async getUserByUsernameWithLocation(username: string) {
		try {
			return await this.userRepo.findOne({
				select: {
					id: true,
					username: true,
					email: true,
					firstName: true,
					lastName: true,
					phoneNumber: true,
					gender: true,
					registrationType: true,
					address: true,
					dob: {day: true, month: true, year: true},
					profileImage: {url: true},
					isNotificationEnabled: true,
					userType: true,
					userVerifications: true as {},
				},
				where: {username},
			})
		} catch (error) {
			this.sharedService.sendError(error, this.getUserByUsername.name)
		}
	}

	async checkUserAvailability(args: CheckUserAvailabilityDTO) {
		try {
			let user: User | null = null
			if (args.email) {
				user = await this.userRepo.findOneBy({email: args.email})
			} else {
				user = await this.userRepo.findOneBy({phoneNumber: args.phoneNumber})
			}

			if (user) {
				// Only enforce uniqueness for verified users
				const isEmailVerified = args.email && user.userVerifications?.email === true
				const isPhoneVerified = args.phoneNumber && user.userVerifications?.phoneNumber === true

				if (isEmailVerified || isPhoneVerified) {
					const field = args.email ? `email: ${args.email}` : `phoneNumber: ${args.phoneNumber}`
					this.exceptionService.sendConflictException(`${RESPONSE_MESSAGES.UserAlreadyExist} with this verified ${field}`)
				}

				// Check if user is blocked - blocked users cannot register again
				if (user.status === UserStatusEnum.BLOCKED) {
					this.logger.warn(`Blocked user attempted to check availability: ${user.id}`)
					this.exceptionService.sendUnprocessableEntityException(RESPONSE_MESSAGES.USER_BLOCKED)
				}

				// If user exists but is not verified, allow reuse
				this.logger.log(`Found unverified user, allowing reuse: ${user.id}`)
			}

			return this.sharedService.sendResponse(RESPONSE_MESSAGES.SUCCESS, true)
		} catch (error) {
			this.sharedService.sendError(error, this.checkUserAvailability.name)
		}
	}
}
