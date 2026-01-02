import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In } from 'typeorm'
import { Blog, BlogStatus } from '../entities/blog.entity'
import { UserCategory } from '../entities/user-category.entity'
import { Category } from '../../category/entites/category.entity'
import { CreateBlogDTO } from '../dtos/create-blog.dto'
import { UpdateBlogDTO } from '../dtos/update-blog.dto'
import { BlogListingDTO } from '../dtos/blog-listing.dto'
import { SelectCategoriesDTO } from '../dtos/select-categories.dto'
import { UserBlogListingDTO, BlogSortBy } from '../dtos/user-blog-listing.dto'
import { ExceptionService } from '../../shared/exception.service'
import { SharedService } from '../../shared/shared.service'
import { CategoryService } from '../../category/category.service'
import { RESPONSE_MESSAGES } from '../../utils/enums/response-messages.enum'
import { generateSlug } from '../../utils/utils'
import { User } from 'src/user/entities/user.entity'
import { IdDTO } from 'src/shared/dto/id.dto'
import { UserWishlistService } from 'src/shared/user_wishlist.service'
import { IdsDTO } from 'src/shared/dto/ids.dto'

@Injectable()
export class BlogService {

	private logger = new Logger(BlogService.name)
	constructor(
		@InjectRepository(Blog)
		private readonly blogRepo: Repository<Blog>,
		@InjectRepository(UserCategory)
		private readonly userCategoryRepo: Repository<UserCategory>,
		@InjectRepository(Category)
		private readonly categoryRepo: Repository<Category>,
		private readonly exceptionService: ExceptionService,
		private readonly sharedService: SharedService,
		private readonly categoryService: CategoryService,
		private readonly userWishlistService: UserWishlistService		
	) { }

	async createBlog(args: CreateBlogDTO, adminId: number, files: Array<Express.Multer.File>) {
		try {
			// Validate categories exist
			const uniqueCategoryIds = [...new Set(args.categoryIds)]
			const categories = await this.categoryRepo.find({
				where: { id: In(uniqueCategoryIds) }
			})

			if (categories.length !== uniqueCategoryIds.length) {
				this.exceptionService.sendNotFoundException(RESPONSE_MESSAGES.CATEGORY_NOT_FOUND)
			}

			// Validate category requirement for publishing
			if (args.status === BlogStatus.PUBLISHED && (!args.categoryIds || args.categoryIds.length === 0)) {
				if(!categories?.length)
					this.exceptionService.sendNotFoundException(`Invalid category ids: ${uniqueCategoryIds}`)
				categories.map(category => {
					if (!uniqueCategoryIds.includes(category.id)) {
						this.exceptionService.sendNotFoundException(`Invalid category id: ${category.id}`)
					}
				})
			}

			// Generate slug if not provided
			let slug = args.slug || generateSlug(args.title)
			
			// Check if slug already exists
			const existingBlog = await this.blogRepo.findOne({ where: { slug } })
			if (existingBlog) {
				slug = `${slug}-${Date.now()}`
			}

			// Upload featured image if provided

			// Process HTML content - extract base64 images and upload them
			// let processedContent = args.content
			// if (args.content) {
			// 	processedContent = await this.processHtmlContent(args.content)
			// }

			const blog = new Blog({
				title: args.title,
				content: args.content,
				excerpt: args.excerpt || this.extractExcerpt(args.content),
				adminId,
				status: args.status || BlogStatus.DRAFT,
				slug,
				seoTitle: args.seoTitle || args.title,
				seoDescription: args.seoDescription || args.excerpt || this.extractExcerpt(args.content),
				tags: args.tags || [],
				publishedAt: args.status === BlogStatus.PUBLISHED ? new Date() : null,
				categories: categories?.map(category => category.id) || null
			})

			if (Object.entries(files)?.length) {

				blog.media = {}
				const keys = await this.sharedService.uploadMultipleFileToS3Bucket(files, args.dims)
				blog.media = { images: await this.sharedService.getMultipleFilesFromS3Bucket(keys) }

				blog.mediaExpiredAt = new Date().setDate(new Date().getDate() + 6)
			}

			await this.blogRepo.insert(blog)

			// const blogResponse = await this.enrichBlogWithMediaUrls(blog)
			blog.categories = categories as any

			return this.sharedService.sendResponse(RESPONSE_MESSAGES.BLOG_CREATED, {blog})
		} catch (error) {
			this.sharedService.sendError(error, this.createBlog.name)
		}
	}

	async updateBlog(args: UpdateBlogDTO, adminId: number, files: Array<Express.Multer.File> ) {
		try {
			const blog = await this.blogRepo.findOne({ 
				where: { id: args.id },
				relations: {adminId: true}
			})
			if (!blog) {
				this.exceptionService.sendNotFoundException(RESPONSE_MESSAGES.BLOG_NOT_FOUND)
			}

			// Check if admin owns this blog
			if (blog.adminId?.id !== adminId) {
				this.exceptionService.sendForbiddenException('You are not authorized to update this blog')
			}

			// Validate categories if provided
			if (args.categoryIds?.length) {
				const uniqueCategoryIds = [...new Set(args.categoryIds)]
				const categories = await this.categoryRepo.find({
					where: { id: In(uniqueCategoryIds) }
				})

				if (categories.length !== uniqueCategoryIds.length) {
					if(!categories?.length)
					this.exceptionService.sendNotFoundException(`Invalid category ids: ${uniqueCategoryIds}`)
				
				categories.map(category => {
					if (!uniqueCategoryIds.includes(category.id)) {
						this.exceptionService.sendNotFoundException(`Invalid category id: ${category.id}`)
					}
				})
				}
				blog.categories = categories.map(category => category.id)
			}

			// Validate category requirement for publishing
			const newStatus = args.status || blog.status
			if (newStatus === BlogStatus.PUBLISHED) {
				const categoryIds = args.categoryIds || blog.categories || []
				if (categoryIds.length === 0) {
					this.exceptionService.sendNotAcceptableException(RESPONSE_MESSAGES.CATEGORY_REQUIRED_FOR_BLOG)
				}
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

			if (args.content) {
				blog.content = args.content
			}
			if (args.excerpt) blog.excerpt = args.excerpt
			if (args.seoTitle) blog.seoTitle = args.seoTitle
			if (args.seoDescription) blog.seoDescription = args.seoDescription
			if (args.tags) blog.tags = args.tags

			if (args.status) {
				blog.status = args.status
				if (args.status === BlogStatus.PUBLISHED && !blog.publishedAt) {
					blog.publishedAt = new Date()
					blog.unpublishedAt = null
				} else if (args.status === BlogStatus.UNPUBLISHED) {
					blog.unpublishedAt = new Date()
				} else if (args.status === BlogStatus.DRAFT) {
					blog.unpublishedAt = null
				}
			}

			// Handle media removal
			if (args.mediaToBeRemoved) {
				const bucketKeysToDelete: string[] = []
				// Remove images if specified
				if (args.mediaToBeRemoved.imageKeys?.length && Object.entries(blog.media?.images || {}).length) {
					const contentImagesKeys: { [key: string]: string } = {}
					Object.keys(blog.media?.images || {})?.map((key) => {
						contentImagesKeys[key.split('_')[0]] = key
					})
					args.mediaToBeRemoved.imageKeys.forEach((key) => {
						if (contentImagesKeys?.[key]) {
							bucketKeysToDelete.push(contentImagesKeys?.[key])
							delete blog.media?.images?.[contentImagesKeys?.[key]]
							this.logger.log(`Removed image key "${key}" from blog ${args.id}`, this.updateBlog.name)
						}
						if (blog.media?.images?.[key]) {
							bucketKeysToDelete.push(key)
							delete blog.media?.images?.[key]
							this.logger.log(`Removed image key "${key}" from blog ${args.id}`, this.updateBlog.name)
						}
					})
				}

				// Delete files from S3 if there are keys to remove
				if (bucketKeysToDelete.length) {
					await this.sharedService.deleteFilesFromS3Bucket(bucketKeysToDelete)
					this.logger.log(`Deleted ${bucketKeysToDelete.length} files from S3 for blog ${args.id}`, this.updateBlog.name)
				} else {
					this.exceptionService.sendBadRequestException(RESPONSE_MESSAGES.MEDIA_NOT_FOUND)
				}

				if (Object.entries(blog.media?.images || {}).length === 0) {
					blog.media = null
				}
			}

			// Process uploaded files (videos and images)
			if (Object.entries(files)?.length) {

				// Handle images upload
				if (Object.entries(files)?.length) {
					// Enforce max image limit (5)
					if (Object.entries(files)?.length + Object.entries(blog.media?.images || {})?.length > 5) {
						this.logger.error(`Image limit exceeded (current: ${Object.entries(blog.media?.images || {})?.length}, new: ${Object.entries(files)?.length})`, this.updateBlog.name)
						this.exceptionService.sendNotAcceptableException(RESPONSE_MESSAGES.IMAGE_LIMIT_EXCEEDED)
					}
					const fileKeys = Object.keys(files)
					const mediaImagesKeys = Object.keys(blog.media?.images || {})?.map(key => key.split('_')[0])
					fileKeys.map(key => {
						if (mediaImagesKeys.includes(key)) {
							this.exceptionService.sendConflictException(`Image with key: ${key} already exists in blog media`)
						}
					})
					// Upload new images
					const keys = await this.sharedService.uploadMultipleFileToS3Bucket(files, args.dims)
					const keyValues = await this.sharedService.getMultipleFilesFromS3Bucket(keys)
					blog.media = {...blog.media, images: {...blog.media?.images, ...keyValues}}
					this.logger.log(`Uploaded ${Object.entries(files)?.length} new images for task post ${args.id}`, this.updateBlog.name)
				}
				if (!blog.mediaExpiredAt) blog.mediaExpiredAt = new Date().setDate(new Date().getDate() + 6)
			}

			await this.blogRepo.update({id: blog.id}, blog)

			return this.sharedService.sendResponse(RESPONSE_MESSAGES.BLOG_UPDATED, {blog})
		} catch (error) {
			this.sharedService.sendError(error, this.updateBlog.name)
		}
	}

	async deleteBlog(id: number, adminId: number) {
		try {
			const blog = await this.blogRepo.findOne({ where: { id } , relations: {adminId: true}})
			if (!blog) {
				this.exceptionService.sendNotFoundException(RESPONSE_MESSAGES.BLOG_NOT_FOUND)
			}

			// Check if admin owns this blog
			if (blog.adminId?.id !== adminId) {
				this.exceptionService.sendForbiddenException('You are not authorized to delete this blog')
			}

			// Delete files from s3 bucket
			if (Object.entries(blog?.media?.images || {}).length) {
				const bucketKeys: string[] = Object.keys(blog.media?.images || {})?.map(key => key)
				if (bucketKeys.length) await this.sharedService.deleteFilesFromS3Bucket(bucketKeys)
			}

			await this.blogRepo.delete({id: blog.id})
			return this.sharedService.sendResponse(RESPONSE_MESSAGES.BLOG_DELETED)
		} catch (error) {
			this.sharedService.sendError(error, this.deleteBlog.name)
		}
	}

	async getBlogById(id: number) {
		try {
			const blog = await this.blogRepo.findOne({
				where: { id },
				relations: {adminId: true, categories: true}
			})

			if (!blog) {
				this.exceptionService.sendNotFoundException(RESPONSE_MESSAGES.BLOG_NOT_FOUND)
			}

			// Increment view count
			blog.viewsCount = (blog.viewsCount || 0) + 1
			await this.blogRepo.update({id: blog.id}, blog)

			// const blogResponse = await this.enrichBlogWithMediaUrls(blog)
			return this.sharedService.sendResponse(RESPONSE_MESSAGES.SUCCESS, blog)
		} catch (error) {
			this.sharedService.sendError(error, this.getBlogById.name)
		}
	}

	async listBlogs(args: BlogListingDTO) {
		try {
			const { pageNumber, pageSize, categoryId, status, search, fromDate, toDate, id, tags } = args
			const skip = (pageNumber) * pageSize

			const queryBuilder = this.blogRepo.createQueryBuilder('blog')
				.leftJoinAndSelect('blog.adminId', 'admin')
			
			if (id) {
				queryBuilder.andWhere('blog.id = :id', { id })
			}

			if (categoryId) {
				queryBuilder.andWhere('blog.categories @> :category', { category: JSON.stringify([categoryId]) })
			}

			if (status) {
				queryBuilder.andWhere('blog.status = :status', { status })
			}

			if (search) {
				queryBuilder.andWhere(
					'(blog.title LIKE :search OR blog.seoTitle LIKE :search OR blog.excerpt LIKE :search OR blog.seoDescription LIKE :search)',
					{ search: `%${search}%` }
				)
			}

			if (tags?.length) {
			  queryBuilder.andWhere(
			    tags
			      .map((_, index) => `blog.tags ILIKE :tag${index}`)
			      .join(' OR '),
			    tags.reduce((acc, tag, index) => {
			      acc[`tag${index}`] = `%${tag}%`
			      return acc
			    }, {}),
			  )
			}

			if (fromDate && toDate) {
				queryBuilder.andWhere('blog.createdAt BETWEEN :fromDate AND :toDate', {
					fromDate,
					toDate: new Date(new Date(toDate).setHours(23, 59, 59, 999))
				})
			} else if (fromDate) {
				queryBuilder.andWhere('blog.createdAt >= :fromDate', { fromDate })
			} else if (toDate) {
				queryBuilder.andWhere('blog.createdAt <= :toDate', {
					toDate: new Date(new Date(toDate).setHours(23, 59, 59, 999))
				})
			}

			queryBuilder
				.orderBy('blog.createdAt', 'DESC')
				.skip(skip)
				.take(pageSize)

			const [blogs, total] = await queryBuilder.getManyAndCount()

			if (args.id && blogs[0]?.categories?.length)
				blogs[0].categories = await this.categoryRepo.findBy({id: In(blogs[0]?.categories)}) as any

			// Enrich blogs with media URLs
			// const enrichedBlogs = await Promise.all(
			// 	blogs.map(blog => this.enrichBlogWithMediaUrls(blog))
			// )

			return this.sharedService.sendResponse(RESPONSE_MESSAGES.BLOG_LISTING, {total, blogs})
		} catch (error) {
			this.sharedService.sendError(error, this.listBlogs.name)
		}
	}

	async publishBlog(id: number, adminId: number) {
		try {
			const blog = await this.blogRepo.findOne({ 
				where: { id },
				relations: {adminId: true}
			})
			if (!blog) {
				this.exceptionService.sendNotFoundException(RESPONSE_MESSAGES.BLOG_NOT_FOUND)
			}

			// Check if admin owns this blog
			if (blog.adminId?.id !== adminId) {
				this.exceptionService.sendForbiddenException('You are not authorized to publish this blog')
			}

			if (!blog.categories || blog.categories.length === 0) {
				this.exceptionService.sendNotAcceptableException(RESPONSE_MESSAGES.CATEGORY_REQUIRED_FOR_BLOG)
			}

			blog.status = BlogStatus.PUBLISHED
			if (!blog.publishedAt) {
				blog.publishedAt = new Date()
			}
			blog.unpublishedAt = null

			await this.blogRepo.update({id: blog.id}, blog)
			

			return this.sharedService.sendResponse(RESPONSE_MESSAGES.BLOG_PUBLISHED, {blog})
		} catch (error) {
			this.sharedService.sendError(error, this.publishBlog.name)
		}
	}

	async unpublishBlog(id: number, adminId: number) {
		try {
			const blog = await this.blogRepo.findOne({ where: { id }, relations: {adminId: true} })
			if (!blog) {
				this.exceptionService.sendNotFoundException(RESPONSE_MESSAGES.BLOG_NOT_FOUND)
			}

			// Check if admin owns this blog
			if (blog.adminId?.id !== adminId) {
				this.exceptionService.sendForbiddenException('You are not authorized to unpublish this blog')
			}

			blog.status = BlogStatus.UNPUBLISHED
			blog.unpublishedAt = new Date()

			const updatedBlog = await this.blogRepo.save(blog)
			const blogWithRelations = await this.blogRepo.findOne({
				where: { id: updatedBlog.id },
				relations: ['categories', 'admin']
			})

			// const blogResponse = await this.enrichBlogWithMediaUrls(blogWithRelations)

			return this.sharedService.sendResponse(RESPONSE_MESSAGES.BLOG_UNPUBLISHED, {blog})
		} catch (error) {
			this.sharedService.sendError(error, this.unpublishBlog.name)
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
				if(!categories?.length)
					this.exceptionService.sendNotFoundException(`Invalid category ids: ${uniqueCategoryIds}`)
				
				categories.map(category => {
					if (!uniqueCategoryIds.includes(category.id)) {
						this.exceptionService.sendNotFoundException(`Invalid category id: ${category.id}`)
					}
				})
			}

			// Insert new user categories
			const userCategoriesToUpsert = categories.map(category => new UserCategory({
				userId,
				categoryId: category
			}))

			await this.userCategoryRepo.upsert(userCategoriesToUpsert, ['userId', 'categoryId'])

			return this.sharedService.sendResponse(RESPONSE_MESSAGES.CATEGORIES_SELECTED, { userCategories: userCategoriesToUpsert })
		} catch (error) {
			this.sharedService.sendError(error, this.selectCategories.name)
		}
	}

	async getUserSelectedCategories(userId: number) {
		try {
			const userCategories = await this.userCategoryRepo.find({
				where: { userId: {id: userId} },
				relations: {categoryId: true}
			})

			return this.sharedService.sendResponse(RESPONSE_MESSAGES.USER_CATEGORIES_LISTING, { userCategories })
		} catch (error) {
			this.sharedService.sendError(error, this.getUserSelectedCategories.name)
		}
	}

	async getUserBlogs( args: UserBlogListingDTO, user: User) {
		try {

			// Get user's selected categories
			// const userCategories = await this.userCategoryRepo.find({
			// 	where: { userId: {id: user.id} },
			// 	relations: {categoryId: true}
			// })

			// const userCategoryIds = userCategories?.map(uc => uc.categoryId?.id) || []

			const queryBuilder = this.blogRepo.createQueryBuilder('blog')
				.leftJoinAndSelect('blog.adminId', 'admin')
				.where('blog.status = :status', { status: BlogStatus.PUBLISHED })
				// .andWhere('categories.id IN (:...categoryIds)', { categoryIds: userCategoryIds })
			
			// Only add category filter if array is not empty
			// if (userCategoryIds.length > 0) {
			// 	queryBuilder.andWhere(`
  			// 	  	EXISTS (
  			// 	  	  SELECT 1
  			// 	  	  FROM jsonb_array_elements(blog.categories) AS c
  			// 	  	  WHERE c::int = ANY(:categoryIds)
  			// 	  	)`,
			// 		{ categoryIds: userCategoryIds }
			// 	)
			// }
			
			if (args.ids?.length) {
				queryBuilder.andWhere('blog.id IN (:...ids)', { ids: args.ids })
			} else if (args.id) {
				queryBuilder.andWhere('blog.id = :id', { id: args.id })
			}

			if (args.categoryIds?.length) {
				queryBuilder.andWhere(`
  			  	EXISTS (
  			  	  SELECT 1 
  			  	  FROM jsonb_array_elements(blog.categories) AS c
  			  	  WHERE c::int = ANY(:categoryIds)
  			  	)`,
				{ categoryIds: args.categoryIds }
				)
			}

			if(args.search) {
				queryBuilder.andWhere(
					'(blog.title LIKE :search OR blog.content LIKE :search OR blog.excerpt LIKE :search OR blog.seoTitle LIKE :search)',
					{ search: `%${args.search}%` }
				)
			}

			if (args.tags?.length) {
				queryBuilder.andWhere(
					`blog.tags LIKE ANY (ARRAY[:...tags])`,
					{
						tags: args.tags.map(tag => `%${tag}%`)
					}
				);
			}

			// Apply sorting
			if (args.sortBy) {
				queryBuilder.orderBy('blog.publishedAt', args.sortBy === BlogSortBy.NEW_TO_OLD ? 'DESC' : 'ASC')
			}

			queryBuilder
				.skip(args.pageNumber)
				.take(args.pageSize)

			const [blogs, total] = await queryBuilder.getManyAndCount()

			// Enrich blogs with categories if IDs are provided
			if ((args.ids?.length || args.id) && blogs.length > 0) {
				for (const blog of blogs) {
					if (blog.categories?.length) {
						blog.categories = await this.categoryRepo.findBy({id: In(blog.categories)}) as any
					}
				}
			}

			// Enrich blogs with media URLs
			// const enrichedBlogs = await Promise.all(
			// 	blogs.map(blog => this.enrichBlogWithMediaUrls(blog))
			// )

			return this.sharedService.sendResponse(RESPONSE_MESSAGES.BLOG_LISTING, {total,blogs})
		} catch (error) {
			this.sharedService.sendError(error, this.getUserBlogs.name)
		}
	}

	// private async processHtmlContent(content: string): Promise<string> {
	// 	// Extract base64 images from content and upload them to S3
	// 	const base64ImageRegex = /<img[^>]+src=["']data:image\/([^;]+);base64,([^"']+)["'][^>]*>/gi
	// 	let processedContent = content
	// 	let match

	// 	while ((match = base64ImageRegex.exec(content)) !== null) {
	// 		const imageType = match[1]
	// 		const base64Data = match[2]
			
	// 		try {
	// 			// Convert base64 to buffer
	// 			const buffer = Buffer.from(base64Data, 'base64')
				
	// 			// Create a mock file object for upload
	// 			const mockFile: Express.Multer.File = {
	// 				fieldname: 'image',
	// 				originalname: `image-${Date.now()}.${imageType}`,
	// 				encoding: '7bit',
	// 				mimetype: `image/${imageType}`,
	// 				buffer: buffer,
	// 				size: buffer.length,
	// 				destination: '',
	// 				filename: '',
	// 				path: ''
	// 			}

	// 			// Upload to S3
	// 			const key = await this.sharedService.uploadFileToS3Bucket(mockFile)
	// 			const url = await this.sharedService.getFileFromS3Bucket(key)

	// 			// Replace base64 image with S3 URL
	// 			processedContent = processedContent.replace(match[0], `<img src="${url}" alt="" />`)
	// 		} catch (error) {
	// 			// If upload fails, keep the original base64 image
	// 			console.error('Failed to upload base64 image:', error)
	// 		}
	// 	}

	// 	return processedContent
	// }

	private extractExcerpt(content: string, maxLength: number = 200): string {
		// Remove HTML tags for excerpt
		const textContent = content.replace(/<[^>]*>/g, '').trim()
		if (textContent.length <= maxLength) {
			return textContent
		}
		return textContent.substring(0, maxLength) + '...'
	}

	// private async enrichBlogWithMediaUrls(blog: Blog) {
	// 	const blogResponse: any = { ...blog }

	// 	// Get featured image URL
	// 	if (blog.featuredImageKey) {
	// 		blogResponse.featuredImageUrl = await this.sharedService.getFileFromS3Bucket(blog.featuredImageKey)
	// 	}

	// 	// Get image URLs
	// 	if (blog.imageKeys && blog.imageKeys.length > 0) {
	// 		const imageUrlPromises = blog.imageKeys.map(key => this.sharedService.getFileFromS3Bucket(key))
	// 		blogResponse.imageUrls = await Promise.all(imageUrlPromises)
	// 	} else {
	// 		blogResponse.imageUrls = []
	// 	}

	// 	// Get video URLs
	// 	if (blog.videoKeys && blog.videoKeys.length > 0) {
	// 		const videoUrlPromises = blog.videoKeys.map(key => this.sharedService.getFileFromS3Bucket(key))
	// 		blogResponse.videoUrls = await Promise.all(videoUrlPromises)
	// 	} else {
	// 		blogResponse.videoUrls = []
	// 	}

	// 	// Remove keys from response (only send URLs)
	// 	delete blogResponse.featuredImageKey
	// 	delete blogResponse.imageKeys
	// 	delete blogResponse.videoKeys

	// 	return blogResponse
	// }

	async getUserBlogCategories(userId: number) {
		try {
			// Get user's selected categories
			const userCategoriesWishlist = await this.userCategoryRepo.find({
				where: { userId: {id: userId} },
				relations: {categoryId: true}
			})

			const userCategories = userCategoriesWishlist?.map(uc => uc.categoryId) || []

			return userCategories
		} catch (error) {
			this.sharedService.sendError(error, this.getUserBlogCategories.name)
		}
	}

	async userWishlistToggle(args: IdDTO, user: User) {
		try {
			const blog = await this.blogRepo.findOne({where: {id: args.id}})
			if (!blog) this.exceptionService.sendNotFoundException(RESPONSE_MESSAGES.BLOG_NOT_FOUND)

			const userWishlist = await this.userWishlistService.userWishlistToggle(args.id, user, 'blog')
			return this.sharedService.sendResponse(RESPONSE_MESSAGES.WISHLIST_UPDATED_SUCCESSFULLY, {userWishlist})
		} catch (error) {
			this.sharedService.sendError(error, this.userWishlistToggle.name)
		}
	}
}

