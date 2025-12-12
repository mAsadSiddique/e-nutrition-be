import {Body, Controller, Get, Logger, Post, Put, Req, Res, UploadedFiles, UseGuards} from '@nestjs/common'
import {UserService} from '../services/user.service'
import {ApiBody, ApiOperation} from '@nestjs/swagger'
import {MockOkResponses} from 'src/utils/mock_swagger_responses/mock_ok.responses'
import {MockErrorResponses} from 'src/utils/mock_swagger_responses/mock_error.responses'
import {SignupDTO} from '../dtos/signup.dto'
import {UserAccountService} from '../services/user-account.service'
import {SetPasswordDTO} from '../dtos/set_password.dto'
import {User} from '../entities/user.entity'
import {user} from 'src/auth/decorators/user.decorator'
import {AccountVerificationDTO} from '../dtos/account_verification.dto'
import {MockUserResponses} from '../mock_swagger_responses/user.responses'
import {ResetPasswordDTO} from '../dtos/reset_password.dto'
import {EditUserProfileDTO} from '../dtos/edit_user_profile.dto'
import {RetryAccountVerificationDTO} from '../dtos/retry_account_verification.dto'
import {GoogleAuthGuard} from '../social_login-strategies/google.strategy'
import {UserSocialLoginType} from 'src/utils/types/user_social_login.type'
import type {Request, Response} from 'express'
import {CheckUserAvailabilityDTO} from '../dtos/validate_user_existance.dto'
import {ENV} from 'src/config/constant'
import { RESPONSE_MESSAGES } from 'src/utils/enums/response-messages.enum'
import { UserAuthGuard } from 'src/auth/guard/user_auth.guard'
import { LoginDTO } from 'src/shared/dto/login.dto'
import { ForgotPasswordDTO } from 'src/shared/dto/forgot_password.dto'
import { ChangePasswordDTO } from 'src/shared/dto/change_password.dto'

@Controller('user')
export class UserController {
	private logger: Logger = new Logger(UserController.name)

	constructor(
		private readonly userService: UserService,
		private readonly userAccountService: UserAccountService
	) {}

	@ApiOperation({
		summary: 'User Registration',
		description: "This endpoint allows users to register for the application using their necessary details. Upon successful registration, users will be provided access to the application's features.",
	})
	@ApiBody({type: SignupDTO})
	@MockOkResponses.sendEmptyResponse(`${RESPONSE_MESSAGES.EMAIL_VERIFICATION_CODE_SENT}`)
	@MockErrorResponses.sendBbadRequestResponse()
	@MockErrorResponses.sendInternalServerErrorResponse()
	@Post('/signup')
	async signup(@Body() args: SignupDTO){
		this.logger.log(`Request received to register a user with ${args.email ? `email ${args.email}` : `phone number ${args.phoneNumber}`}`, this.signup.name)
		return await this.userAccountService.signup(args)
	}

	@ApiOperation({
		summary: 'Account Verification',
		description: 'This endpoint allows users to verify their account and returns JWT token for immediate app access',
	})
	@ApiBody({type: AccountVerificationDTO})
	@MockOkResponses.sendOkResponse(MockUserResponses.login)
	@MockErrorResponses.sendBbadRequestResponse()
	@MockErrorResponses.sendInternalServerErrorResponse()
	@Put('/account/verification')
	async accountVerification(@Body() args: AccountVerificationDTO) {
		return await this.userAccountService.accountVerification(args)
	}

	@ApiOperation({
		summary: 'Set Password',
		description: 'This endpoint allows users to set a new password as part of the account verification. Typically used after receiving verification email.',
	})
	@ApiBody({type: SetPasswordDTO})
	@MockErrorResponses.sendBbadRequestResponse()
	@MockErrorResponses.sendForbiddenResponse()
	@MockErrorResponses.sendInternalServerErrorResponse()
	@UseGuards(UserAuthGuard)
	@Put('/set/password')
	async setPassword(@Body() args: SetPasswordDTO, @user() user: User){
		return await this.userAccountService.setPassword(args, user)
	}

	@ApiOperation({
		summary: 'User Login',
		description: 'Authenticates a user using valid credentials (such as email and password) and returns an access token and user info upon successful login.',
	})
	@ApiBody({type: LoginDTO})
	@MockOkResponses.sendOkResponse(MockUserResponses.login)
	@MockErrorResponses.sendBbadRequestResponse()
	@MockErrorResponses.sendForbiddenResponse()
	@MockErrorResponses.sendInternalServerErrorResponse()
	@Post('/login')
	async login(@Body() args: LoginDTO) {
		return await this.userAccountService.login(args)
	}

	@ApiOperation({
		summary: 'Forgot Password',
		description: "Initiates the password reset process by sending a reset link or code to the user's registered email or phone number.",
	})
	@ApiBody({type: ForgotPasswordDTO})
	@MockErrorResponses.sendBbadRequestResponse()
	@MockErrorResponses.sendInternalServerErrorResponse()
	@Post('/forgot/password')
	async forgotPassword(@Body() args: ForgotPasswordDTO) {
		return await this.userAccountService.forgotPassword(args)
	}

	@ApiOperation({
		summary: 'Reset Password',
		description: 'Allows users to reset their password using a valid password reset token, typically received via email/phoneNumber.',
	})
	@ApiBody({type: ResetPasswordDTO})
	@MockErrorResponses.sendBbadRequestResponse()
	@MockErrorResponses.sendInternalServerErrorResponse()
	@Put('/reset/password')
	async forgotPasswordUpdation(@Body() args: ResetPasswordDTO) {
		return await this.userAccountService.userResetPassword(args)
	}

	@ApiOperation({
		summary: 'Change Password',
		description: 'Allows the authenticated user to change their current password by providing the old password and a new password.',
	})
	@ApiBody({type: ChangePasswordDTO})
	@MockErrorResponses.sendBbadRequestResponse()
	@MockErrorResponses.sendForbiddenResponse()
	@MockErrorResponses.sendInternalServerErrorResponse()
	@UseGuards(UserAuthGuard)
	@Put('/change/password')
	async changePassword(@Body() args: ChangePasswordDTO, @user() user: User) {
		return await this.userAccountService.changePassword(args, user)
	}

	@ApiOperation({
		summary: 'Get Profile',
		description: "Retrieves the authenticated user's profile information, including personal details and account metadata.",
	})
	@MockErrorResponses.sendBbadRequestResponse()
	@MockErrorResponses.sendInternalServerErrorResponse()
	@UseGuards(UserAuthGuard)
	@Get('/profile')
	async viewProfile(@user() user: User) {
		return await this.userService.getUserProfile(user)
	}

	@ApiOperation({
		summary: 'Edit Profile',
		description: 'Allows the authenticated user to update their profile information, such as name, bio, profile image, and other editable account details.',
	})
	@ApiBody({type: EditUserProfileDTO})
	@MockErrorResponses.sendBbadRequestResponse()
	@MockErrorResponses.sendInternalServerErrorResponse()
	@UseGuards(UserAuthGuard)
	@Put('/profile')
	async editProfile(@Body() args: EditUserProfileDTO, @user() user: User) {
		return await this.userService.editProfile(args, user)
	}

	@ApiOperation({
		summary: 'Resend Account Verification',
		description: 'This endpoint allows users to request a resend of the account verification email or SMS message to complete their account verification.',
	})
	@ApiBody({type: RetryAccountVerificationDTO})
	@MockErrorResponses.sendBbadRequestResponse()
	@MockErrorResponses.sendInternalServerErrorResponse()
	@Post('/resend/account/verification')
	async resendEmailOrSms(@Body() args: RetryAccountVerificationDTO) {
		return await this.userAccountService.resendEmailOrSms(args)
	}

	@Get('/google')
	@UseGuards(GoogleAuthGuard)
	async googleAuth() {}

	@Get('/google/redirect')
	@UseGuards(GoogleAuthGuard)
	async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
		// Handle cancel/denied consent gracefully: send user back to FE without extra params
		if (req?.query?.error) {
			const cancelUrl = ENV.GOOGLE_LOGIN.CANCEL_REDIRECT_URL
			return res.redirect(cancelUrl)
		}
		const url = await this.userAccountService.googleLogin(req?.['user'] as UserSocialLoginType) as string
		return res.redirect(url)
	}

	@ApiOperation({
		summary: 'Validate User Existance',
		description: 'Checks if a user already exists in the system using email or phone number. Returns appropriate response if user is found, not found, or pending verification.',
	})
	@ApiBody({type: RetryAccountVerificationDTO})
	@MockErrorResponses.sendBbadRequestResponse()
	@MockErrorResponses.sendInternalServerErrorResponse()
	@Post('/availability')
	async checkUserAvailability(@Body() args: CheckUserAvailabilityDTO) {
		return await this.userService.checkUserAvailability(args)
	}
}
