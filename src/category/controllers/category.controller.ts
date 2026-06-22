import { Body, Controller, Delete, Get, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { CategoryService } from '../category.service'
import { CreateCategoryDTO } from '../dtos/create-category.dto'
import { UpdateCategoryDTO } from '../dtos/update-category.dto'
import { CategoryListingDTO } from '../dtos/category-listing.dto'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger'
import { RESPONSE_MESSAGES } from 'src/utils/enums/response-messages.enum'
import { Category } from '../entites/category.entity'
import { AdminAuthGuard } from 'src/auth/guard/admin_auth.guard'
import { CategoryEntitiesEnum } from 'src/utils/enums/category-entities.enum'
import { IdDTO } from 'src/shared/dto/id.dto'
import { user } from 'src/auth/decorators/user.decorator'
import { User } from 'src/user/entities/user.entity'
import { UserAuthGuard } from 'src/auth/guard/user_auth.guard'
import { IdsDTO } from 'src/shared/dto/ids.dto'
import { imageFileFilter } from 'src/utils/utils'
import { ENV } from 'src/config/constant'

@ApiTags('category')
@ApiBearerAuth('JWT')
@Controller('category')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) { }
	// TODO: we will apply guard for these endpoints later
	@ApiCreatedResponse({
		description: RESPONSE_MESSAGES.CATEGORY_REGISTERED,
		type: Category,
	})
	@UseGuards(AdminAuthGuard)
	@Post('/add')
	@UseInterceptors(
		FileInterceptor('icon', {
			fileFilter: imageFileFilter,
			limits: { fileSize: ENV.FILE_SIZE.IMAGE_FILE_SIZE },
		}),
	)
	@ApiConsumes('multipart/form-data')
	@ApiBody({ description: 'Category data + icon file (required for parent category)', schema: { type: 'object', properties: { name: { type: 'string' }, parentId: { type: 'number' }, isHot: { type: 'boolean' }, icon: { type: 'string', format: 'binary' } } } })
	async addCategory(@Body() args: CreateCategoryDTO, @UploadedFile() icon: Express.Multer.File) {
		return await this.categoryService.createCategory(args, CategoryEntitiesEnum.CATEGORY, icon)
	}

	@ApiCreatedResponse({
		description: RESPONSE_MESSAGES.CATEGORY_UPDATED,
		type: Category,
	})
	@ApiNotFoundResponse({
		description: RESPONSE_MESSAGES.CATEGORY_NOT_FOUND,
	})
	@UseGuards(AdminAuthGuard)
	@Put('/update')
	@UseInterceptors(
		FileInterceptor('icon', {
			fileFilter: imageFileFilter,
			limits: { fileSize: ENV.FILE_SIZE.IMAGE_FILE_SIZE },
		}),
	)
	@ApiConsumes('multipart/form-data')
	@ApiBody({ description: 'Category data + optional icon file', schema: { type: 'object', properties: { id: { type: 'number' }, name: { type: 'string' }, isHot: { type: 'boolean' }, icon: { type: 'string', format: 'binary' } } } })
	async updateCategory(@Body() args: UpdateCategoryDTO, @UploadedFile() icon: Express.Multer.File) {
		return await this.categoryService.updateCategory(args, CategoryEntitiesEnum.CATEGORY, icon)
	}

	@ApiCreatedResponse({
		description: RESPONSE_MESSAGES.CATEGORY_DELETED,
		type: Category,
	})
	@UseGuards(AdminAuthGuard)
	@Delete('/remove')
	async removeCategory(@Query() {id}: IdDTO) {
		return await this.categoryService.removeCategory(id, CategoryEntitiesEnum.CATEGORY)
	}

	@ApiCreatedResponse({
		description: RESPONSE_MESSAGES.CATEGORIES_LISTING,
		type: Category,
	})
	@Get('/')
	async categories(@Query() args: CategoryListingDTO) {
		return await this.categoryService.categoryListing(args, CategoryEntitiesEnum.CATEGORY)
	}

	@ApiCreatedResponse({
		description: RESPONSE_MESSAGES.CATEGORIES_LISTING,
		type: Category,
	})
	@Get('/hot')
	async hotCategories() {
		return await this.categoryService.listHotCategories()
	}

	@ApiCreatedResponse({
		description: RESPONSE_MESSAGES.USER_CATEGORIES_LISTING,
	})	
	@UseGuards(UserAuthGuard)
	@Put('/wishlist/toggle')
	async userWishlistToggle(@Body() args: IdDTO, @user() user: User) {
		return await this.categoryService.userWishlistToggle(args, user)
	}

	@ApiCreatedResponse({
		description: RESPONSE_MESSAGES.USER_CATEGORIES_LISTING,
	})	
	@UseGuards(UserAuthGuard)
	@Put('/wishlist')
	async userWishlist(@Body() args: IdsDTO, @user() user: User) {
		return await this.categoryService.userWishlist(args, user)
	}
}
