import { LoginDTO } from './login.dto'
import { OmitType } from '@nestjs/swagger'

export class ForgotPasswordDTO extends OmitType(LoginDTO, ['password']){}
