import {Inject, Injectable, Logger} from '@nestjs/common'
import {ExceptionService} from 'src/shared/exception.service'
import {SharedService} from 'src/shared/shared.service'
import {User} from '../entities/user.entity'
import {SignupDTO} from '../dtos/signup.dto'
import {FindOptionsWhere, Repository} from 'typeorm'
import {InjectRepository} from '@nestjs/typeorm'
import {RegisterationTypeEnum, UserTypeEnum} from '../enums/user.enums'
import {UserStatusEnum} from '../enums/status.enum'
import * as bcrypt from 'bcrypt'
import {JwtService} from '@nestjs/jwt'
import {SetPasswordDTO} from '../dtos/set_password.dto'
import {ResetPasswordDTO} from '../dtos/reset_password.dto'
import {RetryAccountVerificationDTO} from '../dtos/retry_account_verification.dto'
import {AccountVerificationDTO} from '../dtos/account_verification.dto'
import {ENV} from 'src/config/constant'
import {LoginResponseType} from '../types/api_success.response'
import {UserSocialLoginType} from 'src/utils/types/user_social_login.type'
import * as randomString from 'randomstring'
import {CACHE_MANAGER} from '@nestjs/cache-manager'
import {VerificationCacheData} from '../types/user_vcerification_status.type'
import { RESPONSE_MESSAGES } from 'src/utils/enums/response-messages.enum'
import { LoginDTO } from 'src/shared/dto/login.dto'
import { ForgotPasswordDTO } from 'src/shared/dto/forgot_password.dto'
import { ChangePasswordDTO } from 'src/shared/dto/change_password.dto'

/**
 * Service responsible for user account management operations including:
 * - User registration
 * - Authentication
 * - Password management
 * - Account verification
 */

@Injectable()
export class UserAccountService {
	private readonly logger = new Logger(UserAccountService.name)

	constructor(
		@Inject(CACHE_MANAGER) private accountVerificationCache: any,
		@InjectRepository(User)
		private readonly userRepo: Repository<User>,
		private readonly exceptionService: ExceptionService,
		private readonly sharedService: SharedService,
		private readonly jwtService: JwtService,
	) {}

	/**
	 * Register a new user
	 * @param args User signup data
	 * @returns Response with success message
	 */
	async signup(args: SignupDTO, userType = UserTypeEnum.USER) {
		try {
			this.logger.log(`Attempting to register user with email: ${args.email || 'N/A'} or phone: ${args.phoneNumber || 'N/A'}`)

			// verify the password and confirm password are same
			if (args.password !== args.confirmPassword) {
				this.logger.warn('Password and confirm password do not match')
				this.exceptionService.sendBadRequestException(RESPONSE_MESSAGES.PASSWORD_NOT_MATCHED)
			}
			// Check if user already exists
			let user = await this.checkUserExistance(args.email, args.phoneNumber, args.username)

			if (!user) {
				user = new User(args)
				user.username = args.username ? args.username : await this.generateUniqueUsername(ENV.DEFAULT_USER.NAME) as string
			}
			// Hash password and set registration type
			user.password = bcrypt.hashSync(args.password, ENV.JWT.SALT_ROUNDS)
			user.registrationType = args.email ? RegisterationTypeEnum.EMAIL : RegisterationTypeEnum.PHONE
			user.userType = userType

			if (!user.id) {
				user.status = UserStatusEnum.VERIFICATION_PENDING
				await this.userRepo.insert(user)
				this.logger.log(`New user created with ID: ${user.id}`)
			} else {
				await this.userRepo.update({id: user.id}, user)
				this.logger.log(`Existing user updated with ID: ${user.id}`)
			}

			// Send verification code (email or phone)
			const msg = await this.sendAccountVerificationCode(args, user) as string
			this.logger.log(`Verification code sent successfully for user ${user.id}`, this.signup.name)

			return this.sharedService.sendResponse(msg, userType === UserTypeEnum.TASKER ? user : null)
		} catch (error) {
			this.sharedService.sendError(error, this.signup.name)
		}
	}

	/**
	 * Generates a unique username by appending a random 6-character string to the provided base username.
	 * Checks the database to ensure the resulting username is not already taken.
	 *
	 * @param username - The base username to start with.
	 * @returns A unique username string.
	 */
	async generateUniqueUsername(baseName: string) {
		try {
			let username: string
			do {
				username = baseName + this.sharedService.generateRandomString(6)
			} while (await this.userRepo.findOneBy({username}))
			return username
		} catch (error) {
			this.sharedService.sendError(error, this.generateUniqueUsername.name)
		}
	}

	/**
	 * Authenticate a user and generate JWT token
	 * @param args Login credentials
	 * @returns JWT token and user information
	 */
	async login(args: LoginDTO) {
		try {
			// Find user by email or phone number
			const whereClause = args.email ? {email: args.email} : {phoneNumber: args.phoneNumber}

			const user = await this.userRepo.findOne({
				select: {
					id: true,
					username: true,
					email: true,
					phoneNumber: true,
					registrationType: true,
					firstName: true,
					lastName: true,
					address: true,
					status: true,
					password: true,
					profileImage: {url: true},
					userType: true,
					userVerifications: true as {},
				},
				where: whereClause,
			})

			// Validate user existence
			if (!user) {
				this.logger.warn(`User not found: ${args.email}`)
				this.exceptionService.sendNotFoundException(RESPONSE_MESSAGES.USER_NOT_FOUND)
			}

			// Validate registration type
			if (user.registrationType !== RegisterationTypeEnum.EMAIL && user.registrationType !== RegisterationTypeEnum.PHONE) {
				this.logger.warn(`Invalid registration type for user: ${user.id}`)
				this.exceptionService.sendUnprocessableEntityException(RESPONSE_MESSAGES.RegisteredNotWithThisMethod)
			}

			// Check user account status
			if (user.status !== UserStatusEnum.ACTIVE) {
				const msg = user.status === UserStatusEnum.VERIFICATION_PENDING ? RESPONSE_MESSAGES.UserVerificationPending : RESPONSE_MESSAGES.USER_BLOCKED
				this.logger.warn(`User status check failed: ${msg} for user: ${user.id}`)
				this.exceptionService.sendForbiddenException(msg)
			}

			if (args.email && !user.userVerifications.email) this.exceptionService.sendForbiddenException(RESPONSE_MESSAGES.EmailVerificationPending)

			if (args.phoneNumber && !user.userVerifications.phoneNumber) this.exceptionService.sendForbiddenException(RESPONSE_MESSAGES.PhoneVerificationPending)

			// Validate password
			if (!bcrypt.compareSync(args.password, user.password)) {
				this.logger.warn(`Invalid password attempt for user: ${user.id}`)
				this.exceptionService.sendForbiddenException(RESPONSE_MESSAGES.INVALID_PASSWORD)
			}

			this.logger.log(`User logged in successfully: ${user.id}`)
			return await this.generateJwtAndSendResponse(user, false) // returning false as it's normal login not for verification
		} catch (error) {
			this.sharedService.sendError(error, this.login.name)
		}
	}

	/**
	 * Handles Google social login and user creation/update logic.
	 *
	 * If the user doesn't exist, it creates a new one with a unique username and hashed password.
	 * If the user exists but is in VERIFICATION_PENDING status, it activates the user.
	 * Finally, it returns a redirect URL depending on the result.
	 *
	 * @param args - UserSocialLoginType object containing email, username, and password (from Google).
	 * @returns A redirect URL indicating the login status.
	 */
	async googleLogin(args: UserSocialLoginType) {
		try {
			let user: User
			let url = `${ENV.FE_REDIRECT_PAGES.SOCIAL_MEDIA_REDIRECT_URL}?status=404`
			if (args) {
				user = (await this.userRepo.findOneBy({email: args.email})) || new User(args)
				if (!user.id) {
					user.username = args.username ? args.username : await this.generateUniqueUsername(ENV.DEFAULT_USER.NAME) as string
					user.password = bcrypt.hashSync(args?.password as string, ENV.JWT.SALT_ROUNDS)
					user.status = UserStatusEnum.ACTIVE
					user.registrationType = RegisterationTypeEnum.GOOGLE
					// Set phone number if provided in Google response
					if (args.phoneNumber) {
						user.phoneNumber = args.phoneNumber
					}
					// For new Google users: email=true, phone verification depends on whether phone is provided
					user.userVerifications = {email: true, phoneNumber: !!args.phoneNumber}
					await this.userRepo.insert(user)
					this.logger.log(`[GoogleLogin] New user registered successfully. Username: ${user.username}. Email: true, Phone: ${!!args.phoneNumber}`, this.googleLogin.name)
				} else if (user.status === UserStatusEnum.VERIFICATION_PENDING || user.userVerifications.email === false) {
					// For existing users with pending verification, activate them
					// Only set email verification to true if they are Google users
					user.status = UserStatusEnum.ACTIVE
					// Update phone number if provided in Google response
					if (args.phoneNumber) {
						user.phoneNumber = args.phoneNumber
					}
					// Set phone verification to true if phone number is provided in Google response, otherwise keep existing status
					const phoneVerificationStatus = args.phoneNumber ? true : (user.userVerifications?.phoneNumber ?? false)
					user.userVerifications = {email: true, phoneNumber: phoneVerificationStatus}
					await this.userRepo.update(
						{id: user.id},
						{
							status: user.status,
							phoneNumber: user.phoneNumber,
							userVerifications: user.userVerifications,
						}
					)
					this.logger.log(`[GoogleLogin] Existing user with pending verification was successfully activated: ${user.username}`, this.googleLogin.name)
				}

				url = this.getSocialMediaLoginRedirectUrl(user) as string
			}
			this.logger.log(`[GoogleLogin] Redirecting to URL: ${url}`, this.googleLogin.name)
			return url
		} catch (error) {
			this.sharedService.sendError(error, this.googleLogin.name)
		}
	}

	/**
	 * Generates a redirect URL after successful social media login.
	 *
	 * It creates a JWT token based on the user's login payload and appends it,
	 * along with the user payload, to the redirect URL as query parameters.
	 *
	 * @param user - The authenticated user entity.
	 * @returns A redirect URL containing status, token, and user payload.
	 */
	private getSocialMediaLoginRedirectUrl(user: User) {
		try {
			this.logger.log(`[RedirectURL] Generating redirect URL for user: ${user.username}`, this.getSocialMediaLoginRedirectUrl.name)
			// Generate the login payload
			const payload = this.getLoginPayload(user)
			this.logger.log(`[RedirectURL] Original payload registrationType: ${payload.registrationType}`, this.getSocialMediaLoginRedirectUrl.name)
			// Override registrationType to GOOGLE in JWT payload for Google login, regardless of database value
			payload.registrationType = RegisterationTypeEnum.GOOGLE
			this.logger.log(`[RedirectURL] Modified payload registrationType: ${payload.registrationType}`, this.getSocialMediaLoginRedirectUrl.name)
			const token = this.jwtService.sign(payload)
			// Return final redirect URL with query params
			return `${ENV.FE_REDIRECT_PAGES.SOCIAL_MEDIA_REDIRECT_URL}?status=200&token=${token}&user=${JSON.stringify(payload)}`
		} catch (error) {
			this.sharedService.sendError(error, this.getSocialMediaLoginRedirectUrl.name)
		}
	}

	/**
	 * Constructs the payload object for user login.
	 *
	 * This payload is used for generating JWT tokens and for including
	 * minimal user info in the login redirect process.
	 *
	 * @param user - The authenticated user entity.
	 * @returns A simplified user object with login details.
	 */
	getLoginPayload(user: User) {
		return {
			username: user.username,
			email: user.email,
			firstName: user.firstName,
			registrationType: user.registrationType,
			userType: user.userType,
			login: true,
		}
	}

	/**
	 * Set initial password for users registered via social or invited users
	 * @param args Password data
	 * @param user Authenticated user
	 * @returns Success response
	 */
	async setPassword(args: SetPasswordDTO, user: User){
		try {
			this.logger.log(`Setting password for user: ${user.id}`)
			// Check if user already has a custom password set
			if ((user.registrationType === RegisterationTypeEnum.EMAIL || user.registrationType === RegisterationTypeEnum.PHONE) && user.password !== ENV.DEFAULT_USER.PASSWORD) {
				this.logger.warn(`Password already set for user: ${user.id}`)
				this.exceptionService.sendForbiddenException(RESPONSE_MESSAGES.PASSWORD_ALREADY_SET)
			}

			// Validate password match
			if (args.password !== args.confirmPassword) {
				this.logger.warn('Password and confirm password do not match')
				this.exceptionService.sendBadRequestException(RESPONSE_MESSAGES.PASSWORD_NOT_MATCHED)
			}

			// Hash and update password
			user.password = bcrypt.hashSync(args.password, ENV.JWT.SALT_ROUNDS)
			user.registrationType = RegisterationTypeEnum.EMAIL
			user.status = UserStatusEnum.ACTIVE
			await this.userRepo.update({id: user.id}, user)
			this.logger.log(`Password set successfully for user: ${user.id}`)
			return this.sharedService.sendResponse(RESPONSE_MESSAGES.UserPasswordUpdated, null)
		} catch (error) {
			this.sharedService.sendError(error, this.setPassword.name)
		}
	}

	/**
	 * Initiate forgot password process
	 * @param args Email or phone for password recovery
	 * @returns Success response
	 */
	async forgotPassword(args: ForgotPasswordDTO) {
		try {
			this.logger.log(`Forgot password request for: ${args.email}`)
			const whereClause = args.email ? {email: args.email} : {phoneNumber: args.phoneNumber}

			const user = await this.getUserOrThrowException(whereClause) as User

			// Check user account status
			if (user.status !== UserStatusEnum.ACTIVE) {
				const msg = user.status === UserStatusEnum.VERIFICATION_PENDING ? RESPONSE_MESSAGES.UserVerificationPending : RESPONSE_MESSAGES.USER_BLOCKED
				this.logger.warn(`User status check failed: ${msg} for user: ${user.id}`)
				this.exceptionService.sendForbiddenException(msg)
			}

			const msg = await this.sendForgotPasswordCode(args) as string

			return this.sharedService.sendResponse(msg, null)
		} catch (error) {
			this.sharedService.sendError(error, this.forgotPassword.name)
		}
	}

	/**
	 * Reset user password using token or code
	 * @param args Reset password data with token
	 * @returns Success response
	 */
	async userResetPassword(args: ResetPasswordDTO){
		try {
			this.logger.log('Processing password reset request')
			let user: User | null = null

			// Handle email flow
			if (args.email) {
				// Verify the email verification code
				await this.verifyAccountCode(`resetPassword${args.email}`, args.code)
				this.logger.debug('Email verification code to reset password validated successfully', this.userResetPassword.name)

				// Retrieve user by email
				user = await this.getUserOrThrowException({email: args.email}) as User
				this.logger.debug(`User found with email to reset password: ${user.id}`, this.userResetPassword.name)
			}
			// Handle phone number flow
			else if (args.phoneNumber) {
				// Verify the phone verification code (Fixed: was using args.email instead of args.phoneNumber)
				await this.verifyAccountCode(`resetPassword${args.phoneNumber}`, args.code)
				this.logger.debug('Phone code validated to reset password successfully', this.userResetPassword.name)

				// Retrieve user by phone number
				user = await this.getUserOrThrowException({phoneNumber: args.phoneNumber}) as User
				this.logger.debug(`User found with phone number to reset password: ${user.id}`, this.userResetPassword.name)
			}
			// Handle case where neither email nor phone is provided
			else {
				this.logger.error('No email or phone number provided for reset password', this.userResetPassword.name)
				this.exceptionService.sendBadRequestException(RESPONSE_MESSAGES.EMAIL_OR_PHONE_NUMBER_REQUIRED)
			}

			if (args.password !== args.confirmPassword) {
				this.logger.warn('Password and confirm password do not match')
				this.exceptionService.sendBadRequestException(RESPONSE_MESSAGES.PASSWORD_NOT_MATCHED)
			}
			user.password = bcrypt.hashSync(args.password, ENV.JWT.SALT_ROUNDS)
			await this.userRepo.update({id: user.id}, {password: user.password})
			this.logger.log(`Password reset successful for user: ${user.id}`)

			return this.sharedService.sendResponse(RESPONSE_MESSAGES.UserPasswordReset, null)
		} catch (error) {
			this.sharedService.jwtExceptionDetector(error)
			this.sharedService.sendError(error, this.userResetPassword.name)
		}
	}

	/**
	 * Change user password (requires old password verification)
	 * @param args Change password data
	 * @param user Authenticated user
	 * @returns Success response
	 */
	async changePassword(args: ChangePasswordDTO, user: User) {
		try {
			this.logger.log(`Change password request for user: ${user.id}`)
			// Validate user registration type
			if (user.registrationType !== RegisterationTypeEnum.EMAIL && user.registrationType !== RegisterationTypeEnum.PHONE) {
				this.logger.warn(`Invalid registration type for password change: ${user.registrationType}`)
				this.exceptionService.sendForbiddenException(RESPONSE_MESSAGES.RegisteredNotWithThisMethod)
			}

			// Check if new password is same as old password
			if (args.oldPassword === args.password) {
				this.exceptionService.sendBadRequestException(RESPONSE_MESSAGES.OLD_AND_NEW_PASSWORD_SHOULD_NOT_SAME)
			}

			// Verify old password
			if (!bcrypt.compareSync(args.oldPassword, user.password)) {
				this.logger.warn('Old password verification failed')
				this.exceptionService.sendForbiddenException(RESPONSE_MESSAGES.INVALID_PASSWORD)
			}

			// Check if password and confirm password match
			if (args.password !== args.confirmPassword) {
				this.logger.warn('Password and confirm password do not match')
				this.exceptionService.sendBadRequestException(RESPONSE_MESSAGES.PASSWORD_NOT_MATCHED)
			}

			// Hash and update the new password
			user.password = bcrypt.hashSync(args.password, ENV.JWT.SALT_ROUNDS)
			await this.userRepo.update({id: user.id}, {password: user.password})
			this.logger.log(`Password changed successfully for user: ${user.id}`)

			return this.sharedService.sendResponse(RESPONSE_MESSAGES.UserPasswordUpdated, null)
		} catch (error) {
			this.sharedService.sendError(error, this.changePassword.name)
		}
	}

	/**
	 * Resend verification email or SMS
	 * @param args User identification data
	 * @returns Success response
	 */
	async resendEmailOrSms(args: RetryAccountVerificationDTO) {
		try {
			this.logger.log(`Resend verification request for: ${args.email || args.phoneNumber}`)
			const whereClause = args.email ? {email: args.email} : {phoneNumber: args.phoneNumber}
			const user = await this.getUserOrThrowException(whereClause) as User
			const msg = await this.sendAccountVerificationCode(args, user) as string
			return this.sharedService.sendResponse(msg, null)
		} catch (error) {
			this.sharedService.sendError(error, this.resendEmailOrSms.name)
		}
	}

	/**
	 * Verifies user account using email or phone number verification code
	 * Updates user verification status and activates the account upon successful verification
	 *
	 * @param args - Account verification data containing email/phone and verification code
	 * @returns Promise<ApiSuccessResponse<null>> - Success response with verification confirmation
	 * @throws ForbiddenException - When verification code is expired or invalid
	 * @throws NotAcceptableException - When email/phone is already verified
	 * @throws NotFoundException - When user is not found
	 */
	async accountVerification(args: AccountVerificationDTO) {
		try {
			// Log the start of account verification process
			this.logger.log('Processing account verification request', this.accountVerification.name)
			this.logger.debug(`Verification attempt for email: ${args.email}`, this.accountVerification.name)

			let user: User | null = null

			// Handle email verification flow
			if (args.email) {
				this.logger.log('Starting email verification process', this.accountVerification.name)

				// Verify the email verification code
				await this.verifyAccountCode(`verify${args.email}`, args.code)
				this.logger.debug('Email verification code validated successfully', this.accountVerification.name)

				// Retrieve user by email
				user = await this.getUserOrThrowException({email: args.email}) as User
				this.logger.debug(`User found for email verification: ${user.id}`, this.accountVerification.name)

				// Check if email is already verified
				if (user.userVerifications.email) {
					this.logger.warn(`Email verification attempted for already verified user: ${user.id}`, this.accountVerification.name)
					this.exceptionService.sendNotAcceptableException(RESPONSE_MESSAGES.EMAIL_ALREADY_VERIFIED)
				}

				// Mark email as verified
				user.userVerifications.email = true
				this.logger.log(`Email marked as verified for user: ${user.id}`, this.accountVerification.name)
			}
			// Handle phone number verification flow
			else if (args.phoneNumber) {
				this.logger.log('Starting phone number verification process', this.accountVerification.name)

				await this.verifyAccountCode(`verify${args.phoneNumber}`, args.code)
				this.logger.debug('Phone verification code validated successfully', this.accountVerification.name)

				// Retrieve user by phone number
				user = await this.getUserOrThrowException({phoneNumber: args.phoneNumber}) as User
				this.logger.debug(`User found for phone verification: ${user.id}`, this.accountVerification.name)

				// Check if phone number is already verified
				if (user.userVerifications.phoneNumber) {
					this.logger.warn(`Phone verification attempted for already verified user: ${user.id}`, this.accountVerification.name)
					this.exceptionService.sendNotAcceptableException(RESPONSE_MESSAGES.USER_PHONE_ALREADY_EXIST)
				}

				// Mark phone number as verified
				user.userVerifications.phoneNumber = true
				this.logger.log(`Phone number marked as verified for user: ${user.id}`, this.accountVerification.name)
			}
			// Handle case where neither email nor phone is provided
			else {
				this.logger.error('No email or phone number provided for verification', this.accountVerification.name)
				this.exceptionService.sendBadRequestException(RESPONSE_MESSAGES.EMAIL_ALREADY_VERIFIED)
			}

			if (user!.status === UserStatusEnum.BLOCKED) this.exceptionService.sendUnprocessableEntityException(RESPONSE_MESSAGES.USER_BLOCKED)

			// Update user status and verification flags in database
			user!.status = UserStatusEnum.ACTIVE
			// Perform database update
			await this.userRepo.update(
				{id: user!.id},
				{
					status: user!.status,
					userVerifications: user!.userVerifications,
				}
			)
			this.logger.log(`User verified successfully: ${user!.id}`, this.accountVerification.name)
			this.logger.debug(`User verification status updated: ${JSON.stringify(user?.userVerifications)}`, this.accountVerification.name)

			// Return success response with JWT token
			this.logger.log('Account verification completed successfully with JWT token', this.accountVerification.name)
			return await this.generateJwtAndSendResponse(user as User, true) // returning true as it's for verification
		} catch (error) {
			this.sharedService.sendError(error, this.accountVerification.name)
		}
	}

	/**
	 * Check if user already exists with given email or phone
	 * Only verified users should be treated as unique
	 * @param email User email
	 * @param phoneNumber User phone number
	 * @returns User entity if exists with compatible registration type
	 */
	private async checkUserExistance(email: string, phoneNumber: string, username: string) {
		try {
			this.logger.debug(`Checking user existence: ${email || 'N/A'}, ${phoneNumber || 'N/A'}`)

			const user = await this.userRepo.findOne({where: [{email}, {phoneNumber}, {username}]})

			if (user) {
				// For email/phone uniqueness, only enforce if the user is verified
				if (user.email === email && user.userVerifications?.email === true) {
					this.logger.warn(`Verified email already exists: ${email}`)
					this.exceptionService.sendConflictException(RESPONSE_MESSAGES.EMAIL_ALREADY_VERIFIED)
				}

				if (user.phoneNumber === phoneNumber && user.userVerifications?.phoneNumber === true) {
					this.logger.warn(`Verified phone number already exists: ${phoneNumber}`)
					this.exceptionService.sendConflictException(RESPONSE_MESSAGES.USER_PHONE_ALREADY_EXIST)
				}

				// Check username uniqueness (always enforced)
				if (user.username === username) {
					this.logger.warn(`Username already exists: ${username}`)
					this.exceptionService.sendConflictException(RESPONSE_MESSAGES.UsernameAlreadyExist)
				}

				// Check if user is blocked - blocked users cannot register again
				if (user.status === UserStatusEnum.BLOCKED) {
					this.logger.warn(`Blocked user attempted to register again: ${user.id}`)
					this.exceptionService.sendUnprocessableEntityException(RESPONSE_MESSAGES.USER_BLOCKED)
				}

				// If user exists but is not verified, allow reuse (return the user for update)
				this.logger.log(`Found unverified user, allowing reuse: ${user.id}`)
			}

			return user
		} catch (error) {
			this.sharedService.sendError(error, this.checkUserExistance.name)
		}
	}

	/**
	 * Retrieves a user based on the provided criteria.
	 * Throws an error if the user does not exist.
	 *
	 * @param whereClause - Conditions to find the user
	 * @returns The found User entity
	 * @throws NotFoundException if user is not found
	 */
	private async getUserOrThrowException(whereClause: FindOptionsWhere<User> | FindOptionsWhere<User>[]) {
		try {
			const user = await this.userRepo.findOne({where: whereClause})
			if (!user) {
				this.exceptionService.sendNotFoundException(RESPONSE_MESSAGES.USER_NOT_FOUND)
			}
			return user
		} catch (error) {
			this.sharedService.sendError(error, this.getUserOrThrowException.name)
		}
	}

	private async verifyAccountCode(key: string, verificationCode: string) {
		try {
			const verificationData = await this.accountVerificationCache.get(key)
			if (!verificationData) this.exceptionService.sendGoneException(RESPONSE_MESSAGES.CODE_EXPIRED)

			// Get the code from verification data object
			const code = verificationData.code

			if (verificationCode !== code) this.exceptionService.sendNotAcceptableException(RESPONSE_MESSAGES.INVALID_CODE)

			await this.accountVerificationCache.del(key)

			return code
		} catch (error) {
			this.sharedService.sendError(error, this.verifyAccountCode.name)
		}
	}

	/**
	 * Calculate remaining time for verification code cooldown
	 * @param verificationData The verification data containing expiredAt timestamp
	 * @returns Remaining time in milliseconds
	 */
	private calculateRemainingTime(verificationData: VerificationCacheData): number {
		const currentTime = Date.now()
		const remainingTime = verificationData.expiredAt - currentTime

		this.logger.debug(`Verification cooldown check:`, {
			currentTime,
			expiredAt: verificationData.expiredAt,
			remainingTime,
		})

		return Math.max(0, remainingTime) // Return 0 if cooldown has expired
	}

	/**
	 * Format remaining time into a user-friendly message
	 * @param remainingTimeMs Remaining time in milliseconds
	 * @returns Formatted message string
	 */
	private formatRemainingTimeMessage(remainingTimeMs: number): string {
		const remainingDate = new Date(remainingTimeMs)
		const minutes = remainingDate.getUTCMinutes()
		const seconds = remainingDate.getUTCSeconds()

		const parts: string[] = []

		if (minutes > 0) {
			parts.push(`${minutes} minutes`)
		}

		if (seconds > 0) {
			parts.push(`${seconds} seconds`)
		}

		return `Please wait ${parts.join(' and ')} to resend again`
	}

	// Update the sendAccountVerificationCode method
	/**
	 * Creates verification cache data with generated code and expiration timestamp
	 * @returns VerificationCacheData object with code and expiredAt
	 */
	private createVerificationCacheData(): VerificationCacheData {
		const code = randomString.generate({length: 6, charset: 'numeric'})
		return {
			code: '123456', // TODO: Use dynamic code when email/SMS service is configured
			// code, // Uncomment this when ready to use dynamic codes
			expiredAt: Date.now() + 300000, // 5 minutes from now
		}
	}

	/**
	 * Manages verification code generation, storage, and cooldown checking
	 * @param key - The cache key (e.g., 'verify{email}', 'resetPassword{phone}')
	 * @returns The generated verification code
	 * @throws UnprocessableEntityException if cooldown period is still active
	 */
	private async verifyAndSetCacheData(key: string) {
		try {
			// Check if verification code exists and enforce cooldown
			const existingVerification: VerificationCacheData | null = await this.accountVerificationCache.get(key)

			if (existingVerification) {
				const remainingTime = this.calculateRemainingTime(existingVerification)
				if (remainingTime > 0) {
					this.exceptionService.sendTooManyRequestsException(this.formatRemainingTimeMessage(remainingTime))
				}
			}

			// Create new verification data
			const verificationData = this.createVerificationCacheData()

			// Store in cache with 5 minutes TTL
			await this.accountVerificationCache.set(key, verificationData, 300000) // 5 * 60 * 1000 = 300000 seconds in MILLISECONDS (1000ms = 1s)

			this.logger.debug(`Verification code stored in cache with key: ${key}`)

			return verificationData.code
		} catch (error) {
			this.sharedService.sendError(error, this.verifyAndSetCacheData.name)
		}
	}

	async sendAccountVerificationCode(args: RetryAccountVerificationDTO, user: User) {
		try {
			let msg: string
			this.logger.debug(`Verification code generated for user : ${args.email}`)
			if (args.email) {
				if (user.userVerifications.email) {
					this.logger.warn(`User email already verified: ${user.id}`)
					this.exceptionService.sendNotAcceptableException(RESPONSE_MESSAGES.EMAIL_ALREADY_VERIFIED)
				}

				// Use consolidated cache management
				await this.verifyAndSetCacheData(`verify${args.email}`)

				// send an email to user for account verification
				// TODO: Will send email verification code dynamically after settting up sendgrid templates
				// const isVerificationSent = await Mailer.sendEmailVerificationCode(args.email, code, 5) // code expiry time is 5 minute
				// if (!isVerificationSent) {
				// 	this.exceptionService.sendInternalServerErrorException(RESPONSE_MESSAGES.VerificationCodeFailed)
				// }
				msg = RESPONSE_MESSAGES.EmailVerificationCodeSent
			} else {
				// Currently using a default verification code '123456' for all phone numbers.
				if (user.userVerifications.phoneNumber) {
					this.logger.warn(`User phone number already verified: ${user.id}`)
					this.exceptionService.sendNotAcceptableException(RESPONSE_MESSAGES.UserPhoneNumAlreadyVerified)
				}

				// Use consolidated cache management
				await this.verifyAndSetCacheData(`verify${args.phoneNumber}`)

				msg = RESPONSE_MESSAGES.PhoneVerificationCodeSent
			}
			return msg
		} catch (error) {
			this.sharedService.sendError(error, this.sendAccountVerificationCode.name)
		}
	}

	private async sendForgotPasswordCode(args: RetryAccountVerificationDTO) {
		try {
			let msg: string
			this.logger.debug(`Verification code generated for user : ${args.email}`)
			if (args.email) {
				// Use consolidated cache management
				await this.verifyAndSetCacheData(`resetPassword${args.email}`)

				// send an email to user for account verification
				// TODO: Will send email verification code dynamically after settting up sendgrid templates
				// const iscodeSent = await Mailer.sendForgotPasswordCode(args.email, code, 5) // code expiry time is 5 minute
				// if (!iscodeSent) {
				// 	this.exceptionService.sendInternalServerErrorException(RESPONSE_MESSAGES.EmailResendFailed)
				// }
				msg = RESPONSE_MESSAGES.EmailResetCodeSent
			} else {
				// Use consolidated cache management
				await this.verifyAndSetCacheData(`resetPassword${args.phoneNumber}`)
				msg = RESPONSE_MESSAGES.PhoneResetCodeSent
			}
			return msg
		} catch (error) {
			this.sharedService.sendError(error, this.sendForgotPasswordCode.name)
		}
	}

	/**
	 * Common function to generate JWT token, prepare tasker data, get wishlist and send response
	 * @param user - The authenticated user entity
	 * @param defaultMessage - Default success message to use
	 * @param taskerMessage - Message to use if user is a tasker (optional)
	 * @returns Complete login response with JWT token, user/tasker data, and wishlist
	 */
	private async generateJwtAndSendResponse(user: User, isForVerification: boolean = false) {
		try {
			// Generate JWT token for immediate app access
			const jwt = this.jwtService.sign(this.getLoginPayload(user))
			let msg = isForVerification ? RESPONSE_MESSAGES.EMAIL_VERIFIED : RESPONSE_MESSAGES.LOGGED_IN

			// Return complete response
			return this.sharedService.sendResponse(msg, {
				jwt,
				user,
			})
		} catch (error) {
			this.sharedService.sendError(error, this.generateJwtAndSendResponse.name)
		}
	}
}
