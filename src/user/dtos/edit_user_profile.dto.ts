import {Transform, Type} from 'class-transformer'
import {IsBase64, IsBoolean, IsEnum, IsInt, IsNotEmpty, IsNotEmptyObject, IsOptional, IsPhoneNumber, IsString, Length, Matches, Max, Min, ValidateIf, ValidateNested} from 'class-validator'
import {GenderEnum} from '../enums/gender.enum'
import {ApiProperty, ApiPropertyOptional, PartialType, PickType} from '@nestjs/swagger'
import {SignupDTO} from './signup.dto'

class UserDobDTO {
	@ApiProperty({description: 'Day of birth', type: Number, minimum: 1, maximum: 31, example: 25})
	@IsNotEmpty()
	@IsInt()
	@Min(1)
	@Max(31)
	day!: number

	@ApiProperty({description: 'Month of birth', type: Number, minimum: 1, maximum: 12, example: 11})
	@IsNotEmpty()
	@IsInt()
	@Min(1)
	@Max(12)
	month!: number

	@ApiProperty({description: 'Year of birth', type: Number, minimum: 1900, maximum: 2100, example: 2005})
	@IsNotEmpty()
	@IsInt()
	@Min(1950)
	@Max(new Date().getFullYear())
	year!: number
}

class ProfileImageDTO {
	@ApiProperty({
		description: 'Enter user profile base64',
		type: String,
		nullable: true,
		example: '/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAQwAABtbnRyUkdCIFhZWiAH4AABAAEABhY3NwAAAQAA9tYAAQAAAADTLQA.....',
	})
	@IsNotEmpty()
	@IsBase64()
	@Transform(({value}) => value.trim())
	fileBase64!: string

	@ApiProperty({
		description: 'Enter user profile name',
		type: String,
		nullable: false,
		example: 'userProfileName',
	})
	@IsNotEmpty()
	@Length(1, 100)
	@Transform(({value}) => (typeof value === 'string' ? value.trim() : value))
	fileName!: string
}

export class EditUserProfileDTO extends PartialType(PickType(SignupDTO, ['email', 'phoneNumber', 'username'])) {
	@ApiPropertyOptional({
		description: 'Enter user first name',
		type: String,
		nullable: true,
		example: 'waqar',
	})
	@IsOptional()
	@Length(1, 30)
	@Transform(({value}) => (typeof value === 'string' ? value.trim() : value))
	firstName!: string

	@ApiPropertyOptional({
		description: 'Enter user last name',
		type: String,
		nullable: true,
		example: 'hussain',
	})
	@IsOptional()
	@Length(1, 30)
	@Transform(({value}) => (typeof value === 'string' ? value.trim() : value))
	lastName!: string

	@ApiPropertyOptional({
		description: 'Enter user gender',
		enum: GenderEnum,
		nullable: true,
		example: GenderEnum.MALE,
	})
	@IsOptional()
	@IsEnum(GenderEnum)
	gender!: GenderEnum

	@ApiPropertyOptional({
		description: 'Enter user address',
		type: String,
		nullable: true,
		example: '153 L Block lahore',
	})
	@IsOptional()
	@Length(1, 100)
	@Transform(({value}) => (typeof value === 'string' ? value.trim() : value))
	address!: string

	@ApiPropertyOptional({
		description: 'Enter the user dob',
		type: UserDobDTO,
		nullable: true,
	})
	@IsOptional()
	@ValidateNested({each: true})
	@Type(() => UserDobDTO)
	dob!: UserDobDTO

	@ApiPropertyOptional({
		description: 'Enter user profile image',
		type: ProfileImageDTO,
		nullable: true,
	})
	@IsOptional()
	@IsNotEmptyObject({nullable: false})
	@Type(() => ProfileImageDTO)
	@ValidateNested()
	profileImage?: ProfileImageDTO

	@ApiPropertyOptional({
		description: 'Enter the fcm token for notifications',
		type: String,
		nullable: true,
		example: 'fcm_token***********',
	})
	@IsOptional()
	@Length(1, 100)
	@Transform(({value}) => (typeof value === 'string' ? value.trim() : value))
	fcmTokens!: string

	@ApiPropertyOptional({
		description: 'User notification enabled/disabled',
		type: Boolean,
		nullable: true,
		example: true,
	})
	@IsOptional()
	@IsBoolean()
	isNotificationEnabled!: boolean

	// @ApiPropertyOptional({
	// 	description: 'User cisty id',
	// 	type: Number,
	// 	nullable: true,
	// 	example: 800,
	// })
	// @IsOptional()
	// @IsInt()
	// @Min(1)
	// cityId!: number

	// @ApiPropertyOptional({
	// 	description: 'User town id',
	// 	type: Number,
	// 	nullable: true,
	// 	example: 800,
	// })
	// @IsOptional()
	// @IsInt()
	// @Min(1)
	// townId!: number
}
