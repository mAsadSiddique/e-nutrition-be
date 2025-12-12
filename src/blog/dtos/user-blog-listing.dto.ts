import { ApiPropertyOptional, IntersectionType, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsOptional, IsPositive, IsNumber, IsEnum } from 'class-validator'
import { IdDTO } from 'src/shared/dto/id.dto'
import { PaginationDTO } from 'src/shared/dto/pagination.dto'

export enum BlogSortBy {
	LATEST = 'latest',
	TRENDING = 'trending',
}

export class UserBlogListingDTO extends IntersectionType(PaginationDTO, PartialType(IdDTO)){

	@ApiPropertyOptional({
		description: 'Filter by specific category ID',
		example: 1
	})
	@IsOptional()
	@Type(() => Number)
	@IsPositive()
	categoryId: number

	@ApiPropertyOptional({
		description: 'Sort blogs by latest or trending',
		enum: BlogSortBy,
		default: BlogSortBy.LATEST
	})
	@IsOptional()
	@IsEnum(BlogSortBy)
	sortBy: BlogSortBy = BlogSortBy.LATEST
}

