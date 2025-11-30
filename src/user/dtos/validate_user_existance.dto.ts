import {PickType} from '@nestjs/swagger'
import {SignupDTO} from './signup.dto'

export class CheckUserAvailabilityDTO extends PickType(SignupDTO, ['email', 'phoneNumber']) {}
