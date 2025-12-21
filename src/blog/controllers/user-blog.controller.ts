import { Body, Controller, Get, Param, Post, Query, UseGuards, ParseIntPipe, Put } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse } from '@nestjs/swagger'
import { BlogService } from '../services/blog.service'
import { SelectCategoriesDTO } from '../dtos/select-categories.dto'
import { UserBlogListingDTO } from '../dtos/user-blog-listing.dto'
import { Blog } from '../entities/blog.entity'
import { UserAuthGuard } from '../../auth/guard/user_auth.guard'
import { user } from '../../auth/decorators/user.decorator'
import { User } from '../../user/entities/user.entity'
import { RESPONSE_MESSAGES } from '../../utils/enums/response-messages.enum'
import { IdDTO } from 'src/shared/dto/id.dto'

@ApiTags('user-blog')
@ApiBearerAuth('JWT')
@Controller('user/blog')
export class UserBlogController {
	constructor(private readonly blogService: BlogService) { }

	@ApiCreatedResponse({
		description: RESPONSE_MESSAGES.BLOG_LISTING,
		type: Blog,
	})
	@Get('/')
	async getUserBlogs(@Query() args: UserBlogListingDTO, @user() user: User) {
		return await this.blogService.getUserBlogs(args, user)
	}

	// @ApiCreatedResponse({
	// 	description: RESPONSE_MESSAGES.SUCCESS,
	// 	type: Blog,
	// })
	// @ApiNotFoundResponse({ description: RESPONSE_MESSAGES.BLOG_NOT_FOUND })
	// @Get('/:id')
	// async getBlogById(@Param('id', ParseIntPipe) id: number) {
	// 	return await this.blogService.getBlogById(id)
	// }

	// @ApiCreatedResponse({
	// 	description: RESPONSE_MESSAGES.CATEGORIES_SELECTED,
	// })
	// @Post('/category/wishlist/toggle')
	// async selectCategories(@Body() args: SelectCategoriesDTO, @user() user: User) {
	// 	return await this.blogService.selectCategories(args, user.id)
	// }

	@ApiCreatedResponse({
		description: RESPONSE_MESSAGES.USER_CATEGORIES_LISTING,
	})
	@UseGuards(UserAuthGuard)
	@Get('/categories')
	async getSelectedCategories(@user() user: User) {
		return await this.blogService.getUserSelectedCategories(user.id)
	}

    @ApiCreatedResponse({
		description: RESPONSE_MESSAGES.USER_CATEGORIES_LISTING,
	})	
	@UseGuards(UserAuthGuard)
	@Put('/wishlist/toggle')
	async userWishlistToggle(@Body() args: IdDTO, @user() user: User) {
		return await this.blogService.userWishlistToggle(args, user)
	}
}

