import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Blog } from './entities/blog.entity'
import { UserCategory } from './entities/user-category.entity'
import { Category } from '../category/entites/category.entity'
import { BlogService } from './services/blog.service'
import { AdminBlogController } from './controllers/admin-blog.controller'
import { UserBlogController } from './controllers/user-blog.controller'
import { SharedModule } from '../shared/shared.module'
import { AuthModule } from '../auth/auth.module'
import { CategoryModule } from '../category/category.module'

@Module({
	imports: [
		TypeOrmModule.forFeature([Blog, UserCategory, Category]),
		SharedModule,
		AuthModule,
		CategoryModule,
	],
	controllers: [AdminBlogController, UserBlogController],
	providers: [BlogService],
	exports: [BlogService],
})
export class BlogModule { }

