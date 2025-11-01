import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ExceptionService } from '../../shared/exception.service'
import { Roles } from '../../utils/enums/roles.enum'
import { RESPONSE_MESSAGES } from 'src/utils/enums/response-messages.enum'

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly exceptionService: ExceptionService
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Roles[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ])

        if (!requiredRoles) {
            return true
        }

        const { user } = context.switchToHttp().getRequest()
        
        if (!user || !user.payload) {
            this.exceptionService.sendUnauthorizedException(RESPONSE_MESSAGES.JWT_INVALID)
        }

        const userRole = user.payload.role
        const hasRole = requiredRoles.some((role) => userRole === role)

        if (!hasRole) {
            this.exceptionService.sendForbiddenException(RESPONSE_MESSAGES.ROLE_UNAUTHORIZE)
        }

        return true
    }
}