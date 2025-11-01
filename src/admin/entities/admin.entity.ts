import { ApiProperty } from '@nestjs/swagger'
import { Roles } from '../../utils/enums/roles.enum'
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class Admin {
	@PrimaryGeneratedColumn()
	id: number

	@ApiProperty({ description: 'what is your email' })
	@Column({ unique: true })
	email: string

	@ApiProperty({ description: 'what is your password' })
	@Column()
	password: string

	@Column({ name: 'is_email_verified', default: false })
	isEmailVerified: boolean

	@ApiProperty({ description: 'what is your name' })
	@Column({ name: 'first_name', nullable: true })
	firstName: string

	@Column({ name: 'last_name', nullable: true })
	lastName: string

	@Column({ name: 'two_fa_auth', nullable: true })
	twoFaAuth: string

	@Column({ name: 'is_two_fa_enable', default: false })
	isTwoFaEnable: boolean

	@Column({ name: 'is_blocked', default: false })
	isBlocked: boolean

	@Column({ type: 'enum', enum: Roles })
	role: Roles

	@Column({ name: 'image_url', nullable: true })
	imageUrl: string

	@Column({ name: 'fcm_tokens', type: 'simple-array', nullable: true })
	fcmTokens: string[]

	@Column({ name: 'is_notification_enabled', default: true })
	isNotificationEnabled: boolean

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
