import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '../auth/auth.module'
import { SharedModule } from '../shared/shared.module'
import { CategoryController } from './controllers/category.controller'
import { CategoryService } from './category.service'
import { Category } from './entites/category.entity'
// import { ProductCategoryController } from './controllers/product-category.controller'

@Module({
	imports: [TypeOrmModule.forFeature([ Category]),
		AuthModule,
		SharedModule],
	controllers: [CategoryController],
	providers: [CategoryService],
	exports: [CategoryService]
})
export class CategoryModule { }
