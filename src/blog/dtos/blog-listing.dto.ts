import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsOptional, IsPositive, IsNumber, IsEnum, IsString } from 'class-validator'
import { BlogStatus } from '../entities/blog.entity'

export class BlogListingDTO {
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
		description: 'Filter by category ID',
		example: 1
	})
	@IsOptional()
	@Type(() => Number)
	@IsPositive()
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
	@IsString()
	search: string

	@ApiPropertyOptional({
		description: 'Get specific blog by ID',
		example: 1
	})
	@IsOptional()
	@Type(() => Number)
	@IsPositive()
	id: number
}

