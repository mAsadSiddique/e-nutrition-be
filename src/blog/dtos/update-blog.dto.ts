import { IntersectionType, PartialType } from '@nestjs/swagger'
import { IdDTO } from 'src/shared/dto/id.dto'
import { CreateBlogDTO } from './create-blog.dto'

export class UpdateBlogDTO extends IntersectionType(IdDTO, PartialType(CreateBlogDTO)) { }

