import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ExceptionService } from '../shared/exception.service'
import { SharedService } from '../shared/shared.service'
import { RESPONSE_MESSAGES } from '../utils/enums/response-messages.enum'
import { DataSource, In, Repository } from 'typeorm'
import { Category } from './entites/category.entity'
import { CreateCategoryDTO } from './dtos/create-category.dto'
import { UpdateCategoryDTO } from './dtos/update-category.dto'
import { CategoryListingDTO } from './dtos/category-listing.dto'
import { CategoryEntitiesEnum } from 'src/utils/enums/category-entities.enum'
import { IdDTO } from 'src/shared/dto/id.dto'
import { User } from 'src/user/entities/user.entity'
import { UserWishlistService } from 'src/shared/user_wishlist.service'

@Injectable()
export class CategoryService {
	constructor(
		@InjectRepository(Category)
		private readonly categoryRepo: Repository<Category>,
		private readonly exceptionService: ExceptionService,
		private readonly sharedService: SharedService,
		private readonly dataSource: DataSource,
		private readonly userWishlistService: UserWishlistService
	) { }
	private categoriesCache: unknown
	private productCategoriesCache: unknown

	async createCategory(args: CreateCategoryDTO, entity: CategoryEntitiesEnum) {
		try {
			const repo = await this.getRepoObjByEntityName(entity)
		
			let categoryToInsert: Category
			let categoriesToBeReturn: {id: number,name: string, children:[] }[] = []

			if (repo) {
				const existing = await repo.findOne({ where: { name: args.name } })
				if (existing) {
					this.exceptionService.sendConflictException(`${RESPONSE_MESSAGES.CATEGORY_ALREADY_EXIST_WITH_NAME}: ${args.name}`)
				}
				if (args.parentId) {
					const parentCategory = await repo.findOne({ where: { id: args.parentId } })
					if (!parentCategory) this.exceptionService.sendNotFoundException(RESPONSE_MESSAGES.PARENT_CATEGORY_NOT_FOUND)
				}
				if (entity === CategoryEntitiesEnum.CATEGORY) {
					categoryToInsert = new Category(args)
					await repo.insert(categoryToInsert)
					categoriesToBeReturn = this.categoriesCache = await this.fetchCategories(entity) as any
				} else {
					// categoryToInsert = new ProductCategory(args)
					// await repo.insert(categoryToInsert)
					// categoriesToBeReturn = this.productCategoriesCache = await this.fetchCategories(entity) as any
				}
			}
			return this.sharedService.sendResponse(RESPONSE_MESSAGES.CATEGORY_REGISTERED, categoriesToBeReturn)
		} catch (error) {
			this.sharedService.sendError(error, this.createCategory.name)
		}
	}

	async updateCategory(args: UpdateCategoryDTO, entity: CategoryEntitiesEnum) {
		try {
			const repo = await this.getRepoObjByEntityName(entity)
			let categoriesToBeReturn: { id: number, name: string, children: [] }[] = []
			if (repo) {
				const category = await repo.findOne({ where: { id: args.id } })

				if (!category) this.exceptionService.sendNotFoundException(RESPONSE_MESSAGES.CATEGORY_NOT_FOUND)
				const existing = await repo.findOne({ where: { name: args.name } })
				if (existing && existing.name !== category.name) {
					this.exceptionService.sendConflictException(`${RESPONSE_MESSAGES.CATEGORY_ALREADY_EXIST_WITH_NAME}: ${args.name}`)
				}

				Object.assign(category, args)
				await repo.update(category.id, category)
				if (entity === CategoryEntitiesEnum.CATEGORY) {
					categoriesToBeReturn = this.categoriesCache = await this.fetchCategories(entity) as any
				} else {
					categoriesToBeReturn = this.productCategoriesCache = await this.fetchCategories(entity) as any
				}
			}
			return this.sharedService.sendResponse(RESPONSE_MESSAGES.CATEGORY_UPDATED, categoriesToBeReturn)
		} catch (error) {
			this.sharedService.sendError(error, this.updateCategory.name)
		}
	}

	async categoryListing(args: CategoryListingDTO, entity: CategoryEntitiesEnum) {
		try {
			let categoriesToReturn
			const repo = await this.getRepoObjByEntityName(entity)
			if (args.id) {
				categoriesToReturn = repo?  await repo.findOne({
					where: { id: args.id },
				}) : undefined
			} else {
				if (entity === CategoryEntitiesEnum.CATEGORY) {
					this.categoriesCache
						? (categoriesToReturn = this.categoriesCache)
						: (this.categoriesCache = categoriesToReturn = await this.fetchCategories(entity))
				} else {
					this.productCategoriesCache
						? (categoriesToReturn = this.productCategoriesCache)
						: (this.productCategoriesCache = categoriesToReturn = await this.fetchCategories(entity))
				}
			}
			return this.sharedService.sendResponse(RESPONSE_MESSAGES.CATEGORIES_LISTING, categoriesToReturn)
		} catch (error) {
			this.sharedService.sendError(error, this.categoryListing.name)
		}
	}

	async listHotCategories() {
		try {
			// TODO: will implement the cache when our admin portal is live
			const hotCategories = await this.categoryRepo.find({
				select: { id: true, name: true },
				where: { isHot: true },
				order: { name: 'ASC' }
			})
			return this.sharedService.sendResponse(RESPONSE_MESSAGES.CATEGORIES_LISTING, { hotCategories })

		} catch (error) {
			this.sharedService.sendError(error, this.listHotCategories.name)
		}
	}

	async removeCategory(id: number, entity: CategoryEntitiesEnum) {
		try {
			const repo = await this.getRepoObjByEntityName(entity)
			const category = repo? await repo.findOne({ where: { id } }): undefined

			if (!category) this.exceptionService.sendNotFoundException(RESPONSE_MESSAGES.CATEGORY_NOT_FOUND)

			const categoriesToBeDeleted = [id]
			let runnable = true
			let temporaryCategoryHolder = await this.getSubCategories([id], entity) as any

			do {
				if (temporaryCategoryHolder.length) {
					categoriesToBeDeleted.push(...temporaryCategoryHolder)
					temporaryCategoryHolder = await this.getSubCategories(temporaryCategoryHolder, entity)
				} else runnable = false
			} while (runnable)

			repo? await repo.delete({ id: In(categoriesToBeDeleted) }) : null
			if (entity === CategoryEntitiesEnum.CATEGORY) {
				this.categoriesCache = await this.fetchCategories(entity)
			} else {
				this.productCategoriesCache = await this.fetchCategories(entity)
			}
			return this.sharedService.sendResponse(RESPONSE_MESSAGES.CATEGORY_DELETED)
		} catch (error) {
			this.sharedService.sendError(error, this.removeCategory.name)
		}
	}

	private async fetchCategories(entity: CategoryEntitiesEnum) {
		try {
			const categoriesToReturn: {id: number,name: string, children:[] }[] = []
			const repo = await this.getRepoObjByEntityName(entity)
			const categories = repo?  await repo.find({
				order: { parentId: { direction: 'DESC', nulls: 'LAST' }, id: 'DESC' },
			}) : []
			for (const category of categories) {
				if (category.parentId) {
					const parentCategoryIndex = categories.findIndex(cat => cat.id === category.parentId)
					categories[parentCategoryIndex]['children']
						? categories[parentCategoryIndex]['children'].push({
							id: category.id,
							name: category.name,
							children: category['children'],
						})
						: (categories[parentCategoryIndex]['children'] = [
							{ id: category.id, name: category.name, children: category['children'] },
						])
				} else {
					categoriesToReturn.push({
						id: category.id,
						name: category.name,
						children: category['children'],
					})
				}
			}
			return categoriesToReturn
		} catch (error) {
			this.sharedService.sendError(error, this.fetchCategories.name)
		}
	}

	private async getSubCategories(ids: number[], entity: CategoryEntitiesEnum) {
		try {
			const categoryToBeDeleted: number[] = []
			const repo = await this.getRepoObjByEntityName(entity)
			if (repo) {
				const subCategories = await repo.find({ where: { parentId: In(ids) }, select: { id: true } })
				if (subCategories) {
					for (const element of subCategories) {
						categoryToBeDeleted.push(element.id)
					}
				}
			}
			return categoryToBeDeleted
		} catch (error) {
			this.sharedService.sendError(error, this.getSubCategories.name)
		}
	}

	async getCategoryById(id: number, entity: CategoryEntitiesEnum) {
		try {
			const repo = await this.getRepoObjByEntityName(entity)
			return repo? await repo.findOne({ where: { id } }): undefined
		} catch (error) {
			this.sharedService.sendError(error, this.getCategoryById.name)
		}
	}

	async getAllChildCategoreisByParentId(id: number, entity: CategoryEntitiesEnum) {
		try {
			const parentIds = [id]
			let idsToReturn = [id]
			for (let index = 0; index < parentIds.length; index++) {
				const parentId = parentIds.pop()
				const repo = await this.getRepoObjByEntityName(entity)
				const categoris = repo? await repo.findBy({ parentId: parentId }): []
				categoris.forEach(categoty => {
					idsToReturn.push(categoty.id)
					parentIds.push(categoty.id)
				})
			}
			return idsToReturn
		} catch (error) {
			this.sharedService.sendError(error, this.getAllChildCategoreisByParentId.name)
		}
	}

	async getRepoObjByEntityName(entity: CategoryEntitiesEnum) {
		try {
			return this.dataSource.getRepository(entity)
		} catch (error) {
			this.sharedService.sendError(error, this.getRepoObjByEntityName.name)
		}
	}

	async userWishlistToggle(args: IdDTO, user: User) {
		try {
			const category = await this.categoryRepo.findOne({where: {id: args.id}})
			if (!category) this.exceptionService.sendNotFoundException(RESPONSE_MESSAGES.CATEGORY_NOT_FOUND)
			const userWishlist = await this.userWishlistService.userWishlistToggle(args.id, user, 'category')
			return this.sharedService.sendResponse(RESPONSE_MESSAGES.WISHLIST_UPDATED_SUCCESSFULLY, {userWishlist})
		} catch (error) {
			this.sharedService.sendError(error, this.userWishlistToggle.name)
		}
	}
}
