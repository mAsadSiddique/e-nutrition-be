import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsOptional, IsPositive, IsNumber } from 'class-validator'

export class UserBlogListingDTO {
	@ApiPropertyOptional({
		description: 'Page number for pagination',
		example: 1,
		default: 1
	})
	@IsOptional()
	@Type(() => Number)
	@IsPositive()
	page: number = 1

	@ApiPropertyOptional({
		description: 'Number of items per page',
		example: 10,
		default: 10
	})
	@IsOptional()
	@Type(() => Number)
	@IsPositive()
	limit: number = 10

	@ApiPropertyOptional({
		description: 'Filter by specific category ID',
		example: 1
	})
	@IsOptional()
	@Type(() => Number)
	@IsPositive()
	categoryId: number
}

