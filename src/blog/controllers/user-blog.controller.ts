import { Body, Controller, Get, Param, Post, Put, Query, UseGuards, ParseIntPipe } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse } from '@nestjs/swagger'
import { BlogService } from '../services/blog.service'
import { SelectCategoriesDTO } from '../dtos/select-categories.dto'
import { UserBlogListingDTO } from '../dtos/user-blog-listing.dto'
import { Blog } from '../entities/blog.entity'
import { UserAuthGuard } from '../../auth/guard/user_auth.guard'
import { user } from '../../auth/decorators/user.decorator'
import { User } from '../../user/entities/user.entity'
import { RESPONSE_MESSAGES } from '../../utils/enums/response-messages.enum'

@ApiTags('user-blog')
@ApiBearerAuth('JWT')
@Controller('user/blog')
@UseGuards(UserAuthGuard)
export class UserBlogController {
	constructor(private readonly blogService: BlogService) { }

	@ApiCreatedResponse({
		description: RESPONSE_MESSAGES.BLOG_LISTING,
		type: Blog,
	})
	@Get('/list')
	async getUserBlogs(@Query() args: UserBlogListingDTO, @user() user: User) {
		return await this.blogService.getUserBlogs(user.id, args.page, args.limit, args.categoryId)
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
		description: RESPONSE_MESSAGES.CATEGORIES_SELECTED,
	})
	@Post('/select-categories')
	async selectCategories(@Body() args: SelectCategoriesDTO, @user() user: User) {
		return await this.blogService.selectCategories(args, user.id)
	}

	@ApiCreatedResponse({
		description: RESPONSE_MESSAGES.USER_CATEGORIES_LISTING,
	})
	@Get('/categories/selected')
	async getSelectedCategories(@user() user: User) {
		return await this.blogService.getUserSelectedCategories(user.id)
	}
}

