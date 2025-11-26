import {SignupDTO} from './signup.dto'
import {OmitType} from '@nestjs/swagger'

export class RetryAccountVerificationDTO extends OmitType(SignupDTO, ['password', 'confirmPassword', 'username']) {}
