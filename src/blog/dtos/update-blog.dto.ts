import { ApiPropertyOptional, IntersectionType, PartialType } from '@nestjs/swagger'
import { IdDTO } from 'src/shared/dto/id.dto'
import { CreateBlogDTO } from './create-blog.dto'
import { ArrayMinSize, IsOptional, ValidateNested } from 'class-validator'
import { Transform } from 'class-transformer'

class RemoveMediaDTO {
    @ApiPropertyOptional({
        description: 'Enter image keys for deletion',
        nullable: true,
        type: Array,
        example: ['1747981199611Screenshot from 2025-04-30 14-48-57.png'],
    })
    @IsOptional()
    @Transform(({value}) => (typeof value === 'string' ? JSON.parse(value.replace(/\s+/g, '')) : value)) // .replace(/\s+/g, '') remove all white spaces from string
    @ArrayMinSize(1)
    imageKeys?: string[]

    @ApiPropertyOptional({
        description: 'Enter video keys for deletion',
        nullable: true,
        type: Array,
        example: ['1747981199611Screenshot from 2025-04-30 14-48-57.png'],
    })
    @IsOptional()
    @Transform(({value}) => (typeof value === 'string' ? JSON.parse(value.replace(/\s+/g, '')) : value)) // .replace(/\s+/g, '') remove all white spaces from string
    @ArrayMinSize(1)
    videoKeys?: string[]
}

export class UpdateBlogDTO extends IntersectionType(IdDTO, PartialType(CreateBlogDTO)) { 
   @ApiPropertyOptional({
       description: 'Media files to be removed',
       nullable: true,
       type: RemoveMediaDTO,
   })
   @IsOptional()
   @ValidateNested()
   mediaToBeRemoved?: RemoveMediaDTO
}

