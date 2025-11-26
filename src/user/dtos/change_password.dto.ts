import {IsNotEmpty, Matches} from 'class-validator'
import {SignupDTO} from './signup.dto'
import {ApiProperty, OmitType} from '@nestjs/swagger'

export class ChangePasswordDTO extends OmitType(SignupDTO, ['email', 'phoneNumber']) {
	@ApiProperty({
		description: 'Old password of the user',
		nullable: false,
		example: 'Tacticminds@786',
	})
	@IsNotEmpty()
	@Matches(/^((?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*\W).{8,30})$/, {
		message: 'password must contain atleast 8 letters, 1 upper case, lower case, number and special character',
	})
	oldPassword!: string
}
