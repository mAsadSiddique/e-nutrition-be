import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsOptional, IsNumber, IsString, IsEnum } from 'class-validator'
import { BlogStatus } from '../entities/blog.entity'

export class UpdateBlogDTO {
	@ApiPropertyOptional({
		description: 'Blog ID',
		example: 1
	})
	@IsOptional()
	@IsNumber()
	id: number

	@ApiPropertyOptional({
		description: 'Blog title',
		example: 'How to Build a NestJS Application'
	})
	@IsOptional()
	@IsString()
	@Transform(({ value }) => value?.trim())
	title: string

	@ApiPropertyOptional({
		description: 'Blog content/body',
		example: 'This is the full content of the blog post...'
	})
	@IsOptional()
	@IsString()
	content: string

	@ApiPropertyOptional({
		description: 'Blog excerpt/summary',
		example: 'A brief summary of the blog post'
	})
	@IsOptional()
	@IsString()
	excerpt: string

	@ApiPropertyOptional({
		description: 'Category ID for the blog',
		example: 1
	})
	@IsOptional()
	@IsNumber()
	categoryId: number

	@ApiPropertyOptional({
		description: 'Blog status',
		enum: BlogStatus
	})
	@IsOptional()
	@IsEnum(BlogStatus)
	status: BlogStatus

	@ApiPropertyOptional({
		description: 'Blog slug for SEO',
		example: 'how-to-build-nestjs-application'
	})
	@IsOptional()
	@IsString()
	@Transform(({ value }) => value?.trim())
	slug: string
}

