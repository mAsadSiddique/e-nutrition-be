import { ApiProperty } from '@nestjs/swagger'
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, JoinColumn } from 'typeorm'
import { Category } from '../../category/entites/category.entity'
import { Admin } from '../../admin/entities/admin.entity'
import { MediaType } from 'src/utils/types/media.types'

export enum BlogStatus {
	DRAFT = 'draft',
	PUBLISHED = 'published',
	UNPUBLISHED = 'unpublished',
}

@Entity('blog')
export class Blog {
	@PrimaryGeneratedColumn()
	id: number

	@ApiProperty({ description: 'Blog title' })
	@Column({ name: 'title' })
	title: string

	@ApiProperty({ description: 'Blog content/body (HTML supported)' })
	@Column({ name: 'content', type: 'text' })
	content: string

	@ApiProperty({ description: 'Blog excerpt/summary' })
	@Column({ name: 'excerpt', type: 'text', nullable: true })
	excerpt: string

	@Column({type: 'jsonb', nullable: true})
	media?: MediaType | null

	@Column({name: 'media_expired_at', type: 'double precision', nullable: true})
	mediaExpiredAt?: number

	// @ApiProperty({ description: 'Blog categories (many-to-many)' })
	// @ManyToMany(() => Category)
	// @JoinTable({
	// 	name: 'blog_category',
	// 	joinColumn: { name: 'blog_id', referencedColumnName: 'id' },
	// 	inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
	// })
	// categories: Category[] | null

	@Column({ name: 'categories', type: 'jsonb', nullable: true})
	categories: number[] | null

	@ApiProperty({ description: 'Blog status (draft/published/unpublished)' })
	@Column({ name: 'status', type: 'enum', enum: BlogStatus, default: BlogStatus.DRAFT })
	status: BlogStatus

	@ApiProperty({ description: 'Blog slug for SEO' })
	@Column({ name: 'slug', unique: true, nullable: true })
	slug: string

	@ApiProperty({ description: 'SEO title' })
	@Column({ name: 'seo_title', nullable: true })
	seoTitle: string

	@ApiProperty({ description: 'SEO description' })
	@Column({ name: 'seo_description', type: 'text', nullable: true })
	seoDescription: string

	@ApiProperty({ description: 'Blog tags (comma-separated)' })
	@Column({ name: 'tags', type: 'simple-array', nullable: true })
	tags: string[]

	@ApiProperty({ description: 'Blog views count' })
	@Column({ name: 'views_count', default: 0 })
	viewsCount: number

	@ApiProperty({ description: 'Blog likes count' })
	@Column({ name: 'likes_count', default: 0 })
	likesCount: number

	@Column({ name: 'published_at', type: 'timestamp', nullable: true })
	publishedAt: Date | null;
	
	@Column({ name: 'unpublished_at', type: 'timestamp', nullable: true })
	unpublishedAt: Date | null;
	

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date

	@ManyToOne(() => Admin, (admin) => admin.id)
	@JoinColumn({ name: 'admin_id' })
	adminId: Admin

	constructor(obj?) {
		if (obj) {
			Object.assign(this, obj)
		}
	}
}

