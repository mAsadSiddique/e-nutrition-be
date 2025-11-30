"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UserCategory = void 0;
var swagger_1 = require("@nestjs/swagger");
var typeorm_1 = require("typeorm");
var user_entity_1 = require("../../user/entities/user.entity");
var category_entity_1 = require("../../category/entites/category.entity");
var UserCategory = /** @class */ (function () {
    function UserCategory(obj) {
        if (obj) {
            Object.assign(this, obj);
        }
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], UserCategory.prototype, "id");
    __decorate([
        swagger_1.ApiProperty({ description: 'User ID' }),
        typeorm_1.Column({ name: 'user_id' })
    ], UserCategory.prototype, "userId");
    __decorate([
        typeorm_1.ManyToOne(function () { return user_entity_1.User; }),
        typeorm_1.JoinColumn({ name: 'user_id' })
    ], UserCategory.prototype, "user");
    __decorate([
        swagger_1.ApiProperty({ description: 'Category ID' }),
        typeorm_1.Column({ name: 'category_id' })
    ], UserCategory.prototype, "categoryId");
    __decorate([
        typeorm_1.ManyToOne(function () { return category_entity_1.Category; }),
        typeorm_1.JoinColumn({ name: 'category_id' })
    ], UserCategory.prototype, "category");
    __decorate([
        typeorm_1.CreateDateColumn({ name: 'created_at' })
    ], UserCategory.prototype, "createdAt");
    UserCategory = __decorate([
        typeorm_1.Entity('user_category'),
        typeorm_1.Unique(['userId', 'categoryId'])
    ], UserCategory);
    return UserCategory;
}());
exports.UserCategory = UserCategory;
