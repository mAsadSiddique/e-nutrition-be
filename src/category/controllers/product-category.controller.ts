// import { Body, Controller, Delete, Get, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
// import { CategoryEntitiesEnum } from '../../utils/enums/category-entities.enum';
// import { CategoryService } from '../category.service';
// import { CreateCategoryDTO } from '../dtos/create-category.dto';
// import { UpdateCategoryDTO } from '../dtos/update-category.dto';
// import { CategoryListingDTO } from '../dtos/category-listing.dto';
// import { Role } from '../../auth/decorators/roles.decorator';
// import { Roles } from '../../utils/enums/roles.enum';
// import { GuardName } from '../../auth/decorators/guards.decorator';
// import { GuardsEnum } from '../../utils/enums/guards.enum';
// import { CommonAuthGuard } from '../../auth/guard/common-auth.guard';
// import { RoleGuard } from '../../auth/guard/roles-auth.guard';
// import { SellerRolesEnum } from '../../utils/enums/seller-roles.enum';
// import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
// import { RESPONSE_MESSAGES } from 'src/utils/enums/response-messages.enum';
// import { ProductCategory } from '../entites/product-category.entity';

// @ApiTags('product/category')
// @ApiBearerAuth('JWT')
// @Controller('product/category')
// export class ProductCategoryController {
//     constructor(
//         private readonly categoryService: CategoryService
//     ) { }

//     @ApiCreatedResponse({
//         description: RESPONSE_MESSAGES.CATEGORY_REGISTERED,
//         type: ProductCategory,
//     })
//     @Role(Roles.SUPER)
//     @GuardName(GuardsEnum.ADMIN)
//     @UseGuards(CommonAuthGuard, RoleGuard)
//     @Post('/add')
//     async addProuctCategory(@Body() args: CreateCategoryDTO) {
//         return await this.categoryService.createCategory(args, CategoryEntitiesEnum.PRODUCT_CATEGORY)
//     }

//     @ApiCreatedResponse({
//         description: RESPONSE_MESSAGES.CATEGORY_UPDATED,
//         type: ProductCategory,
//     })
//     @Role(Roles.SUPER)
//     @GuardName(GuardsEnum.ADMIN)
//     @UseGuards(CommonAuthGuard, RoleGuard)
//     @Put('/update')
//     async updateProductCategory(@Body() args: UpdateCategoryDTO) {
//         return await this.categoryService.updateCategory(args, CategoryEntitiesEnum.PRODUCT_CATEGORY)
//     }

//     @ApiCreatedResponse({
//         description: RESPONSE_MESSAGES.CATEGORY_DELETED,
//         type: ProductCategory,
//     })
//     @Role(Roles.SUPER)
//     @GuardName(GuardsEnum.ADMIN)
//     @UseGuards(CommonAuthGuard, RoleGuard)
//     @Delete('/remove')
//     async removeProductCategory(@Query('id', ParseIntPipe) id: number) {
//         return await this.categoryService.removeCategory(id, CategoryEntitiesEnum.PRODUCT_CATEGORY)
//     }

//     @Get('/')
//     async categories(@Query() args: CategoryListingDTO) {
//         return await this.categoryService.categoryListing(args, CategoryEntitiesEnum.PRODUCT_CATEGORY)
//     }
// }
