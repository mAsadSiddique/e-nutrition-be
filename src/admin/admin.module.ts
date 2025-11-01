import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '../auth/auth.module'
import { SharedModule } from '../shared/shared.module'
import { AdminController } from './controllers/admin.controller'
import { Admin } from './entities/admin.entity'
import { ContactUs } from './entities/connection-request.entity'
import { AdminService } from './services/admin.service'
import { AdminAccountService } from './services/admin-account.service'

@Module({
  imports: [TypeOrmModule.forFeature([Admin, ContactUs]),
    AuthModule,
    SharedModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminAccountService],
  exports: [AdminService]
})
export class AdminModule { }
