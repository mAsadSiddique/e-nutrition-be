import { Body, Controller, Delete, Get, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common'
import { CategoryService } from '../category.service'
// import { CategoryEntitiesEnum } from '../../utils/enums/category-entities.enum'
import { CreateCategoryDTO } from '../dtos/create-category.dto'
import { UpdateCategoryDTO } from '../dtos/update-category.dto'
import { CategoryListingDTO } from '../dtos/category-listing.dto'
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger'
import { RESPONSE_MESSAGES } from 'src/utils/enums/response-messages.enum'
import { Category } from '../entites/category.entity'
import { AdminAuthGuard } from 'src/auth/guard/admin_auth.guard'
import { CategoryEntitiesEnum } from 'src/utils/enums/category-entities.enum'
import { IdDTO } from 'src/shared/dto/id.dto'

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
	async addCategory(@Body() args: CreateCategoryDTO) {
		return await this.categoryService.createCategory(args, CategoryEntitiesEnum.CATEGORY)
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
	async updateCategory(@Body() args: UpdateCategoryDTO) {
		return await this.categoryService.updateCategory(args, CategoryEntitiesEnum.CATEGORY)
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
}
