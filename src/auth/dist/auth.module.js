"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthModule = void 0;
var common_1 = require("@nestjs/common");
var jwt_1 = require("@nestjs/jwt");
var admin_auth_guard_1 = require("./guard/admin_auth.guard");
var admin_auth_service_1 = require("./guard/admin_auth.service");
var shared_module_1 = require("src/shared/shared.module");
var constant_1 = require("src/config/constant");
var user_auth_service_1 = require("./guard/user_auth.service");
var AuthModule = /** @class */ (function () {
    function AuthModule() {
    }
    AuthModule = __decorate([
        common_1.Module({
            imports: [
                shared_module_1.SharedModule,
                jwt_1.JwtModule.register({
                    global: true,
                    secret: constant_1.ENV.JWT.SECRET,
                    signOptions: { expiresIn: '1d' }
                }),
            ],
            providers: [admin_auth_guard_1.AdminAuthGuard, admin_auth_service_1.AdminAuthService, user_auth_service_1.UserAuthService],
            exports: [admin_auth_guard_1.AdminAuthGuard, admin_auth_service_1.AdminAuthService, user_auth_service_1.UserAuthService]
        })
    ], AuthModule);
    return AuthModule;
}());
exports.AuthModule = AuthModule;
