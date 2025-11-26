export type UserVerificationStatusType = {
	email: boolean
	phoneNumber: boolean
}

export type VerificationCacheData = {
	code: string
	expiredAt: number
}
