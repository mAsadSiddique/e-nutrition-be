import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENV } from './config/constant';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CategoryModule } from './category/category.module';
import { UserModule } from './user/user.module';
import { BlogModule } from './blog/blog.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: ENV.DB.TYPE as any,
      host: ENV.DB.HOST,
      port: +(ENV.DB.PORT || 5432),
      username: ENV.DB.USERNAME,
      password: ENV.DB.PASSWORD,
      database: ENV.DB.NAME,
      charset: 'utf8mb4',
      synchronize: false, // This should always be false, if you want to add , then please do through migration
      logging: false,
      autoLoadEntities: true,
      // entities: ['dist/**/*.entity.js'],
      // migrations: ['dist/migration/*.js'],
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    CacheModule.register({
      isGlobal: true, // Makes the cache available across the entire app
      ttl: 0.5 * 60 * 1000, // Optional: Time-to-live (in milliseconds), default is 30 seconds
      max: 100, // Optional: Maximum number of items in cache
    }),
    AdminModule,
    SharedModule,
    AuthModule,
    CategoryModule,
    UserModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
