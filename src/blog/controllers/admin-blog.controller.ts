import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UploadedFiles, UseGuards, UseInterceptors, ParseIntPipe, BadRequestException } from '@nestjs/common'
import { FileInterceptor, FilesInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiConsumes, ApiBody } from '@nestjs/swagger'
import { BlogService } from '../services/blog.service'
import { CreateBlogDTO } from '../dtos/create-blog.dto'
import { UpdateBlogDTO } from '../dtos/update-blog.dto'
import { BlogListingDTO } from '../dtos/blog-listing.dto'
import { Blog } from '../entities/blog.entity'
import { AdminAuthGuard } from '../../auth/guard/admin_auth.guard'
import { RoleGuard } from '../../auth/guard/roles-auth.guard'
import { Role } from '../../auth/decorators/roles.decorator'
import { Roles } from '../../utils/enums/roles.enum'
import { user } from '../../auth/decorators/user.decorator'
import { Admin } from '../../admin/entities/admin.entity'
import { RESPONSE_MESSAGES } from '../../utils/enums/response-messages.enum'
import { imageFileFilter, videoFileFilter } from '../../utils/utils'
import { memoryStorage } from 'multer'
import { IdDTO } from '../../shared/dto/id.dto'
import { separateFiles } from '../utils/file-upload.util'

@ApiTags('admin-blog')
@ApiBearerAuth('JWT')
@Controller('admin/blog')
@Role(Roles.SUPER, Roles.SUB)
@UseGuards(AdminAuthGuard, RoleGuard)
export class AdminBlogController {
	constructor(private readonly blogService: BlogService) { }

	@ApiCreatedResponse({
		description: RESPONSE_MESSAGES.BLOG_CREATED,
		type: Blog,
	})
	@ApiBadRequestResponse({ description: RESPONSE_MESSAGES.CATEGORY_NOT_FOUND })
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				title: { type: 'string', example: 'How to Build a NestJS Application' },
				content: { type: 'string', example: 'This is the full content of the blog post...' },
				excerpt: { type: 'string', example: 'A brief summary of the blog post' },
				categoryId: { type: 'number', example: 1 },
				status: { type: 'string', enum: ['draft', 'published'], example: 'draft' },
				slug: { type: 'string', example: 'how-to-build-nestjs-application' },
				featuredImage: { type: 'string', format: 'binary' },
				images: { type: 'array', items: { type: 'string', format: 'binary' } },
				videos: { type: 'array', items: { type: 'string', format: 'binary' } },
			},
			required: ['title', 'content', 'categoryId'],
		},
	})
	@UseInterceptors(
		AnyFilesInterceptor({
			storage: memoryStorage(),
		})
	)
	@Post('/create')
	async createBlog(
		@Body() args: CreateBlogDTO,
		@user() admin: Admin,
		@UploadedFiles() files?: Express.Multer.File[]
	) {
		const { featuredImage, images, videos } = separateFiles(files || [])
		
		// Validate file types
		if (featuredImage && !featuredImage.originalname.match(/\.(png|jpeg|jpg|gif|PNG|JPEG|JPG|GIF)$/)) {
			throw new BadRequestException('Featured image must be an image file (jpg, jpeg, png, gif)')
		}
		
		images.forEach(img => {
			if (!img.originalname.match(/\.(png|jpeg|jpg|gif|PNG|JPEG|JPG|GIF)$/)) {
				throw new BadRequestException('All image files must be image format (jpg, jpeg, png, gif)')
			}
		})
		
		videos.forEach(vid => {
			if (!vid.originalname.match(/\.(mp4|avi|mov|wmv|flv|webm|MP4|AVI|MOV|WMV|FLV|WEBM)$/)) {
				throw new BadRequestException('All video files must be video format (mp4, avi, mov, wmv, flv, webm)')
			}
		})

		return await this.blogService.createBlog(
			args,
			admin.id,
			featuredImage,
			images.length > 0 ? images : undefined,
			videos.length > 0 ? videos : undefined
		)
	}

	@ApiCreatedResponse({
		description: RESPONSE_MESSAGES.BLOG_UPDATED,
		type: Blog,
	})
	@ApiNotFoundResponse({ description: RESPONSE_MESSAGES.BLOG_NOT_FOUND })
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				id: { type: 'number', example: 1 },
				title: { type: 'string', example: 'How to Build a NestJS Application' },
				content: { type: 'string', example: 'This is the full content of the blog post...' },
				excerpt: { type: 'string', example: 'A brief summary of the blog post' },
				categoryId: { type: 'number', example: 1 },
				status: { type: 'string', enum: ['draft', 'published'], example: 'draft' },
				slug: { type: 'string', example: 'how-to-build-nestjs-application' },
				featuredImage: { type: 'string', format: 'binary' },
				images: { type: 'array', items: { type: 'string', format: 'binary' } },
				videos: { type: 'array', items: { type: 'string', format: 'binary' } },
			},
		},
	})
	@UseInterceptors(
		AnyFilesInterceptor({
			storage: memoryStorage(),
		})
	)
	@Put('/update')
	async updateBlog(
		@Body() args: UpdateBlogDTO,
		@user() admin: Admin,
		@UploadedFiles() files?: Express.Multer.File[]
	) {
		const { featuredImage, images, videos } = separateFiles(files || [])
		
		// Validate file types
		if (featuredImage && !featuredImage.originalname.match(/\.(png|jpeg|jpg|gif|PNG|JPEG|JPG|GIF)$/)) {
			throw new BadRequestException('Featured image must be an image file (jpg, jpeg, png, gif)')
		}
		
		images.forEach(img => {
			if (!img.originalname.match(/\.(png|jpeg|jpg|gif|PNG|JPEG|JPG|GIF)$/)) {
				throw new BadRequestException('All image files must be image format (jpg, jpeg, png, gif)')
			}
		})
		
		videos.forEach(vid => {
			if (!vid.originalname.match(/\.(mp4|avi|mov|wmv|flv|webm|MP4|AVI|MOV|WMV|FLV|WEBM)$/)) {
				throw new BadRequestException('All video files must be video format (mp4, avi, mov, wmv, flv, webm)')
			}
		})

		return await this.blogService.updateBlog(
			args,
			admin.id,
			featuredImage,
			images.length > 0 ? images : undefined,
			videos.length > 0 ? videos : undefined
		)
	}

	@ApiCreatedResponse({
		description: RESPONSE_MESSAGES.BLOG_DELETED,
	})
	@ApiNotFoundResponse({ description: RESPONSE_MESSAGES.BLOG_NOT_FOUND })
	@Delete('/delete')
	async deleteBlog(@Query() { id }: IdDTO, @user() admin: Admin) {
		return await this.blogService.deleteBlog(id, admin.id)
	}

	@ApiCreatedResponse({
		description: RESPONSE_MESSAGES.BLOG_LISTING,
		type: Blog,
	})
	@Get('/list')
	async listBlogs(@Query() args: BlogListingDTO) {
		return await this.blogService.listBlogs(args)
	}

	@ApiCreatedResponse({
		description: RESPONSE_MESSAGES.SUCCESS,
		type: Blog,
	})
	@ApiNotFoundResponse({ description: RESPONSE_MESSAGES.BLOG_NOT_FOUND })
	@Get('/:id')
	async getBlogById(@Param('id', ParseIntPipe) id: number) {
		return await this.blogService.getBlogById(id)
	}

	@ApiCreatedResponse({
		description: RESPONSE_MESSAGES.BLOG_PUBLISHED,
		type: Blog,
	})
	@ApiNotFoundResponse({ description: RESPONSE_MESSAGES.BLOG_NOT_FOUND })
	@ApiBadRequestResponse({ description: RESPONSE_MESSAGES.CATEGORY_REQUIRED_FOR_BLOG })
	@Put('/publish/:id')
	async publishBlog(@Param('id', ParseIntPipe) id: number, @user() admin: Admin) {
		return await this.blogService.publishBlog(id, admin.id)
	}
}

