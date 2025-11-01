import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class ContactUs {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	email: string

	@Column({ name: 'phone_number' })
	phoneNumber: string

	@Column({ name: 'first_name', nullable: true })
	firstName: string

	@Column({ name: 'last_name', nullable: true })
	lastName: string

	@Column({ type: 'text' })
	message: string

	@Column({ name: 'is_email_sent', default: false })
	isEmailSent: boolean

	@Column({ name: 'is_resolved', default: false })
	isResolved: boolean

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
