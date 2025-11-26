import {PickType} from '@nestjs/swagger'
import {SignupDTO} from './signup.dto'

export class ForgotPasswordDTO extends PickType(SignupDTO, ['email', 'phoneNumber']) {}
