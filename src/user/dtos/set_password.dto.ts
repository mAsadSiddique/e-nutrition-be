import {SignupDTO} from './signup.dto'
import {OmitType} from '@nestjs/swagger'

export class SetPasswordDTO extends OmitType(SignupDTO, ['email', 'phoneNumber']) {}
