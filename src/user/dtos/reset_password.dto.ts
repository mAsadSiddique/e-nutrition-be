import {SignupDTO} from './signup.dto'
import {IntersectionType, PickType} from '@nestjs/swagger'
import {AccountVerificationDTO} from './account_verification.dto'

export class ResetPasswordDTO extends IntersectionType(SignupDTO, PickType(AccountVerificationDTO, ['code'])) {}
