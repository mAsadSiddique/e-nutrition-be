import {Injectable, Logger} from '@nestjs/common'
import {SharedService} from 'src/shared/shared.service'
import {User} from 'src/user/entities/user.entity'
import {DataSource} from 'typeorm'
import {ExceptionService} from 'src/shared/exception.service'
import {UserStatusEnum} from 'src/user/enums/status.enum'
import { RESPONSE_MESSAGES } from 'src/utils/enums/response-messages.enum'

@Injectable()
export class UserAuthService {
	private readonly logger = new Logger(UserAuthService.name)

	constructor(
		private sharedService: SharedService,
		private dataSource: DataSource,
		private readonly exceptionService: ExceptionService
	) {}

	async getUserByUsername(email: string) {
		try {
			return await this.dataSource.getRepository(User).findOne({
				where: {email},
				select: {
					id: true,
					username: true,
					email: true,
					password: true,
					firstName: true,
					lastName: true,
					phoneNumber: true,
					gender: true,
					userType: true,
					registrationType: true,
					address: true,
					dob: true,
					profileImage: true,
					isNotificationEnabled: true,
					status: true,
					userVerifications: true,
					fcmTokens: true,
					createdAt: true,
					updatedAt: true,
				},
			})
		} catch (error) {
			this.sharedService.sendError(error, this.getUserByUsername.name)
		}
	}

	async getUserByEmail(email: string) {
		try {
			return await this.dataSource.getRepository(User).findOneBy({email})
		} catch (error) {
			this.sharedService.sendError(error, this.getUserByEmail.name)
		}
	}

	/**
	 * Validates user existence and status based on username
	 *
	 * @param username - Username extracted from JWT payload
	 * @returns Promise resolving to the validated user object
	 */
	async validateUser(username: string): Promise<any> {
		// Fetch user from database
		const user = await this.getUserByUsername(username)

		if (!user) {
			this.logger.warn(`User not found: ${username}`)
			this.exceptionService.sendUnauthorizedException(RESPONSE_MESSAGES.USER_NOT_FOUND)
		}

		// Check user status
		switch (user.status) {
			case UserStatusEnum.BLOCKED:
				this.logger.warn(`Blocked user attempted access: ${username}`)
				this.exceptionService.sendUnauthorizedException(RESPONSE_MESSAGES.USER_BLOCKED)
			case UserStatusEnum.VERIFICATION_PENDING:
				this.logger.warn(`Unverified user attempted access: ${username}`)
				this.exceptionService.sendUnauthorizedException(RESPONSE_MESSAGES.UserVerificationPending)
		}

		return user
	}
}
