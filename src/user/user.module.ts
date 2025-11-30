import {Module} from '@nestjs/common'
import {UserService} from './services/user.service'
import {UserController} from './controllers/user.controller'
import {UserAccountService} from './services/user-account.service'
import {SharedModule} from 'src/shared/shared.module'
import {TypeOrmModule} from '@nestjs/typeorm'
import {User} from './entities/user.entity'
import {AuthModule} from 'src/auth/auth.module'
import {GoogleStrategy} from './social_login-strategies/google.strategy'

@Module({
	imports: [TypeOrmModule.forFeature([User]), SharedModule, AuthModule],
	providers: [UserService, UserAccountService, GoogleStrategy],
	controllers: [UserController],
	exports: [UserService, UserAccountService],
})
export class UserModule {}
