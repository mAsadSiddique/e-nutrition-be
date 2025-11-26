/**
 * Authentication Guard for NestJS applications
 *
 * This guard validates JWT tokens, verifies user existence and status,
 * and attaches the user object to the request for downstream handlers.
 */
import {CanActivate, ExecutionContext} from '@nestjs/common'
import {Injectable, Logger} from '@nestjs/common'
import {JwtService} from '@nestjs/jwt'
import {ExceptionService} from 'src/shared/exception.service'
import {SharedService} from 'src/shared/shared.service'
import {ENV} from 'src/config/constant'
import { UserAuthService } from './user_auth.service'
import { RESPONSE_MESSAGES } from 'src/utils/enums/response-messages.enum'

@Injectable()
export class UserAuthGuard implements CanActivate {
	private readonly logger = new Logger(UserAuthGuard.name)

	constructor(
		private jwtService: JwtService,
		private readonly exceptionService: ExceptionService,
		private readonly sharedService: SharedService,
		private readonly userAuthService: UserAuthService
	) {}

	/**
	 * Validates if the current request can be processed by checking JWT token
	 * and user status
	 *
	 * @param context - The execution context of the current request
	 * @returns Promise resolving to boolean indicating if the request is authorized
	 */
	async canActivate(context: ExecutionContext): Promise<boolean> {
		try {
			const req: any = context.switchToHttp().getRequest()
			// Checking if token exists
			if (!req.headers.authorization) {
				this.exceptionService.sendUnauthorizedException(RESPONSE_MESSAGES.JWT_REQUIRED)
			}

			// Verify JWT token and extract payload
			const payload = await this.jwtService.verifyAsync(req.headers.authorization, {secret: ENV.JWT.SECRET})
			if (!payload?.email) {
				this.logger.warn('JWT payload missing email')
				this.exceptionService.sendUnauthorizedException(RESPONSE_MESSAGES.JWT_REQUIRED)
			}

			// Validate user existence and status
			const user = await this.userAuthService.validateUser(payload.username)
			// Ensure JWT registrationType overrides DB value for request lifecycle
			user.registrationType = payload?.registrationType || user.registrationType

			// Attach user to request for downstream handlers
			req.user = user

			return true
		} catch (error) {
			this.sharedService.jwtExceptionDetector(error)
			this.sharedService.sendError(error, UserAuthGuard.name)
			return false
		}
	}
}
