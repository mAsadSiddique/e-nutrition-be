import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger'
import {Transform} from 'class-transformer'
import {IsNotEmpty, IsEmail, Matches, IsPhoneNumber, ValidateIf, Length, IsOptional} from 'class-validator'

export class SignupDTO {
	@ApiPropertyOptional({
		description: 'User name',
		nullable: false,
		example: 'tacticminds@786',
	})
	@IsOptional()
	@Length(1, 20)
	@Transform(({value}) => value.toLowerCase().replace(/\s+/g, ''))
	username!: string

	@ApiPropertyOptional({
		description: 'Signup with email',
		nullable: true,
		example: 'tacticminds@gmail.com',
	})
	@ValidateIf((obj) => !obj.phoneNumber)
	@IsNotEmpty()
	@IsEmail()
	@Transform(({value}) => value.toLowerCase())
	email!: string

	@ApiPropertyOptional({
		description: 'Signup with phone number',
		nullable: true,
		example: '+923087510404',
	})
	@ValidateIf((obj) => !obj.email)
	@IsNotEmpty()
	@IsPhoneNumber(undefined, {message: 'phone number must be correct phone number and also contain country code'})
	phoneNumber!: string

	@ApiProperty({
		description: 'Password is required',
		nullable: false,
		example: 'Tacticminds@786',
	})
	@IsNotEmpty()
	@Matches(/^((?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*\W).{8,30})$/, {
		message: 'password must contain atleast 8 letters, 1 upper case, lower case, number and special character',
	})
	password!: string

	@ApiProperty({
		description: 'Confirm password is required',
		nullable: false,
		example: 'Tacticminds@786',
	})
	@IsNotEmpty()
	@Matches(/^((?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*\W).{8,30})$/, {
		message: 'confirmPassword must contain atleast 8 letters, 1 upper case, lower case, number and special character',
	})
	confirmPassword!: string
}
