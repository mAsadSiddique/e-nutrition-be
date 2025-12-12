import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors, ParseIntPipe, BadRequestException } from '@nestjs/common'
import { AnyFilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express'
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
import { memoryStorage } from 'multer'
import { IdDTO } from '../../shared/dto/id.dto'
import { imageFileFilter } from 'src/utils/utils'
import { ENV } from 'src/config/constant'

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
	@Post('/create')
	@UseInterceptors(
		FileFieldsInterceptor(
			[
				{name: '1', maxCount: 1},
				{name: '2', maxCount: 1},
				{name: '3', maxCount: 1},
				{name: '4', maxCount: 1},
				{name: '5', maxCount: 1},
			],
			{
				fileFilter: imageFileFilter,
				limits: {
					fileSize: eval(ENV.FILE_SIZE.IMAGE_FILE_SIZE),
					fieldSize: eval(ENV.FILE_SIZE.FIELD_SIZE),
					files: 5,
				},
			}
		)
	)
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		description: 'Upload Media files',
		type: CreateBlogDTO,
	})
	async createBlog(
		@Body() args: CreateBlogDTO,
		@user() admin: Admin,
		@UploadedFiles() files: Array<Express.Multer.File>
	) {
		return await this.blogService.createBlog(args, admin.id, files)
	}

	@ApiCreatedResponse({
		description: RESPONSE_MESSAGES.BLOG_UPDATED,
		type: Blog,
	})
	@ApiNotFoundResponse({ description: RESPONSE_MESSAGES.BLOG_NOT_FOUND })
	@ApiBody({
		description: 'Upload Media files',
		type: CreateBlogDTO,
	})
	@Put('/update')
			@UseInterceptors(
		FileFieldsInterceptor(
			[
				{name: '1', maxCount: 1},
				{name: '2', maxCount: 1},
				{name: '3', maxCount: 1},
				{name: '4', maxCount: 1},
				{name: '5', maxCount: 1},
			],
			{
				fileFilter: imageFileFilter,
				limits: {
					fileSize: eval(ENV.FILE_SIZE.IMAGE_FILE_SIZE),
					fieldSize: eval(ENV.FILE_SIZE.FIELD_SIZE),
					files: 5,
				},
			}
		)
	)
	@ApiConsumes('multipart/form-data')
	async updateBlog(
		@Body() args: UpdateBlogDTO,
		@user() admin: Admin,
		@UploadedFiles() files: Array<Express.Multer.File>
	) {
		return await this.blogService.updateBlog( args, admin.id, files)
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
	@Get('/')
	async listBlogs(@Query() args: BlogListingDTO) {
		return await this.blogService.listBlogs(args)
	}

	// @ApiCreatedResponse({
	// 	description: RESPONSE_MESSAGES.BLOG_PUBLISHED,
	// 	type: Blog,
	// })
	// @ApiNotFoundResponse({ description: RESPONSE_MESSAGES.BLOG_NOT_FOUND })
	// @ApiBadRequestResponse({ description: RESPONSE_MESSAGES.CATEGORY_REQUIRED_FOR_BLOG })
	// @Put('/publish/:id')
	// async publishBlog(@Param('id', ParseIntPipe) id: number, @user() admin: Admin) {
	// 	return await this.blogService.publishBlog(id, admin.id)
	// }

	// @ApiCreatedResponse({
	// 	description: RESPONSE_MESSAGES.BLOG_UNPUBLISHED,
	// 	type: Blog,
	// })
	// @ApiNotFoundResponse({ description: RESPONSE_MESSAGES.BLOG_NOT_FOUND })
	// @Put('/unpublish/:id')
	// async unpublishBlog(@Param('id', ParseIntPipe) id: number, @user() admin: Admin) {
	// 	return await this.blogService.unpublishBlog(id, admin.id)
	// }
}

