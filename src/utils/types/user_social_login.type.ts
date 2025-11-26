
export type UserSocialLoginType = {
	firstName?: string
	lastName?: string
	username?: string
	email?: string
	password?: string
	phoneNumber?: string
	profileImage?: {}
}


export enum RegisterationTypeEnum {
	GOOGLE = 'Google',
	FACEBOOK = 'Facebook',
	EMAIL = 'Email',
	PHONE = 'Phone',
}