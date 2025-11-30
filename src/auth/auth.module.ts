import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AdminAuthGuard } from './guard/admin_auth.guard';
import { AdminAuthService } from './guard/admin_auth.service';
import { SharedModule } from 'src/shared/shared.module';
import { ENV } from 'src/config/constant'
import { UserAuthService } from './guard/user_auth.service';

@Module({
	imports: [
		SharedModule,
		JwtModule.register({
			global: true,
			secret: ENV.JWT.SECRET,
			signOptions: {expiresIn: '1d'},
		}),
	],
	providers: [AdminAuthGuard , AdminAuthService, UserAuthService],
	exports: [AdminAuthGuard, AdminAuthService, UserAuthService],
})
export class AuthModule {}
