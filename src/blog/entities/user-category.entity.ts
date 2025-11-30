import { ApiProperty } from '@nestjs/swagger'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { User } from '../../user/entities/user.entity'
import { Category } from '../../category/entites/category.entity'

@Entity('user_category')
@Unique(['userId', 'categoryId'])
export class UserCategory {
	@PrimaryGeneratedColumn()
	id: number

	@ApiProperty({ description: 'User ID' })
	@Column({ name: 'user_id' })
	userId: number

	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	user: User

	@ApiProperty({ description: 'Category ID' })
	@Column({ name: 'category_id' })
	categoryId: number

	@ManyToOne(() => Category)
	@JoinColumn({ name: 'category_id' })
	category: Category

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date

	constructor(obj?) {
		if (obj) {
			Object.assign(this, obj)
		}
	}
}

