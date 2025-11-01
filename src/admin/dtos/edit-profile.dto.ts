import { Transform } from 'class-transformer'
import { IsBoolean, IsOptional, Length } from 'class-validator'
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { toBoolean } from 'src/utils/utils'

export class EditProfileDTO {
	@ApiPropertyOptional({
		description: 'Enter first name for edit',
		nullable: true,
		example: 'waqar'
	})
	@IsOptional()
	@Length(1, 100)
	@Transform(({ value }) => value.trim())
	firstName: string

	@ApiPropertyOptional({
		description: 'Enter last name for edit',
		nullable: true,
		example: 'hussain'
	})
	@IsOptional()
	@Length(1, 100)
	@Transform(({ value }) => value.trim())
	lastName: string

	@ApiPropertyOptional({
		description: 'you can allow notification or mute',
		nullable: true,
		example: true
	})
	@IsOptional()
	@Transform(({ value }) => toBoolean(value))
	@IsBoolean()
	isNotificationEnabled: boolean
}
