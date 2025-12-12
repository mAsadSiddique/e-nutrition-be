import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm'
import { User } from '../../user/entities/user.entity'
import { Category } from '../../category/entites/category.entity'

@Entity('user_category')
@Unique(['userId', 'categoryId'])
export class UserCategory {
	@PrimaryGeneratedColumn()
	id: number

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date

	@ManyToOne((type) => Category, (category) => category.id)
	@JoinColumn({ name: 'category_id' })
	categoryId: Category
	
	@ManyToOne((type) => User, (user) => user.id)
	@JoinColumn({ name: 'user_id' })
	userId: User

	constructor(obj?) {
		if (obj) {
			Object.assign(this, obj)
		}
	}
}

