import { ApiProperty } from '@nestjs/swagger'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Category } from '../../category/entites/category.entity'
import { Admin } from '../../admin/entities/admin.entity'

export enum BlogStatus {
	DRAFT = 'draft',
	PUBLISHED = 'published',
}

@Entity('blog')
export class Blog {
	@PrimaryGeneratedColumn()
	id: number

	@ApiProperty({ description: 'Blog title' })
	@Column({ name: 'title' })
	title: string

	@ApiProperty({ description: 'Blog content/body' })
	@Column({ name: 'content', type: 'text' })
	content: string

	@ApiProperty({ description: 'Blog excerpt/summary' })
	@Column({ name: 'excerpt', type: 'text', nullable: true })
	excerpt: string

	@ApiProperty({ description: 'Blog featured image' })
	@Column({ name: 'featured_image_key', nullable: true })
	featuredImageKey: string

	@ApiProperty({ description: 'Blog images array (JSON)' })
	@Column({ name: 'image_keys', type: 'simple-array', nullable: true })
	imageKeys: string[]

	@ApiProperty({ description: 'Blog videos array (JSON)' })
	@Column({ name: 'video_keys', type: 'simple-array', nullable: true })
	videoKeys: string[]

	@ApiProperty({ description: 'Blog category ID' })
	@Column({ name: 'category_id' })
	categoryId: number

	@ManyToOne(() => Category)
	@JoinColumn({ name: 'category_id' })
	category: Category

	@ApiProperty({ description: 'Admin who created the blog' })
	@Column({ name: 'admin_id' })
	adminId: number

	@ManyToOne(() => Admin)
	@JoinColumn({ name: 'admin_id' })
	admin: Admin

	@ApiProperty({ description: 'Blog status (draft/published)' })
	@Column({ name: 'status', type: 'enum', enum: BlogStatus, default: BlogStatus.DRAFT })
	status: BlogStatus

	@ApiProperty({ description: 'Blog slug for SEO' })
	@Column({ name: 'slug', unique: true, nullable: true })
	slug: string

	@ApiProperty({ description: 'Blog views count' })
	@Column({ name: 'views_count', default: 0 })
	viewsCount: number

	@ApiProperty({ description: 'Blog publish date' })
	@Column({ name: 'published_at', nullable: true })
	publishedAt: Date

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

