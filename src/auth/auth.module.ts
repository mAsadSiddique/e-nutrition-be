import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AdminAuthGuard } from './guard/admin_auth.guard';
import { AdminAuthService } from './guard/admin_auth.service';
import { SharedModule } from 'src/shared/shared.module';
import { ENV } from 'src/config/constant'

@Module({
	imports: [
		SharedModule,
		JwtModule.register({
			global: true,
			secret: ENV.JWT.SECRET,
			signOptions: {expiresIn: '1d'},
		}),
	],
	providers: [AdminAuthGuard , AdminAuthService],
	exports: [AdminAuthGuard, AdminAuthService],
})
export class AuthModule {}
