import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty, IsEmail, Length, ValidateIf, IsPhoneNumber, IsOptional } from 'class-validator'

export class LoginDTO {
	@ApiProperty({
		description: 'user’s email address',
		nullable: false,
		example: 'waqar@gmail.com',
	})
	@IsNotEmpty()
	@IsEmail()
	@Transform((email) => email.value.toLowerCase())
	email: string

	@ApiPropertyOptional({
		description: 'Signup with phone number',
		nullable: true,
		example: '+923087510404',
	})
	@IsOptional()
	@IsPhoneNumber(undefined, {message: 'phone number must be correct phone number and also contain country code'})
	phoneNumber!: string

	@ApiProperty({
		description: 'user’s password',
		nullable: false,
		example: 'Waqar@123',
	})
	@IsNotEmpty()
	@Length(1, 50)
	password: string
}
