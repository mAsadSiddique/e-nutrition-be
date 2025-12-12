import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger'
import {Transform, Type} from 'class-transformer'
import {IsInt, IsNotEmpty, IsNotEmptyObject, IsOptional, Min, ValidateNested} from 'class-validator'
import { parseToJson } from 'src/utils/utils'

export class DimDTO {
	@ApiProperty({
		description: 'width of the image',
		type: Number,
		required: true,
		example: 640,
	})
	@IsNotEmpty()
	@IsInt()
	@Min(1)
	@Type(() => Number)
	width!: number

	@ApiProperty({
		description: 'Hight of the image',
		type: Number,
		required: true,
		example: 720,
	})
	@IsNotEmpty()
	@IsInt()
	@Min(1)
	@Type(() => Number)
	height!: number
}

export class ImgDimDTO {
	@ApiPropertyOptional({
		description: 'Media files dimentions',
		type: DimDTO,
		required: false,
	})
	@IsOptional()
	@IsNotEmptyObject()
	@Type(() => DimDTO)
	@ValidateNested({each: true})
	1: DimDTO

	@ApiPropertyOptional({
		description: 'Media files dimentions',
		type: DimDTO,
		required: false,
	})
	@IsOptional()
	@Type(() => DimDTO)
	@ValidateNested({each: true})
	2: DimDTO

	@ApiPropertyOptional({
		description: 'Media files dimentions',
		type: DimDTO,
		required: false,
	})
	@IsOptional()
	@Type(() => DimDTO)
	@ValidateNested({each: true})
	3: DimDTO

	@ApiPropertyOptional({
		description: 'Media files dimentions',
		type: DimDTO,
		required: false,
	})
	@IsOptional()
	@Type(() => DimDTO)
	@ValidateNested({each: true})
	4: DimDTO

	@ApiPropertyOptional({
		description: 'Media files dimentions',
		type: DimDTO,
		required: false,
	})
	@IsOptional()
	@Type(() => DimDTO)
	@ValidateNested({each: true})
	5: DimDTO
}

export class ImgsDimDTO {
	@ApiPropertyOptional({
		description: 'Media files dimentions',
		type: ImgDimDTO,
		required: false,
	})
	@IsOptional()
	@Transform(({value}) => parseToJson(value, ImgDimDTO))
	@ValidateNested({each: true})
	@IsNotEmptyObject({nullable: false})
	dims?: ImgDimDTO
}
