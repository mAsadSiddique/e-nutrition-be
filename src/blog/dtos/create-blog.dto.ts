import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum, IsArray } from 'class-validator'
import { BlogStatus } from '../entities/blog.entity'

export class CreateBlogDTO {
	@ApiProperty({
		description: 'Blog title',
		example: 'How to Build a NestJS Application'
	})
	@IsNotEmpty()
	@IsString()
	@Transform(({ value }) => value.trim())
	title: string

	@ApiProperty({
		description: 'Blog content/body',
		example: 'This is the full content of the blog post...'
	})
	@IsNotEmpty()
	@IsString()
	content: string

	@ApiPropertyOptional({
		description: 'Blog excerpt/summary',
		example: 'A brief summary of the blog post'
	})
	@IsOptional()
	@IsString()
	excerpt: string

	@ApiProperty({
		description: 'Category ID for the blog',
		example: 1
	})
	@IsNotEmpty()
	@IsNumber()
	categoryId: number

	@ApiPropertyOptional({
		description: 'Blog status',
		enum: BlogStatus,
		default: BlogStatus.DRAFT
	})
	@IsOptional()
	@IsEnum(BlogStatus)
	status: BlogStatus

	@ApiPropertyOptional({
		description: 'Blog slug for SEO (auto-generated if not provided)',
		example: 'how-to-build-nestjs-application'
	})
	@IsOptional()
	@IsString()
	@Transform(({ value }) => value?.trim())
	slug: string
}

