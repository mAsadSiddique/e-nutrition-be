import { Transform } from 'class-transformer'
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, Length } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Roles } from 'src/utils/enums/roles.enum'

export class AddAdminDTO {

	@ApiPropertyOptional({
		description: 'Enter the first name',
		nullable: true,
		example: 'waqar'
	})
	@IsOptional()
	@Length(1, 100)
	@Transform(({ value }) => value.trim())
	firstName: string

	@ApiPropertyOptional({
		description: 'Enter the last name',
		nullable: true,
		example: 'hussain'
	})
	@IsOptional()
	@Length(1, 100)
	@Transform(({ value }) => value.trim())
	lastName: string

	@ApiProperty({
		description: 'Email is required',
		nullable: false,
		example: 'waqar@gmail.com'
	})
	@IsNotEmpty()
	@IsEmail()
	@Transform(email => email.value.toLowerCase())
	email: string

	@ApiPropertyOptional({
		description: 'Enter the role of the admin',
		nullable: true,
		example: Roles.SUPER
	})
	@IsOptional()
	@IsEnum(Roles, { message: `role should be a valid value. ${Object.values(Roles)}` })
	role: Roles
}
