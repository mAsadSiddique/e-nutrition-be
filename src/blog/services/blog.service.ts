import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In } from 'typeorm'
import { Blog, BlogStatus } from '../entities/blog.entity'
import { UserCategory } from '../entities/user-category.entity'
import { Category } from '../../category/entites/category.entity'
import { CreateBlogDTO } from '../dtos/create-blog.dto'
import { UpdateBlogDTO } from '../dtos/update-blog.dto'
import { BlogListingDTO } from '../dtos/blog-listing.dto'
import { SelectCategoriesDTO } from '../dtos/select-categories.dto'
import { ExceptionService } from '../../shared/exception.service'
import { SharedService } from '../../shared/shared.service'
import { CategoryService } from '../../category/category.service'
import { RESPONSE_MESSAGES } from '../../utils/enums/response-messages.enum'
import { generateSlug } from '../../utils/utils'
import { CategoryEntitiesEnum } from '../../utils/enums/category-entities.enum'

@Injectable()
export class BlogService {
	constructor(
		@InjectRepository(Blog)
		private readonly blogRepo: Repository<Blog>,
		@InjectRepository(UserCategory)
		private readonly userCategoryRepo: Repository<UserCategory>,
		@InjectRepository(Category)
		private readonly categoryRepo: Repository<Category>,
		private readonly exceptionService: ExceptionService,
		private readonly sharedService: SharedService,
		private readonly categoryService: CategoryService
	) { }

	async createBlog(args: CreateBlogDTO, adminId: number, featuredImage?: Express.Multer.File, images?: Express.Multer.File[], videos?: Express.Multer.File[]) {
		try {
			// Validate category exists
			const category = await this.categoryService.getCategoryById(args.categoryId, CategoryEntitiesEnum.CATEGORY)
			if (!category) {
				this.exceptionService.sendNotFoundException(RESPONSE_MESSAGES.CATEGORY_NOT_FOUND)
			}

			// Generate slug if not provided
			let slug = args.slug || generateSlug(args.title)
			
			// Check if slug already exists
			const existingBlog = await this.blogRepo.findOne({ where: { slug } })
			if (existingBlog) {
				slug = `${slug}-${Date.now()}`
			}

			// Upload featured image if provided
			let featuredImageKey: string = null
			if (featuredImage) {
				featuredImageKey = await this.sharedService.uploadFileToS3Bucket(featuredImage)
			}

			// Upload images if provided
			let imageKeys: string[] = []
			if (images && images.length > 0) {
				const uploadPromises = images.map(image => this.sharedService.uploadFileToS3Bucket(image))
				imageKeys = await Promise.all(uploadPromises)
			}

			// Upload videos if provided
			let videoKeys: string[] = []
			if (videos && videos.length > 0) {
				const uploadPromises = videos.map(video => this.sharedService.uploadFileToS3Bucket(video))
				videoKeys = await Promise.all(uploadPromises)
			}

			// Validate category is required for publishing
			if (args.status === BlogStatus.PUBLISHED && !args.categoryId) {
				this.exceptionService.sendNotAcceptableException(RESPONSE_MESSAGES.CATEGORY_REQUIRED_FOR_BLOG)
			}

			const blog = new Blog({
				title: args.title,
				content: args.content,
				excerpt: args.excerpt || args.content.substring(0, 200),
				categoryId: args.categoryId,
				adminId,
				status: args.status || BlogStatus.DRAFT,
				slug,
				featuredImageKey,
				imageKeys: imageKeys.length > 0 ? imageKeys : null,
				videoKeys: videoKeys.length > 0 ? videoKeys : null,
				publishedAt: args.status === BlogStatus.PUBLISHED ? new Date() : null
			})

			const savedBlog = await this.blogRepo.save(blog)
			const blogWithRelations = await this.blogRepo.findOne({
				where: { id: savedBlog.id },
				relations: ['category', 'admin']
			})

			// Generate URLs for media
			const blogResponse = await this.enrichBlogWithMediaUrls(blogWithRelations)

			return this.sharedService.sendResponse(RESPONSE_MESSAGES.BLOG_CREATED, blogResponse)
		} catch (error) {
			this.sharedService.sendError(error, this.createBlog.name)
		}
	}

	async updateBlog(args: UpdateBlogDTO, adminId: number, featuredImage?: Express.Multer.File, images?: Express.Multer.File[], videos?: Express.Multer.File[]) {
		try {
			const blog = await this.blogRepo.findOne({ where: { id: args.id } })
			if (!blog) {
				this.exceptionService.sendNotFoundException(RESPONSE_MESSAGES.BLOG_NOT_FOUND)
			}

			// Check if admin owns this blog
			if (blog.adminId !== adminId) {
				this.exceptionService.sendForbiddenException('You are not authorized to update this blog')
			}

			// Validate category if provided
			if (args.categoryId) {
				const category = await this.categoryService.getCategoryById(args.categoryId, CategoryEntitiesEnum.CATEGORY)
				if (!category) {
					this.exceptionService.sendNotFoundException(RESPONSE_MESSAGES.CATEGORY_NOT_FOUND)
				}
				blog.categoryId = args.categoryId
			}

			// Validate category is required for publishing
			if (args.status === BlogStatus.PUBLISHED && !blog.categoryId) {
				this.exceptionService.sendNotAcceptableException(RESPONSE_MESSAGES.CATEGORY_REQUIRED_FOR_BLOG)
			}

			// Update fields
			if (args.title) {
				blog.title = args.title
				// Regenerate slug if title changed
				if (!args.slug) {
					blog.slug = generateSlug(args.title)
					// Check if slug exists
					const existingBlog = await this.blogRepo.findOne({ where: { slug: blog.slug } })
					if (existingBlog && existingBlog.id !== blog.id) {
						blog.slug = `${blog.slug}-${Date.now()}`
					}
				}
			}

			if (args.slug) {
				// Check if slug already exists
				const existingBlog = await this.blogRepo.findOne({ where: { slug: args.slug } })
				if (existingBlog && existingBlog.id !== blog.id) {
					this.exceptionService.sendConflictException(RESPONSE_MESSAGES.BLOG_SLUG_ALREADY_EXIST)
				}
				blog.slug = args.slug
			}

			if (args.content) blog.content = args.content
			if (args.excerpt) blog.excerpt = args.excerpt
			if (args.status) {
				blog.status = args.status
				if (args.status === BlogStatus.PUBLISHED && !blog.publishedAt) {
					blog.publishedAt = new Date()
				}
			}

			// Handle featured image update
			if (featuredImage) {
				// Delete old featured image if exists
				if (blog.featuredImageKey) {
					await this.sharedService.deleteFileFromS3Bucket(blog.featuredImageKey)
				}
				blog.featuredImageKey = await this.sharedService.uploadFileToS3Bucket(featuredImage)
			}

			// Handle images update
			if (images && images.length > 0) {
				// Delete old images if exist
				if (blog.imageKeys && blog.imageKeys.length > 0) {
					const deletePromises = blog.imageKeys.map(key => this.sharedService.deleteFileFromS3Bucket(key))
					await Promise.all(deletePromises)
				}
				const uploadPromises = images.map(image => this.sharedService.uploadFileToS3Bucket(image))
				blog.imageKeys = await Promise.all(uploadPromises)
			}

			// Handle videos update
			if (videos && videos.length > 0) {
				// Delete old videos if exist
				if (blog.videoKeys && blog.videoKeys.length > 0) {
					const deletePromises = blog.videoKeys.map(key => this.sharedService.deleteFileFromS3Bucket(key))
					await Promise.all(deletePromises)
				}
				const uploadPromises = videos.map(video => this.sharedService.uploadFileToS3Bucket(video))
				blog.videoKeys = await Promise.all(uploadPromises)
			}

			const updatedBlog = await this.blogRepo.save(blog)
			const blogWithRelations = await this.blogRepo.findOne({
				where: { id: updatedBlog.id },
				relations: ['category', 'admin']
			})

			const blogResponse = await this.enrichBlogWithMediaUrls(blogWithRelations)

			return this.sharedService.sendResponse(RESPONSE_MESSAGES.BLOG_UPDATED, blogResponse)
		} catch (error) {
			this.sharedService.sendError(error, this.updateBlog.name)
		}
	}

	async deleteBlog(id: number, adminId: number) {
		try {
			const blog = await this.blogRepo.findOne({ where: { id } })
			if (!blog) {
				this.exceptionService.sendNotFoundException(RESPONSE_MESSAGES.BLOG_NOT_FOUND)
			}

			// Check if admin owns this blog
			if (blog.adminId !== adminId) {
				this.exceptionService.sendForbiddenException('You are not authorized to delete this blog')
			}

			// Delete media files from S3
			const deletePromises: Promise<any>[] = []
			
			if (blog.featuredImageKey) {
				deletePromises.push(this.sharedService.deleteFileFromS3Bucket(blog.featuredImageKey))
			}

			if (blog.imageKeys && blog.imageKeys.length > 0) {
				blog.imageKeys.forEach(key => {
					deletePromises.push(this.sharedService.deleteFileFromS3Bucket(key))
				})
			}

			if (blog.videoKeys && blog.videoKeys.length > 0) {
				blog.videoKeys.forEach(key => {
					deletePromises.push(this.sharedService.deleteFileFromS3Bucket(key))
				})
			}

			await Promise.all(deletePromises)

			await this.blogRepo.remove(blog)
			return this.sharedService.sendResponse(RESPONSE_MESSAGES.BLOG_DELETED)
		} catch (error) {
			this.sharedService.sendError(error, this.deleteBlog.name)
		}
	}

	async getBlogById(id: number) {
		try {
			const blog = await this.blogRepo.findOne({
				where: { id },
				relations: ['category', 'admin']
			})

			if (!blog) {
				this.exceptionService.sendNotFoundException(RESPONSE_MESSAGES.BLOG_NOT_FOUND)
			}

			// Increment view count
			blog.viewsCount = (blog.viewsCount || 0) + 1
			await this.blogRepo.save(blog)

			const blogResponse = await this.enrichBlogWithMediaUrls(blog)
			return this.sharedService.sendResponse(RESPONSE_MESSAGES.SUCCESS, blogResponse)
		} catch (error) {
			this.sharedService.sendError(error, this.getBlogById.name)
		}
	}

	async listBlogs(args: BlogListingDTO) {
		try {
			const { page = 1, limit = 10, categoryId, status, search, id } = args
			const skip = (page - 1) * limit

			if (id) {
				const blog = await this.blogRepo.findOne({
					where: { id },
					relations: ['category', 'admin']
				})
				const blogResponse = blog ? await this.enrichBlogWithMediaUrls(blog) : null
				return this.sharedService.sendResponse(RESPONSE_MESSAGES.BLOG_LISTING, {
					blogs: blogResponse ? [blogResponse] : [],
					total: blogResponse ? 1 : 0,
					page,
					limit
				})
			}

			const queryBuilder = this.blogRepo.createQueryBuilder('blog')
				.leftJoinAndSelect('blog.category', 'category')
				.leftJoinAndSelect('blog.admin', 'admin')

			if (categoryId) {
				queryBuilder.where('blog.categoryId = :categoryId', { categoryId })
			}

			if (status) {
				queryBuilder.andWhere('blog.status = :status', { status })
			}

			if (search) {
				queryBuilder.andWhere(
					'(blog.title LIKE :search OR blog.content LIKE :search OR blog.excerpt LIKE :search)',
					{ search: `%${search}%` }
				)
			}

			queryBuilder
				.orderBy('blog.createdAt', 'DESC')
				.skip(skip)
				.take(limit)

			const [blogs, total] = await queryBuilder.getManyAndCount()

			// Enrich blogs with media URLs
			const enrichedBlogs = await Promise.all(
				blogs.map(blog => this.enrichBlogWithMediaUrls(blog))
			)

			return this.sharedService.sendResponse(RESPONSE_MESSAGES.BLOG_LISTING, {
				blogs: enrichedBlogs,
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit)
			})
		} catch (error) {
			this.sharedService.sendError(error, this.listBlogs.name)
		}
	}

	async publishBlog(id: number, adminId: number) {
		try {
			const blog = await this.blogRepo.findOne({ where: { id } })
			if (!blog) {
				this.exceptionService.sendNotFoundException(RESPONSE_MESSAGES.BLOG_NOT_FOUND)
			}

			// Check if admin owns this blog
			if (blog.adminId !== adminId) {
				this.exceptionService.sendForbiddenException('You are not authorized to publish this blog')
			}

			if (!blog.categoryId) {
				this.exceptionService.sendNotAcceptableException(RESPONSE_MESSAGES.CATEGORY_REQUIRED_FOR_BLOG)
			}

			blog.status = BlogStatus.PUBLISHED
			if (!blog.publishedAt) {
				blog.publishedAt = new Date()
			}

			const updatedBlog = await this.blogRepo.save(blog)
			const blogWithRelations = await this.blogRepo.findOne({
				where: { id: updatedBlog.id },
				relations: ['category', 'admin']
			})

			const blogResponse = await this.enrichBlogWithMediaUrls(blogWithRelations)

			return this.sharedService.sendResponse(RESPONSE_MESSAGES.BLOG_PUBLISHED, blogResponse)
		} catch (error) {
			this.sharedService.sendError(error, this.publishBlog.name)
		}
	}

	async selectCategories(args: SelectCategoriesDTO, userId: number) {
		try {
			// Remove duplicates from category IDs
			const uniqueCategoryIds = [...new Set(args.categoryIds)]

			// Validate categories exist
			const categories = await this.categoryRepo.find({
				where: { id: In(uniqueCategoryIds) }
			})

			if (categories.length !== uniqueCategoryIds.length) {
				this.exceptionService.sendNotFoundException(RESPONSE_MESSAGES.CATEGORY_NOT_FOUND)
			}

			// Delete existing user categories
			await this.userCategoryRepo.delete({ userId })

			// Insert new user categories
			const userCategories = uniqueCategoryIds.map(categoryId => ({
				userId,
				categoryId
			}))

			await this.userCategoryRepo.save(userCategories)

			return this.sharedService.sendResponse(RESPONSE_MESSAGES.CATEGORIES_SELECTED, { categoryIds: uniqueCategoryIds })
		} catch (error) {
			this.sharedService.sendError(error, this.selectCategories.name)
		}
	}

	async getUserSelectedCategories(userId: number) {
		try {
			const userCategories = await this.userCategoryRepo.find({
				where: { userId },
				relations: ['category']
			})

			const categories = userCategories.map(uc => ({
				id: uc.category.id,
				name: uc.category.name,
				parentId: uc.category.parentId
			}))

			return this.sharedService.sendResponse(RESPONSE_MESSAGES.USER_CATEGORIES_LISTING, { categories })
		} catch (error) {
			this.sharedService.sendError(error, this.getUserSelectedCategories.name)
		}
	}

	async getUserBlogs(userId: number, page: number = 1, limit: number = 10, categoryId?: number) {
		try {
			const skip = (page - 1) * limit

			// Get user's selected categories
			const userCategories = await this.userCategoryRepo.find({
				where: { userId },
				select: ['categoryId']
			})

			if (userCategories.length === 0) {
				return this.sharedService.sendResponse(RESPONSE_MESSAGES.BLOG_LISTING, {
					blogs: [],
					total: 0,
					page,
					limit,
					totalPages: 0
				})
			}

			const userCategoryIds = userCategories.map(uc => uc.categoryId)

			const queryBuilder = this.blogRepo.createQueryBuilder('blog')
				.leftJoinAndSelect('blog.category', 'category')
				.leftJoinAndSelect('blog.admin', 'admin')
				.where('blog.status = :status', { status: BlogStatus.PUBLISHED })
				.andWhere('blog.categoryId IN (:...categoryIds)', { categoryIds: userCategoryIds })

			if (categoryId) {
				queryBuilder.andWhere('blog.categoryId = :categoryId', { categoryId })
			}

			queryBuilder
				.orderBy('blog.publishedAt', 'DESC')
				.skip(skip)
				.take(limit)

			const [blogs, total] = await queryBuilder.getManyAndCount()

			// Enrich blogs with media URLs
			const enrichedBlogs = await Promise.all(
				blogs.map(blog => this.enrichBlogWithMediaUrls(blog))
			)

			return this.sharedService.sendResponse(RESPONSE_MESSAGES.BLOG_LISTING, {
				blogs: enrichedBlogs,
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit)
			})
		} catch (error) {
			this.sharedService.sendError(error, this.getUserBlogs.name)
		}
	}

	private async enrichBlogWithMediaUrls(blog: Blog) {
		const blogResponse: any = { ...blog }

		// Get featured image URL
		if (blog.featuredImageKey) {
			blogResponse.featuredImageUrl = await this.sharedService.getFileFromS3Bucket(blog.featuredImageKey)
		}

		// Get image URLs
		if (blog.imageKeys && blog.imageKeys.length > 0) {
			const imageUrlPromises = blog.imageKeys.map(key => this.sharedService.getFileFromS3Bucket(key))
			blogResponse.imageUrls = await Promise.all(imageUrlPromises)
		} else {
			blogResponse.imageUrls = []
		}

		// Get video URLs
		if (blog.videoKeys && blog.videoKeys.length > 0) {
			const videoUrlPromises = blog.videoKeys.map(key => this.sharedService.getFileFromS3Bucket(key))
			blogResponse.videoUrls = await Promise.all(videoUrlPromises)
		} else {
			blogResponse.videoUrls = []
		}

		// Remove keys from response (only send URLs)
		delete blogResponse.featuredImageKey
		delete blogResponse.imageKeys
		delete blogResponse.videoKeys

		return blogResponse
	}
}

