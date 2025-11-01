import { Injectable, Logger } from '@nestjs/common'
import { SharedService } from 'src/shared/shared.service'
import { DataSource } from 'typeorm'
import { ExceptionService } from 'src/shared/exception.service'
import { Admin } from 'src/admin/entities/admin.entity'
import { RESPONSE_MESSAGES } from 'src/utils/enums/response-messages.enum'

@Injectable()
export class AdminAuthService {
    private readonly logger = new Logger(AdminAuthService.name)

    constructor(
        private sharedService: SharedService,
        private dataSource: DataSource,
        private readonly exceptionService: ExceptionService
    ) {}

    /**
     * Get admin by email with selected fields
     */
    async getAdminByEmail(email: string) {
        try {
            return await this.dataSource.getRepository(Admin).findOne({
                where: { email },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    isEmailVerified: true,
                    isBlocked: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                }
            })
        } catch (error) {
            this.sharedService.sendError(error, this.getAdminByEmail.name)
        }
    }

    /**
     * Validates admin existence and status based on email
     *
     * @param email - Email extracted from JWT payload
     * @returns Promise resolving to the validated admin object
     */
    async validateAdmin(email: string): Promise<Admin> {
        // Fetch admin from database
        const admin = await this.getAdminByEmail(email)

        if (!admin) {
            this.logger.warn(`Admin not found: ${email}`)
            this.exceptionService.sendUnauthorizedException(RESPONSE_MESSAGES.ADMIN_NOT_FOUND)
        }

        // Check admin status
        if (admin.isBlocked) {
            this.logger.warn(`Blocked admin attempted access: ${email}`)
            this.exceptionService.sendUnauthorizedException(RESPONSE_MESSAGES.ADMIN_BLOCKED)
        }

        if (!admin.isEmailVerified) {
            this.logger.warn(`Unverified admin attempted access: ${email}`)
            this.exceptionService.sendUnauthorizedException(RESPONSE_MESSAGES.USER_EMAIL_UNVERIFIED)
        }

        return admin
    }
}