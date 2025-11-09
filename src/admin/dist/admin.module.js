"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AdminModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var auth_module_1 = require("../auth/auth.module");
var shared_module_1 = require("../shared/shared.module");
var admin_controller_1 = require("./controllers/admin.controller");
var admin_entity_1 = require("./entities/admin.entity");
var connection_request_entity_1 = require("./entities/connection-request.entity");
var admin_service_1 = require("./services/admin.service");
var admin_account_service_1 = require("./services/admin-account.service");
var AdminModule = /** @class */ (function () {
    function AdminModule() {
    }
    AdminModule = __decorate([
        common_1.Module({
            imports: [typeorm_1.TypeOrmModule.forFeature([admin_entity_1.Admin, connection_request_entity_1.ContactUs]),
                auth_module_1.AuthModule,
                shared_module_1.SharedModule,
            ],
            controllers: [admin_controller_1.AdminController],
            providers: [admin_service_1.AdminService, admin_account_service_1.AdminAccountService],
            exports: [admin_service_1.AdminService]
        })
    ], AdminModule);
    return AdminModule;
}());
exports.AdminModule = AdminModule;
