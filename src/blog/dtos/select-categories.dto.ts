import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsArray, IsNumber, ArrayMinSize } from 'class-validator'
import { Type } from 'class-transformer'

export class SelectCategoriesDTO {
	@ApiProperty({
		description: 'Array of category IDs that user is interested in',
		example: [1, 2, 3],
		type: [Number]
	})
	@IsNotEmpty()
	@IsArray()
	@ArrayMinSize(1)
	@IsNumber({}, { each: true })
	@Type(() => Number)
	categoryIds: number[]
}

