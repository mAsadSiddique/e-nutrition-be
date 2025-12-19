import { Module } from '@nestjs/common'
import { ExceptionService } from './exception.service'
import { SharedService } from './shared.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserWishlist } from './entities/user_wihshlist.entity'
import { UserWishlistService } from './user_wishlist.service'

@Module({
	imports: [TypeOrmModule.forFeature([UserWishlist])],
	providers: [ExceptionService, SharedService, UserWishlistService],
	exports: [ExceptionService, SharedService, UserWishlistService],
})
export class SharedModule {}
