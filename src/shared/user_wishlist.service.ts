import {Injectable} from '@nestjs/common'
import {UserWishlist} from './entities/user_wihshlist.entity'
import {SharedService} from './shared.service'
import {User} from 'src/user/entities/user.entity'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import { UserWishlistType } from 'src/utils/types/user_wishlist.type'

@Injectable()
export class UserWishlistService {
	// This service can be used to manage user wishlists, such as adding or removing items.
	// It can also include methods to retrieve a user's wishlist or check if an item is in the wishlist.

	constructor(
		@InjectRepository(UserWishlist)
		private readonly userWishlistRepo: Repository<UserWishlist>,
		private readonly sharedService: SharedService
	) {}

	/**
	 * Toggles a single tasker/taskerService/task ID in the user's wishlist.
	 * If the ID exists in the wishlist, it will be removed. If it doesn't exist, it will be added.
	 * Uses upsert to insert or update based on userId.
	 */
	async userWishlistToggle(id: number, user: User, type: UserWishlistType) {
		try {
			// Fetch existing wishlist or create a new one
			const wishlist = (await this.getUserWishlistByUserId(user.id)) || new UserWishlist()
			wishlist.userId = user

			// Handle blog wishlist logic
			if (type === 'blog') {
				const currentWishlist = wishlist.blogsWishlist || []

				if (currentWishlist.includes(id)) {
					// Remove if exists
					wishlist.blogsWishlist = currentWishlist.filter((itemId) => itemId !== id)
				} else {
					// Add if doesn't exist
					wishlist.blogsWishlist = [...currentWishlist, id]
				}
			}

			// Handle category wishlist logic
			if (type === 'category') {
				const currentWishlist = wishlist.categoriesWishlist || []

				if (currentWishlist.includes(id)) {
					// Remove if exists
					wishlist.categoriesWishlist = currentWishlist.filter((itemId) => itemId !== id)
				} else {
					// Add if doesn't exist
					wishlist.categoriesWishlist = [...currentWishlist, id]
				}
			}

			// Upsert the wishlist based on userId
			await this.userWishlistRepo.upsert([wishlist], ['userId'])
			return {blogsWishlist: wishlist.blogsWishlist, categoriesWishlist: wishlist.categoriesWishlist}
		} catch (error) {
			this.sharedService.sendError(error, this.userWishlistToggle.name)
		}
	}

		/**
	 * Toggles a single tasker/taskerService/task ID in the user's wishlist.
	 * If the ID exists in the wishlist, it will be removed. If it doesn't exist, it will be added.
	 * Uses upsert to insert or update based on userId.
	 */
	async userWishlist(ids: number[], user: User, type: UserWishlistType) {
		try {
			// Fetch existing wishlist or create a new one
			const wishlist = (await this.getUserWishlistByUserId(user.id)) || new UserWishlist()
			wishlist.userId = user
			// Handle category wishlist logic
			if (type === 'category') {
				wishlist.categoriesWishlist = ids
			}

			// Upsert the wishlist based on userId
			await this.userWishlistRepo.upsert([wishlist], ['userId'])
			return {blogsWishlist: wishlist.blogsWishlist, categoriesWishlist: wishlist.categoriesWishlist}
		} catch (error) {
			this.sharedService.sendError(error, this.userWishlist.name)
		}
	}

	async getUserWishlistByUserId(userId: number) {
		try {
			const userWishlist = await this.userWishlistRepo.findOne({
				where: {userId: {id: userId}},
				select: {id: true, blogsWishlist: true, categoriesWishlist: true},
			})
			let responseToSend
			if (userWishlist) {
				const {id, ...res} = userWishlist
				responseToSend = res
			}
			return responseToSend
		} catch (error) {
			this.sharedService.sendError(error, this.getUserWishlistByUserId.name)
		}
	}
}
