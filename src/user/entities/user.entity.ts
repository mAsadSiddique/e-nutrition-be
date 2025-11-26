import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm'

import {ApiProperty} from '@nestjs/swagger'
import type {ProfileImageType} from '../types/profile_image.type'
import type {UserDobType} from '../types/dob.type'
import {RegisterationTypeEnum, UserTypeEnum} from '../enums/user.enums'
import {GenderEnum} from '../enums/gender.enum'
import {UserStatusEnum} from '../enums/status.enum'
import type { UserVerificationStatusType } from '../types/user_vcerification_status.type'
@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id!: number

	@ApiProperty({description: 'username, unique for each user'})
	@Column({name: 'username', unique: true, nullable: true})
	username!: string

	@ApiProperty({description: 'what is your email'})
	@Column({name: 'email', unique: true, nullable: true})
	email!: string

	@Column({name: 'facebook_id', unique: true, nullable: true})
	facebookId!: string

	@ApiProperty({description: 'what is your password'})
	@Column({name: 'password'})
	password!: string

	@ApiProperty({description: 'what is your name'})
	@Column({name: 'first_name', nullable: true})
	firstName!: string

	@Column({name: 'last_name', nullable: true})
	lastName!: string

	@Column({name: 'phone_number', unique: true, nullable: true})
	phoneNumber!: string

	@ApiProperty({description: 'user gender'})
	@Column({nullable: true, type: 'enum', enum: GenderEnum})
	gender!: GenderEnum

	@Column({type: 'enum', enum: UserStatusEnum, default: UserStatusEnum.VERIFICATION_PENDING})
	status!: UserStatusEnum

	@Column({name: 'address', nullable: true})
	address!: string

	@Column({ nullable: true, type: 'simple-json' })
	dob!: UserDobType

	@Column({ name: 'profile_image', type: 'simple-json', nullable: true })
	profileImage!: ProfileImageType

	@Column({name: 'image_expired_at', type: 'double precision', nullable: true})
	imageExpiredAt?: number

	@Column({name: 'registration_type', type: 'enum', enum: RegisterationTypeEnum})
	registrationType!: RegisterationTypeEnum

	@Column({name: 'fcm_tokens', type: 'simple-array', nullable: true})
	fcmTokens!: string[]

	@Column({name: 'is_notification_enabled', default: true})
	isNotificationEnabled!: boolean

	@Column({name: 'user_type', type: 'enum', enum: UserTypeEnum, default: UserTypeEnum.USER})
	userType!: UserTypeEnum

	@Column({name: 'user_verifications', type: 'simple-json', default: {email: false, phoneNumber: false}})
	userVerifications!: UserVerificationStatusType

	@CreateDateColumn({name: 'created_at'})
	createdAt!: Date

	@UpdateDateColumn({name: 'updated_at'})
	updatedAt!: Date
	constructor(obj?) {
		if (obj) {
			Object.assign(this, obj)
		}
	}
}
