"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var app_controller_1 = require("./app.controller");
var app_service_1 = require("./app.service");
var typeorm_1 = require("@nestjs/typeorm");
var constant_1 = require("./config/constant");
var shared_module_1 = require("./shared/shared.module");
var auth_module_1 = require("./auth/auth.module");
var admin_module_1 = require("./admin/admin.module");
var cache_manager_1 = require("@nestjs/cache-manager");
var category_module_1 = require("./category/category.module");
var user_module_1 = require("./user/user.module");
var blog_module_1 = require("./blog/blog.module");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        common_1.Module({
            imports: [
                typeorm_1.TypeOrmModule.forRoot({
                    type: constant_1.ENV.DB.TYPE,
                    host: constant_1.ENV.DB.HOST,
                    port: +(constant_1.ENV.DB.PORT || 5432),
                    username: constant_1.ENV.DB.USERNAME,
                    password: constant_1.ENV.DB.PASSWORD,
                    database: constant_1.ENV.DB.NAME,
                    charset: 'utf8mb4',
                    synchronize: false,
                    logging: false,
                    autoLoadEntities: true
                }),
                cache_manager_1.CacheModule.register({
                    isGlobal: true,
                    ttl: 0.5 * 60 * 1000,
                    max: 100
                }),
                admin_module_1.AdminModule,
                shared_module_1.SharedModule,
                auth_module_1.AuthModule,
                category_module_1.CategoryModule,
                user_module_1.UserModule,
                blog_module_1.BlogModule
            ],
            controllers: [app_controller_1.AppController],
            providers: [app_service_1.AppService]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
