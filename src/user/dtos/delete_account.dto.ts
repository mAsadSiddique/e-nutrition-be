import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class DeleteAccountDTO {
	@ApiProperty({
		description: 'Email of the account to delete',
		example: 'user@example.com',
	})
	@IsNotEmpty()
	@IsEmail()
	email: string
}

