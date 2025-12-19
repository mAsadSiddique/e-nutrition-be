"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UserWishlist = void 0;
var typeorm_1 = require("typeorm");
var user_entity_1 = require("../../user/entities/user.entity");
/**
 * This entity represents a user's wishlist, which can include taskers and tasker services.
 * It is used to store the IDs of taskers and services that a user has marked as favorites.
 */
var UserWishlist = /** @class */ (function () {
    function UserWishlist(obj) {
        if (obj) {
            Object.assign(this, obj);
        }
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], UserWishlist.prototype, "id");
    __decorate([
        typeorm_1.Column({ name: 'blogs_wishlist', type: 'int', array: true, nullable: true })
    ], UserWishlist.prototype, "blogsWishlist");
    __decorate([
        typeorm_1.Column({ name: 'categories_wishlist', type: 'int', array: true, nullable: true })
    ], UserWishlist.prototype, "categoriesWishlist");
    __decorate([
        typeorm_1.CreateDateColumn({ name: 'created_at' })
    ], UserWishlist.prototype, "createdAt");
    __decorate([
        typeorm_1.UpdateDateColumn({ name: 'updated_at' })
    ], UserWishlist.prototype, "updatedAt");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return user_entity_1.User; }, function (user) { return user.id; }),
        typeorm_1.JoinColumn({ name: 'user_id' })
    ], UserWishlist.prototype, "userId");
    UserWishlist = __decorate([
        typeorm_1.Unique("unique_user_id", ['userId']),
        typeorm_1.Index('index_user_id', ['userId']),
        typeorm_1.Entity('user_wishlist')
    ], UserWishlist);
    return UserWishlist;
}());
exports.UserWishlist = UserWishlist;
