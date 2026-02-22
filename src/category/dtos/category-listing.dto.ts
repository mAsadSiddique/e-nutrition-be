import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { Type } from 'class-transformer'
import { IsBoolean, IsOptional, IsPositive } from 'class-validator'
import { toBoolean } from 'src/utils/utils'

export class CategoryListingDTO {
	@ApiPropertyOptional({
		description: 'Search specific category by id. When provided, returns the category with all its subcategories (children) attached.',
		nullable: true,
		example: 4
	})
	@IsOptional()
	@Type(() => Number)
	@IsPositive()
	id: number

	@ApiPropertyOptional({
		description: 'When true and id is provided, returns only the subcategories (children) of that category, excluding the category itself.',
		nullable: true,
		default: false,
		example: false
	})
	@IsOptional()
	@Transform(({ value }) => toBoolean(value))
	@IsBoolean()
	childrenOnly?: boolean
}
