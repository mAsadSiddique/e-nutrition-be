import { Inject, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ResendEmailDTO } from '../dtos/admin-resend-email.dto'
import { ENV } from 'src/config/constant'
import {  CACHE_MANAGER } from '@nestjs/cache-manager'
import * as randomString from 'randomstring'
import { RESPONSE_MESSAGES } from 'src/utils/enums/response-messages.enum'
import { FindOptionsWhere, Repository } from 'typeorm'
import { ExceptionService } from 'src/shared/exception.service'
import { SharedService } from 'src/shared/shared.service'
import { AdminService } from './admin.service'
import { Mailer } from 'src/utils/mailer/mailer'
import { RetryAccountVerificationDTO } from '../dtos/retry_account_verification.dto'
import { Admin } from '../entities/admin.entity'
import { LoginDTO } from 'src/shared/dto/login.dto'
import { ForgotPasswordDTO } from 'src/shared/dto/forgot_password.dto'
import { ReSetPasswordDTO } from 'src/shared/dto/reset_password.dto'
import { ChangePasswordDTO } from 'src/shared/dto/change_password.dto'
import { AddAdminDTO } from '../dtos/add-admin.dto'
import { SetPasswordDTO } from '../dtos/set_password.dto'

@Injectable()
export class AdminAccountService {
	private logger = new Logger(AdminAccountService.name)
	constructor(
		@Inject(CACHE_MANAGER) private accountVerificationCache: any,
		@InjectRepository(Admin)
		private readonly adminRepo: Repository<Admin>,
		private readonly exceptionService: ExceptionService,
		private readonly sharedService: SharedService,
		private readonly adminService: AdminService
	) { }

	async resendEmail(args: ResendEmailDTO) {
		try {
			const admin = await this.adminService.getAdminByEmail(args.email)
			if (!admin) this.exceptionService.sendNotFoundException(RESPONSE_MESSAGES.ADMIN_NOT_FOUND)

			// if (!this.sharedService.isValidPassword(ENV.DEFAULT_USER.PASSWORD, admin.password) || admin.isEmailVerified) {
			// 	this.exceptionService.sendNotAcceptableException(RESPONSE_MESSAGES.PASSWORD_ALREADY_SET)
			// }
			// const msg = await this.sendSetPasswordCode(args, admin) as string
			const password = this.generateSecurePassword()
			admin.password = this.sharedService.hashedPassword(password) as string
			await this.adminRepo.update(admin.id, { password: admin.password })
			const isEmailSent = await Mailer.sendAdminCredentials(args.email, `${admin.firstName || ''} ${admin.lastName || ''}`, password)
			if (!isEmailSent) {
				this.exceptionService.sendInternalServerErrorException(RESPONSE_MESSAGES.EMAIL_RESEND_FAILED)
			}
			return this.sharedService.sendResponse(RESPONSE_MESSAGES.EMAIL_RESEND)
		} catch (error) {
			this.sharedService.sendError(error, this.resendEmail.name)
		}
	}

	async login(args: LoginDTO) {
		try {
			const admin = await this.getUserOrThrowException({email:args.email}) as Admin
			if (admin.isBlocked) {
				this.exceptionService.sendForbiddenException(RESPONSE_MESSAGES.USER_BLOCKED)
			}
			if (!admin.isEmailVerified) {
				this.exceptionService.sendUnprocessableEntityException(RESPONSE_MESSAGES.USER_EMAIL_UNVERIFIED)
			}
			this.sharedService.bcryptCompareVerificatoin(args.password, admin.password)
			admin.password = undefined as any
			let user: any = this.adminService.getPayload(admin)
			let msg: RESPONSE_MESSAGES
			const data = {}
			user = await this.adminService.profileData(admin)
			msg = RESPONSE_MESSAGES.LOGGED_IN
			data['user'] = user
			const payload = this.adminService.getPayload(admin)
			const jwtToken = this.sharedService.getJwt(payload)
			data['jwtToken'] = jwtToken
			return this.sharedService.sendResponse(msg, data)

		} catch (error) {
			this.sharedService.sendError(error, this.login.name)
		}
	}

	async setPassword(args: SetPasswordDTO ) {
		try {
			const admin = await this.getUserOrThrowException({email: args.email}) as Admin
			if ( !this.sharedService.isValidPassword(ENV.DEFAULT_USER.PASSWORD, admin.password)) {
				this.exceptionService.sendNotFoundException(RESPONSE_MESSAGES.PASSWORD_ALREADY_SET)
			}
			this.sharedService.passwordsVerificatoin(args.password, args.confirmPassword)
			await this.verifyAccountCode(`setPassword${args.email}`, args.code)
			admin.password = this.sharedService.hashedPassword(args.password) as string
			admin.isEmailVerified = true
			await this.adminRepo.update(admin.id, { password: admin.password, isEmailVerified: admin.isEmailVerified })
			return this.sharedService.sendResponse(RESPONSE_MESSAGES.PASSWORD_SET)

		} catch (error) {
			this.sharedService.sendError(error, this.setPassword.name)
		}
	}

	async forgetPasswordRequest(args: ForgotPasswordDTO){
		try {
			const admin = await this.getUserOrThrowException(args) as Admin
			if (!admin.isEmailVerified) {
				this.exceptionService.sendForbiddenException(RESPONSE_MESSAGES.USER_EMAIL_UNVERIFIED)
			}
			const msg = await this.sendForgotPasswordCode(args) as string
			return this.sharedService.sendResponse(msg)

		} catch (error) {
			this.sharedService.sendError(error, this.forgetPasswordRequest.name)
		}
	}

	/**
	 * Reset admin password using token or code
	 * @param args Reset password data with token
	 * @returns Success response
	 */
	async resetPassword(args: ReSetPasswordDTO){
		try {
			this.logger.log('Processing password reset request')
			let admin: Admin | null = null

			// Handle email flow
			if (args.email) {
				// Verify the email verification code
				await this.verifyAccountCode(`resetPassword${args.email}`, args.code)
				this.logger.debug('Email verification code to reset password validated successfully', this.resetPassword.name)

				// Retrieve admin by email
				admin = await this.getUserOrThrowException({email: args.email}) as Admin
				this.logger.debug(`User found with email to reset password: ${admin.id}`, this.resetPassword.name)
			}
			// Handle case where neither email nor phone is provided
			else {
				this.logger.error('No email or phone number provided for reset password', this.resetPassword.name)
				this.exceptionService.sendBadRequestException(RESPONSE_MESSAGES.EMAIL_OR_PHONE_NUMBER_REQUIRED)
			}

			if (args.password !== args.confirmPassword) {
				this.logger.warn('Password and confirm password do not match')
				this.exceptionService.sendBadRequestException(RESPONSE_MESSAGES.PASSWORD_NOT_MATCHED)
			}
			admin.password = this.sharedService.hashedPassword(args.password) as string

			await this.adminRepo.update({id: admin.id}, {password: admin.password})
			this.logger.log(`Password reset successful for admin: ${admin.id}`)

			return this.sharedService.sendResponse(RESPONSE_MESSAGES.PASS_CHANGED_SUCCESSFULLY)
		} catch (error) {
			this.sharedService.jwtExceptionDetector(error)
			this.sharedService.sendError(error, this.resetPassword.name)
		}
	}

	async changePassword(args: ChangePasswordDTO, user: Admin) {
		try {
			const admin = await this.getUserOrThrowException({email: user.email}) as Admin
			this.logger.log(`Change password request for user: ${admin.id}`)
			// Validate admin registration type
			
			// Check if new password is same as old password
			if (args.oldPassword === args.password) {
				this.exceptionService.sendBadRequestException(RESPONSE_MESSAGES.OLD_AND_NEW_PASSWORD_SHOULD_NOT_SAME)
			}

			if (!this.sharedService.isValidPassword(args.oldPassword, admin.password)) {
				this.logger.warn('Old password verification failed')
				this.exceptionService.sendForbiddenException(RESPONSE_MESSAGES.INVALID_OLD_PASSWORD)
			}

			if (args.password !== args.confirmPassword) {
				this.logger.warn('Password and confirm password do not match')
				this.exceptionService.sendBadRequestException(RESPONSE_MESSAGES.PASSWORD_NOT_MATCHED)
			}

			admin.password = this.sharedService.hashedPassword(args.password) as string
			await this.adminRepo.update({id: admin.id}, {password: admin.password})
			this.logger.log(`Password changed successfully for admin: ${admin.id}`)

			return this.sharedService.sendResponse(RESPONSE_MESSAGES.PASS_CHANGED_SUCCESSFULLY)
		} catch (error) {
			this.sharedService.sendError(error, this.changePassword.name)
		}
	}

	async addAdmin(args: AddAdminDTO) {
		try {
			const adminInDb = await this.adminService.getAdminByEmail(args.email)
			if (adminInDb) {
				this.exceptionService.sendForbiddenException(RESPONSE_MESSAGES.ADMIN_ALREADY_EXIST)
			}
			const admin: Admin = new Admin(args)
			const randomPassword = this.generateSecurePassword()
			admin.password = this.sharedService.hashedPassword(randomPassword) as string
			admin.isEmailVerified = true
			
			// Send welcome email
            const isEmailSent = await Mailer.sendAdminCredentials(args.email, `${args.firstName || ''} ${args.lastName || ''}`, randomPassword)
            if (!isEmailSent) {
                this.exceptionService.sendInternalServerErrorException('Failed to send admin credentials email')
			}
			await this.adminRepo.insert(admin)
			
			return this.sharedService.sendResponse(RESPONSE_MESSAGES.ADMIN_REGISTERED)
		} catch (error) {
			this.sharedService.sendError(error, this.addAdmin.name)
		}
	}


	private async getUserOrThrowException(whereClause: FindOptionsWhere<Admin> | FindOptionsWhere<Admin>[]){
		try {
			const admin = await this.adminRepo.findOne({where: whereClause})
			if (!admin) {
				this.exceptionService.sendNotFoundException(RESPONSE_MESSAGES.ADMIN_NOT_FOUND)
			}
			return admin
		} catch (error) {
			this.sharedService.sendError(error, this.getUserOrThrowException.name)
		}
		}
	
	private async verifyAccountCode(key: string, verificationCode: string) {
		try {
			const code = await this.accountVerificationCache.get(key)
			if (!code) this.exceptionService.sendForbiddenException(RESPONSE_MESSAGES.CODE_EXPIRED)

			if (verificationCode !== code) this.exceptionService.sendNotAcceptableException(RESPONSE_MESSAGES.INVALID_CODE)

			await this.accountVerificationCache.del(key)

			return code
		} catch (error) {
			this.sharedService.sendError(error, this.verifyAccountCode.name)
		}
	}

	private async sendForgotPasswordCode(args: RetryAccountVerificationDTO) {
		try {
			let msg: string
			// generate verification code
			const code = randomString.generate({length: 6, charset: 'numeric'})
			this.logger.debug(`Verification code generated for user : ${args.email}`)
			if (args.email) {
				if (await this.accountVerificationCache.get(`resetPassword${args.email}`)) {
					this.exceptionService.sendForbiddenException(RESPONSE_MESSAGES.WAIT_TO_RESEND_AGAIN)
				}
				// send an email to user for account verification
				// TODO: Will send email verification code dynamically after settting up sendgrid templates
				const iscodeSent = await Mailer.sendForgotPasswordCode(args.email, 'Admin', code) // code expiry time is 5 minute
				if (!iscodeSent) {
					this.exceptionService.sendInternalServerErrorException(RESPONSE_MESSAGES.EMAIL_RESEND_FAILED)
				}
				await this.accountVerificationCache.set(`resetPassword${args.email}`, code, 300000) // 5 * 60 * 1000 = 300000 seconds in MILLISECONDS (1000ms = 1s)
				msg = RESPONSE_MESSAGES.EMAIL_RESEND_CODE
			} else {
				// Currently using a default verification code for all phone numbers.
				// Will implement random code generation and validation in the future.
				msg = RESPONSE_MESSAGES.PHONE_NUMBER_NOT_SUPPORTED
			}
			return msg
		} catch (error) {
			this.sharedService.sendError(error, this.sendForgotPasswordCode.name)
		}
	}

	async sendSetPasswordCode(args: RetryAccountVerificationDTO, admin: Admin) {
        try {
            let msg: string = RESPONSE_MESSAGES.EMAIL_VERIFICATION_CODE_SENT
            // generate verification code
            const code = randomString.generate({ length: 6, charset: 'numeric' })
            this.logger.debug(`Set Password code generated for admin : ${args.email}`)
            if (args.email) {
                if (admin.isEmailVerified) {
                    this.logger.warn(`Admin email already verified: ${admin.id}`)
                    this.exceptionService.sendNotAcceptableException(RESPONSE_MESSAGES.ADMIN_EMAIL_ALREADY_VERIFIED)
                }
                if (await this.accountVerificationCache.get(`setPassword${args.email}`)) {
                    this.exceptionService.sendForbiddenException(RESPONSE_MESSAGES.WAIT_TO_RESEND_AGAIN)
                }
                // send an email to admin for account verification
                // TODO: Will send email verification code dynamically after settting up sendgrid templates
                // const isVerificationSent = await Mailer.sendEmailVerificationCode(args.email, code, 5) // code expiry time is 5 minute
                // if (!isVerificationSent) {
                // 	this.exceptionService.sendInternalServerErrorException(ResponseMessagesEnum.VerificationCodeFailed)
                // }
                await this.accountVerificationCache.set(`setPassword${args.email}`, '123456', 300000) // 5 * 60 * 1000 = 300000 seconds in MILLISECONDS (1000ms = 1s)
				msg = RESPONSE_MESSAGES.EMAIL_VERIFICATION_CODE_SENT
            } else {
				// TODO: if we support phone number in future
				msg = RESPONSE_MESSAGES.PHONE_NUMBER_NOT_SUPPORTED
            }
            return msg
        } catch (error) {
            this.sharedService.sendError(error, this.sendSetPasswordCode.name)
        }
	}
	
	private generateSecurePassword(): string {
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        const lowercase = 'abcdefghijklmnopqrstuvwxyz'
        const numbers = '0123456789'
        const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'

        // Ensure at least one character from each required category
        let password = ''
        password += uppercase[Math.floor(Math.random() * uppercase.length)] // At least 1 uppercase
        password += lowercase[Math.floor(Math.random() * lowercase.length)] // At least 1 lowercase
        password += numbers[Math.floor(Math.random() * numbers.length)] // At least 1 number
        password += specialChars[Math.floor(Math.random() * specialChars.length)] // At least 1 special char

        // Fill the rest with random characters from all categories
        const allChars = uppercase + lowercase + numbers + specialChars
        for (let i = 4; i < 12; i++) { // Total length 12 characters
            password += allChars[Math.floor(Math.random() * allChars.length)]
        }

        // Shuffle the password to make it more random
        return password.split('').sort(() => Math.random() - 0.5).join('')
    }

}
