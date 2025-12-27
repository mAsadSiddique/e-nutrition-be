import { ApiPropertyOptional, IntersectionType, PartialType, PickType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsOptional, IsPositive, IsEnum, IsDateString, Length, IsInt } from 'class-validator'
import { BlogStatus } from '../entities/blog.entity'
import { PaginationDTO } from 'src/shared/dto/pagination.dto'
import { IdDTO } from 'src/shared/dto/id.dto'
import { CreateBlogDTO } from './create-blog.dto'

export class BlogListingDTO extends IntersectionType(PaginationDTO, PartialType(IdDTO), PickType(CreateBlogDTO, ['tags'])){

	@ApiPropertyOptional({
		description: 'Filter by category ID',
		example: 1
	})
	@IsOptional()
	@Type(() => Number)
	@IsPositive()
	@IsInt()
	categoryId: number

	@ApiPropertyOptional({
		description: 'Filter by status',
		enum: BlogStatus
	})
	@IsOptional()
	@IsEnum(BlogStatus)
	status: BlogStatus

	@ApiPropertyOptional({
		description: 'Search by title or content',
		example: 'nestjs'
	})
	@IsOptional()
	@Length(1,100)
	search: string

	@ApiPropertyOptional({
		description: 'Filter by created date from',
		example: '2024-01-01'
	})
	@IsOptional()
	@IsDateString()
	fromDate: string

	@ApiPropertyOptional({
		description: 'Filter by created date to',
		example: '2024-12-31'
	})
	@IsOptional()
	@IsDateString()
	toDate: string
}

