import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsOptional, IsPositive } from 'class-validator'

export class CategoryListingDTO {
	@ApiPropertyOptional({
		description: 'Search specific category by id',
		nullable: true,
		example: 4
	})
	@IsOptional()
	@Type(() => Number)
	@IsPositive()
	id: number
}
