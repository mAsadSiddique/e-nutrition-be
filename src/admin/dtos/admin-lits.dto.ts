import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsBoolean, IsEnum, IsOptional, IsPositive, Length, Min } from 'class-validator'
import { PaginationDTO } from 'src/shared/dto/pagination.dto'
import { Roles } from 'src/utils/enums/roles.enum'
import { toBoolean } from 'src/utils/utils'

export class AdminListingDTO extends PaginationDTO {
	@ApiPropertyOptional({
		description: 'Search by id',
		nullable: true,
		example: 3
	})
	@IsOptional()
	@Type(() => Number)
	@IsPositive()
	id: number

	@ApiPropertyOptional({
		description: 'Search by role',
		nullable: true,
		example: Roles.SUPER
	})
	@IsOptional()
	@IsEnum(Roles, { message: `role should be a valid value. ${Object.values(Roles)}` })
	role: Roles

	@ApiPropertyOptional({
		description: 'Searching through block/unblock',
		nullable: true,
		example: false,
	})
	@IsOptional()
	@Transform(({ value }) => toBoolean(value))
	@IsBoolean()
	isBlocked: boolean

	@ApiPropertyOptional({
		description: "Search which admin's email is verified or not",
		nullable: true,
		example: true
	})
	@IsOptional()
	@Transform(({ value }) => toBoolean(value))
	@IsBoolean()
	isEmailVerified: boolean

	@ApiPropertyOptional({
		description: 'Searching through email, first name last name etc...',
		nullable: true,
		example: 'waqar'
	})
	@IsOptional()
	@Length(1, 100)
	@Transform(({ value }) => value.trim())
	search: string

}
