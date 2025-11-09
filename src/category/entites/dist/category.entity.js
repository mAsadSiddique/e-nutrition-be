"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Category = void 0;
var swagger_1 = require("@nestjs/swagger");
var typeorm_1 = require("typeorm");
var Category = /** @class */ (function () {
    function Category(obj) {
        if (obj) {
            Object.assign(this, obj);
        }
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], Category.prototype, "id");
    __decorate([
        swagger_1.ApiProperty({ description: 'From which name nwe category is added' }),
        typeorm_1.Column({ name: 'name' })
    ], Category.prototype, "name");
    __decorate([
        swagger_1.ApiProperty({ description: 'when you want to add new category as a child' }),
        typeorm_1.Column({ name: 'parent_id', nullable: true })
    ], Category.prototype, "parentId");
    __decorate([
        typeorm_1.Column({ name: 'is_hot', "default": false })
    ], Category.prototype, "isHot");
    __decorate([
        typeorm_1.CreateDateColumn({ name: 'created_at' })
    ], Category.prototype, "createdAt");
    __decorate([
        typeorm_1.UpdateDateColumn({ name: 'updated_at' })
    ], Category.prototype, "updatedAt");
    Category = __decorate([
        typeorm_1.Entity('category')
    ], Category);
    return Category;
}());
exports.Category = Category;
