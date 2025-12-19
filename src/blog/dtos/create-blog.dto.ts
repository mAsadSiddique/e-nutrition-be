import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsNotEmpty, IsArray, IsNumber, IsOptional, IsString, IsEnum, ArrayMinSize, Length, IsPositive, IsInt } from 'class-validator'
import { BlogStatus } from '../entities/blog.entity'
import { ImgsDimDTO } from './dim.dto'

export class CreateBlogDTO extends ImgsDimDTO {
	@ApiProperty({
		description: 'Blog title',
		example: 'How to Build a NestJS Application'
	})
	@IsNotEmpty()
	@Length(1,100)
	@Transform(({ value }) => value.trim())
	title: string

	@ApiProperty({
		description: 'Blog content/body (HTML supported with headings, subheadings, images)',
		example: '<p>Hi This is our testing body content</p><p>This is small heading.<br></p>'
	})
	@IsNotEmpty()
	@Length(1,5000)
	content: string

	@ApiPropertyOptional({
		description: 'Blog excerpt/summary',
		example: 'A brief summary of the blog post'
	})
	@IsOptional()
	@Length(1,200)
	excerpt: string

	@ApiProperty({
		description: 'Array of category IDs (at least one required for publishing)',
		example: [1, 2],
		type: [Number]
	})
	@IsNotEmpty()
	@ArrayMinSize(1)
	@IsPositive({ each: true })
	@IsInt({ each: true })
	@Transform(({value}) => value.split(',').map(Number))
	categoryIds: number[]

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
	@Length(1,100)
	@Transform(({ value }) => value?.trim())
	slug: string

	@ApiPropertyOptional({
		description: 'SEO title',
		example: 'NestJS Application Development Guide'
	})
	@IsOptional()
	@Length(1,100)
	@Transform(({ value }) => value?.trim())
	seoTitle: string

	@ApiPropertyOptional({
		description: 'SEO description',
		example: 'Learn how to build a NestJS application from scratch'
	})
	@IsOptional()
	@Length(1,200)
	seoDescription: string

	@ApiPropertyOptional({
		description: 'Blog tags (comma-separated or array)',
		example: ['nestjs', 'backend', 'api']
	})
	@IsOptional()
	@Transform(({ value }) => value.split(',').map((tag: string) => tag.trim()))
	@ArrayMinSize(1)
	@IsString({ each: true })
	tags: string[]
}

