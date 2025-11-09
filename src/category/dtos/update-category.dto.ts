import { IntersectionType, PartialType, PickType } from '@nestjs/swagger'
import { CreateCategoryDTO } from './create-category.dto'
import { IdDTO } from 'src/shared/dto/id.dto'

export class UpdateCategoryDTO extends IntersectionType(IdDTO, PartialType(PickType(CreateCategoryDTO, ['name', 'isHot']))){}
