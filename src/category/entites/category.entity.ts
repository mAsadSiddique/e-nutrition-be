import { ApiProperty } from '@nestjs/swagger'
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('category')
export class Category {
	@PrimaryGeneratedColumn()
	id: number

	@ApiProperty({ description: 'From which name nwe category is added' })
	@Column({ name: 'name' })
	name: string

	@ApiProperty({ description: 'when you want to add new category as a child' })
	@Column({ name: 'parent_id', nullable: true })
	parentId: number

	@Column({ name: 'is_hot', default: false })
	isHot: boolean

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date

	constructor(obj?) {
		if (obj) {
			Object.assign(this, obj)
		}
	}
}
