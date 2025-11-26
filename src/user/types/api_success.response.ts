import {GenderEnum} from '../enums/gender.enum'
import {UserStatusEnum} from '../enums/status.enum'
import {RegisterationTypeEnum, UserTypeEnum} from '../enums/user.enums'
import {ProfileImageType} from './profile_image.type'
import {UserVerificationStatusType} from './user_vcerification_status.type'

export type LoginResponseType = {
	jwt: string
	user?: UserResponseType
}

export type UserProfileResponseType = {
	profile:
		| (UserResponseType & {
		  })
		| null
	jwt?: string | null | undefined
}

export type UserResponseType = {
	id: number
	username: string
	email?: string | null
	password: string | null
	firstName?: string | null
	lastName?: string | null
	phoneNumber?: string | null
	status: UserStatusEnum
	address?: string | null
	profileImage?: ProfileImageType
	registrationType: RegisterationTypeEnum
	cityId?: LocationType
	townId?: LocationType
	isNotificationEnabled: boolean
	dob: {
		day: number
		month: number
		year: number
	}
	userType: UserTypeEnum
	userVerifications: UserVerificationStatusType
	facebookId: string
	gender: GenderEnum
	fcmTokens?: string[]
	createdAt: Date
	updatedAt: Date
}

type LocationType = {
	id: number
	name: string
	slug: string
}
