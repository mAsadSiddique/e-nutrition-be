import {IsNotEmpty, IsString} from 'class-validator'
import {SignupDTO} from './signup.dto'
import {ApiProperty, OmitType} from '@nestjs/swagger'

export class LoginDTO extends OmitType(SignupDTO, ['confirmPassword', 'username', 'password']) {
	@ApiProperty({
		description: 'Password is required',
		nullable: false,
		example: 'Tacticminds@786',
	})
	@IsNotEmpty()
	@IsString()
	password!: string
}
