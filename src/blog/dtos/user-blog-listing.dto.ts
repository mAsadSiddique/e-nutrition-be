import { ApiPropertyOptional, IntersectionType, PartialType, PickType } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsOptional, IsEnum, Length, IsArray, IsInt, IsPositive, ArrayMinSize } from 'class-validator'
import { IdDTO } from 'src/shared/dto/id.dto'
import { PaginationDTO } from 'src/shared/dto/pagination.dto'
import { CreateBlogDTO } from './create-blog.dto'

export enum BlogSortBy {
	OLD_TO_NEW = 'oldToNew',
	NEW_TO_OLD = 'newToOld',
}

export class UserBlogListingDTO extends IntersectionType(PaginationDTO, PartialType(IdDTO), PartialType(PickType(CreateBlogDTO, ['tags', 'slug', 'categoryIds']))) {

	@ApiPropertyOptional({
		description: 'Sort blogs by latest or trending',
		enum: BlogSortBy,
		default: BlogSortBy.NEW_TO_OLD
	})
	@IsOptional()
	@IsEnum(BlogSortBy)
	sortBy: BlogSortBy = BlogSortBy.NEW_TO_OLD

	@ApiPropertyOptional({
		description: 'Search keyword to filter or query specific records',
		nullable: true,
		example: 'plumber',
	})
	@IsOptional()
	@Transform(({value}) => value?.trim())
	@Length(1, 100)
	search?: string

	@ApiPropertyOptional({
		description: 'Array of blog IDs to retrieve multiple blogs. Can be passed as comma-separated string (e.g., "1,2,3") or as array (e.g., [1,2,3])',
		type: [Number],
		example: [1, 2, 3],
		required: false
	})
	@IsOptional()
	@Transform(({ value }) => value?.split(',').map(Number))
	@IsArray()
	@ArrayMinSize(1)
	@IsInt({ each: true })
	@IsPositive({ each: true })
	ids?: number[]
}

