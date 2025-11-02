import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ExceptionService } from 'src/shared/exception.service'
import { SharedService } from 'src/shared/shared.service'
import { RESPONSE_MESSAGES } from 'src/utils/enums/response-messages.enum'
import {  FindOptionsWhere, ILike, Repository } from 'typeorm'
import { EditProfileDTO } from '../dtos/edit-profile.dto'
import { Admin } from '../entities/admin.entity'
import { UpdateAdminDTO } from '../dtos/update-admin.dto'
import { GuardsEnum } from 'src/utils/enums/guards.enum'
import { AdminListingDTO } from '../dtos/admin-lits.dto'

@Injectable()
export class AdminService {
	constructor(
		@InjectRepository(Admin)
		private readonly adminRepo: Repository<Admin>,
		private readonly exceptionService: ExceptionService,
		private readonly sharedService: SharedService,
	) { }

	async getProfile(admin: Admin) {
		try {
			const data = await this.profileData(admin)
			return this.sharedService.sendResponse(RESPONSE_MESSAGES.SUCCESS, data)
		} catch (error) {
			this.sharedService.sendError(error, this.getProfile.name)
		}
	}

	async editProfile(
		editProfDto: EditProfileDTO,
		admin: Admin
	) {
		try {
			Object.assign(admin, editProfDto)
			await this.adminRepo.save(admin)
			const data = await this.getProfile(admin)
			return this.sharedService.sendResponse(RESPONSE_MESSAGES.PROFILE_UPDATED, data)
		} catch (error) {
			this.sharedService.sendError(error, this.editProfile.name)
		}
	}

	async blockAdminToggle(id: number, admin: Admin) {
		try {
			if (id === admin.id) {
				this.exceptionService.sendUnprocessableEntityException(RESPONSE_MESSAGES.SELF_BLOCKING_NOT_ALLOWED)
			}
			const adminInDB = await this.adminRepo.findOne({
				where: { id },
			})
			if (!adminInDB) {
				this.exceptionService.sendNotFoundException(RESPONSE_MESSAGES.ADMIN_NOT_FOUND)
			}
			await this.adminRepo.update(id, { isBlocked: !adminInDB.isBlocked })
			const msg = adminInDB.isBlocked ? RESPONSE_MESSAGES.ADMIN_UNBLOCKED : RESPONSE_MESSAGES.ADMIN_BLOCKED
			return this.sharedService.sendResponse(msg)
		} catch (error) {
			this.sharedService.sendError(error, this.blockAdminToggle.name)
		}
	}

	async updateAdminRole(args: UpdateAdminDTO, admin: Admin) {
		try {
			if (args.id === admin.id) {
				this.exceptionService.sendUnprocessableEntityException(RESPONSE_MESSAGES.SELF_UPDATION_NOT_ALLOWED)
			}
			const adminMember = await this.adminRepo.findOne({
				where: { id: args.id }
			})
			if (!adminMember) {
				this.exceptionService.sendNotFoundException(RESPONSE_MESSAGES.ADMIN_NOT_FOUND)
			}
			adminMember.role = args.role
			await this.adminRepo.save(adminMember)
			return this.sharedService.sendResponse(RESPONSE_MESSAGES.ADMIN_ROLE_UPDATED, {admin: adminMember})
		} catch (error) {
			this.sharedService.sendError(error, this.updateAdminRole.name)
		}
	}

	async getAdminByEmail(email: string) {
		try {
			return await this.adminRepo.findOneBy({ email })
		} catch (error) {
			this.sharedService.sendError(error, this.getAdminByEmail.name)
		}
	}

	getPayload(admin: any) {
		return {
			email: admin.email,
			firstName: admin.firstName,
			role: admin.role,
			type: GuardsEnum.ADMIN,
		}
	}

	async profileData(admin: Admin) {
		try {
			return {
				firstName: admin.firstName,
				lastName: admin.lastName,
				email: admin.email,
				role: admin.role,
				imageUrl: admin?.imageUrl ? await this.sharedService.getFileFromS3Bucket(admin.imageUrl) : null,
			}
		} catch (error) {
			throw error
		}
	}

	async adminsListing(args: AdminListingDTO) {
		try {
			let whereClause: FindOptionsWhere<Admin> | FindOptionsWhere<Admin>[] = {}
			if (args.hasOwnProperty('isBlocked') && args.isBlocked !== undefined) {
				whereClause['isBlocked'] = args.isBlocked
			}
			if (args.hasOwnProperty('isEmailVerified') && args.isEmailVerified !== undefined) {
				whereClause['isEmailVerified'] = args.isEmailVerified
			}
			if (args.id) {
				whereClause['id'] = args.id
			}
			if (args.role) {
				whereClause['role'] = args.role
			}
			if (args.search) {
				whereClause = [
					{ ...whereClause, firstName: ILike(`%${args.search}%`) },
					{ ...whereClause, lastName: ILike(`%${args.search}%`) },
					{ ...whereClause, email: ILike(`%${args.search}%`) }
				]
			}
			const [admins, count] = await this.adminRepo.findAndCount({
				where: whereClause,
				skip: args.pageNumber * args.pageSize,
				take: args.pageSize,
				order: { 'id': 'DESC' }
			})
			return this.sharedService.sendResponse(RESPONSE_MESSAGES.ADMIN_LISTING, { count, admins })
		} catch (error) {
			this.sharedService.sendError(error, this.adminsListing.name)
		}
	}
}
