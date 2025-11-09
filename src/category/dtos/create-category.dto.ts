import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { toBoolean } from 'src/utils/utils'
import { boolean } from 'zod'

export class CreateCategoryDTO {
	@ApiProperty({
		description: 'Name of the category is required',
		nullable: false,
		example: 'category'
	})
	@IsNotEmpty()
	@IsString()
	name: string

	@ApiPropertyOptional({
		description: 'parent id is required to add new category as a child',
		nullable: true,
		example: 4
	})
	@IsOptional()
	@IsNumber()
	parentId: number

	@ApiPropertyOptional({
		description: 'Is hot cetegory?',
		type: boolean,
		default: false
	})
	@IsOptional()
	@Transform(({ value }) => toBoolean(value))
	@IsBoolean()
	isHot: boolean
}
