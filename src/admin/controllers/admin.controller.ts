import { Body, Controller, Get, ParseIntPipe, Post, Put, Query, UseGuards, } from '@nestjs/common'
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotAcceptableResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger'
import { AdminService } from '../services/admin.service'
import { AdminAccountService } from '../services/admin-account.service'
import { RESPONSE_MESSAGES } from 'src/utils/enums/response-messages.enum'
import { Admin } from '../entities/admin.entity'
import { Role } from 'src/auth/decorators/roles.decorator'
import { Roles } from 'src/utils/enums/roles.enum'
import { GuardName } from 'src/auth/decorators/guards.decorator'
import { GuardsEnum } from 'src/utils/enums/guards.enum'
import { AdminAuthGuard } from 'src/auth/guard/admin_auth.guard'
import { AddAdminDTO } from '../dtos/add-admin.dto'
import { LoginDTO } from 'src/shared/dto/login.dto'
import { RoleGuard } from 'src/auth/guard/roles-auth.guard'
import { ForgotPasswordDTO } from 'src/shared/dto/forgot_password.dto'
import { ReSetPasswordDTO } from 'src/shared/dto/reset_password.dto'
import { ChangePasswordDTO } from 'src/shared/dto/change_password.dto'
import { user } from 'src/auth/decorators/user.decorator'
import { EditProfileDTO } from '../dtos/edit-profile.dto'
import { UpdateAdminDTO } from '../dtos/update-admin.dto'
import { AdminListingDTO } from '../dtos/admin-lits.dto'
import { ResendEmailDTO } from '../dtos/admin-resend-email.dto'

@ApiTags('admin')
@Controller('admin')
export class AdminController {
	constructor(private readonly adminService: AdminService, private readonly adminAccountService: AdminAccountService) { }

	@ApiCreatedResponse({
		description: RESPONSE_MESSAGES.ADMIN_REGISTERED,
		type: Admin,
	})
	@ApiNotAcceptableResponse({ description: RESPONSE_MESSAGES.ADMIN_ALREADY_EXIST })
	@Role(Roles.SUPER)
	@UseGuards(AdminAuthGuard, RoleGuard)
	@Post('/add')
	async addAdmin(@Body() args: AddAdminDTO) {
		return await this.adminAccountService.addAdmin(args)
		}
	
	@ApiCreatedResponse({
		description: RESPONSE_MESSAGES.LOGGED_IN,
		type: Admin,
	})
	@Post('/login')
	async login(@Body() args: LoginDTO) {
		return await this.adminAccountService.login(args)
	}

	@ApiCreatedResponse({
		description: RESPONSE_MESSAGES.FORGOT_PASSWORD_REQUEST,
		type: Admin,
	})
	@ApiNotFoundResponse({ description: RESPONSE_MESSAGES.ADDRESS_NOT_FOUND })
	@Post('/forgot/password')
	async forgotPassword(@Body() args: ForgotPasswordDTO) {
		return await this.adminAccountService.forgetPasswordRequest(args)
	}

	@ApiCreatedResponse({
		description: RESPONSE_MESSAGES.PASS_CHANGED_SUCCESSFULLY,
		type: Admin,
	})
	@ApiBadRequestResponse({ description: RESPONSE_MESSAGES.JWT_INVALID })
	@Put('/reset/password')
	async forgotPasswordUpdation(@Body() args: ReSetPasswordDTO) {
		return await this.adminAccountService.resetPassword(args)
	}

	@ApiCreatedResponse({
		description: RESPONSE_MESSAGES.PASS_CHANGED_SUCCESSFULLY,
		type: Admin,
	})
	@ApiNotAcceptableResponse({ description: RESPONSE_MESSAGES.PASSWORD_NOT_MATCHED })
	@Role(Roles.SUPER, Roles.SUB)
	@UseGuards(AdminAuthGuard, RoleGuard)
	@Put('/change/password')
	async changePassword(@Body() args: ChangePasswordDTO, @user() admin: Admin) {
		return await this.adminAccountService.changePassword(args, admin)
	}

	@ApiCreatedResponse({
		description: RESPONSE_MESSAGES.SUCCESS,
		type: Admin,
	})
	@Role(Roles.SUPER, Roles.SUB)
	@UseGuards(AdminAuthGuard, RoleGuard)
	@Get('/profile')
	async viewProfile(@user() admin: Admin) {
		return await this.adminService.getProfile(admin)
	}

	@ApiCreatedResponse({
		description: RESPONSE_MESSAGES.PROFILE_UPDATED,
		type: Admin,
	})
	@Role(Roles.SUPER, Roles.SUB)
	@UseGuards(AdminAuthGuard, RoleGuard)
	@Put('/profile')
	async editProfile(@Body() args: EditProfileDTO, @user() admin: Admin) {
		return await this.adminService.editProfile(args, admin)
	}

	@ApiCreatedResponse({
		description: RESPONSE_MESSAGES.PASSWORD_SET,
		type: Admin,
	})
	@ApiNotAcceptableResponse({ description: RESPONSE_MESSAGES.PASSWORD_ALREADY_SET })
	@Put('/set/password')
	async setPassword(@Body() args: ReSetPasswordDTO) {
		return await this.adminAccountService.setPassword(args)
	}

	@ApiCreatedResponse({
		description: 'admin block/unblock successfully',
		type: Admin,
	})
	@ApiNotFoundResponse({ description: RESPONSE_MESSAGES.ADMIN_NOT_FOUND })
	@Role(Roles.SUPER)
	@UseGuards(AdminAuthGuard, RoleGuard)
	@Put('/block/toggle')
	async blockAdmin(@Body('id', ParseIntPipe) id: number, @user() admin: Admin) {
		return await this.adminService.blockAdminToggle(id, admin)
	}

	@ApiCreatedResponse({
		description: RESPONSE_MESSAGES.UPDATED,
		type: Admin,
	})
	@ApiNotFoundResponse({ description: RESPONSE_MESSAGES.ADMIN_NOT_FOUND })
	@GuardName(GuardsEnum.ADMIN)
	@UseGuards(AdminAuthGuard, RoleGuard)
	@Put('/role')
	async updateAdmin(@Body() args: UpdateAdminDTO, @user() admin: Admin) {
		return await this.adminService.updateAdminRole(args, admin)
	}

	@ApiCreatedResponse({
		description: RESPONSE_MESSAGES.ADMIN_LISTING,
		type: Admin,
	})
	@Role(Roles.SUPER, Roles.SUB)
	@GuardName(GuardsEnum.ADMIN)
	@UseGuards(AdminAuthGuard, RoleGuard)
	@Get('/listing')
	async adminListing(@Query() args: AdminListingDTO) {
		return await this.adminService.adminsListing(args)
	}

	@ApiCreatedResponse({
		description: RESPONSE_MESSAGES.EMAIL_RESEND,
		type: Admin,
	})
	@ApiNotAcceptableResponse({ description: RESPONSE_MESSAGES.EMAIL_ALREADY_VERIFIED })
	@Post('/resend/email')
	async resendEmailForSetPassword(@Body() args: ResendEmailDTO) {
		return this.adminAccountService.resendEmail(args)
	}
}
