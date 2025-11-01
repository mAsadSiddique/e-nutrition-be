import { PickType } from '@nestjs/swagger'
import { AddAdminDTO } from './add-admin.dto';

export class RetryAccountVerificationDTO extends PickType(AddAdminDTO, ['email']) { }
