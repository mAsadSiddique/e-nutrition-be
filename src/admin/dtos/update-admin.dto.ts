import { IsEnum, IsNotEmpty, IsPositive } from 'class-validator'
import { Roles } from '../../utils/enums/roles.enum'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateAdminDTO {

	@ApiProperty({
		description: 'Admin id is required to update admin role',
		nullable: false,
		example: 4
	})
	@IsNotEmpty()
	@IsPositive()
	id: number

	@ApiProperty({
		description: "Enter the admin's updated role",
		nullable: false,
		example: Roles.SUPER
	})
	@IsNotEmpty()
	@IsEnum(Roles, { message: `role should be a valid value. ${Object.values(Roles)}` })
	role: Roles
}
