import {Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn} from 'typeorm'
import {User} from '../../user/entities/user.entity'
/**
 * This entity represents a user's wishlist, which can include taskers and tasker services.
 * It is used to store the IDs of taskers and services that a user has marked as favorites.
 */
@Unique(`unique_user_id`, ['userId'])
@Index('index_user_id', ['userId'])
@Entity('user_wishlist')
export class UserWishlist {
	@PrimaryGeneratedColumn()
	id!: number

	@Column({name: 'blogs_wishlist', type: 'int', array: true, nullable: true})
	blogsWishlist?: number[]

	@Column({name: 'categories_wishlist', type: 'int', array: true, nullable: true})
	categoriesWishlist?: number[]

	@CreateDateColumn({name: 'created_at'})
	createdAt!: Date

	@UpdateDateColumn({name: 'updated_at'})
	updatedAt!: Date

	@ManyToOne((type) => User, (user) => user.id)
	@JoinColumn({name: 'user_id'})
	userId!: User

	constructor(obj?) {
		if (obj) {
			Object.assign(this, obj)
		}
	}
}
