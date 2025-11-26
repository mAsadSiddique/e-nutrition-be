"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.User = void 0;
var typeorm_1 = require("typeorm");
var swagger_1 = require("@nestjs/swagger");
var user_enums_1 = require("../enums/user.enums");
var gender_enum_1 = require("../enums/gender.enum");
var status_enum_1 = require("../enums/status.enum");
var User = /** @class */ (function () {
    function User(obj) {
        if (obj) {
            Object.assign(this, obj);
        }
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], User.prototype, "id");
    __decorate([
        swagger_1.ApiProperty({ description: 'username, unique for each user' }),
        typeorm_1.Column({ name: 'username', unique: true, nullable: true })
    ], User.prototype, "username");
    __decorate([
        swagger_1.ApiProperty({ description: 'what is your email' }),
        typeorm_1.Column({ name: 'email', unique: true, nullable: true })
    ], User.prototype, "email");
    __decorate([
        typeorm_1.Column({ name: 'facebook_id', unique: true, nullable: true })
    ], User.prototype, "facebookId");
    __decorate([
        swagger_1.ApiProperty({ description: 'what is your password' }),
        typeorm_1.Column({ name: 'password' })
    ], User.prototype, "password");
    __decorate([
        swagger_1.ApiProperty({ description: 'what is your name' }),
        typeorm_1.Column({ name: 'first_name', nullable: true })
    ], User.prototype, "firstName");
    __decorate([
        typeorm_1.Column({ name: 'last_name', nullable: true })
    ], User.prototype, "lastName");
    __decorate([
        typeorm_1.Column({ name: 'phone_number', unique: true, nullable: true })
    ], User.prototype, "phoneNumber");
    __decorate([
        swagger_1.ApiProperty({ description: 'user gender' }),
        typeorm_1.Column({ nullable: true, type: 'enum', "enum": gender_enum_1.GenderEnum })
    ], User.prototype, "gender");
    __decorate([
        typeorm_1.Column({ type: 'enum', "enum": status_enum_1.UserStatusEnum, "default": status_enum_1.UserStatusEnum.VERIFICATION_PENDING })
    ], User.prototype, "status");
    __decorate([
        typeorm_1.Column({ name: 'address', nullable: true })
    ], User.prototype, "address");
    __decorate([
        typeorm_1.Column({ nullable: true, type: 'simple-json' })
    ], User.prototype, "dob");
    __decorate([
        typeorm_1.Column({ name: 'profile_image', type: 'simple-json', nullable: true })
    ], User.prototype, "profileImage");
    __decorate([
        typeorm_1.Column({ name: 'image_expired_at', type: 'double precision', nullable: true })
    ], User.prototype, "imageExpiredAt");
    __decorate([
        typeorm_1.Column({ name: 'registration_type', type: 'enum', "enum": user_enums_1.RegisterationTypeEnum })
    ], User.prototype, "registrationType");
    __decorate([
        typeorm_1.Column({ name: 'fcm_tokens', type: 'simple-array', nullable: true })
    ], User.prototype, "fcmTokens");
    __decorate([
        typeorm_1.Column({ name: 'is_notification_enabled', "default": true })
    ], User.prototype, "isNotificationEnabled");
    __decorate([
        typeorm_1.Column({ name: 'user_type', type: 'enum', "enum": user_enums_1.UserTypeEnum, "default": user_enums_1.UserTypeEnum.USER })
    ], User.prototype, "userType");
    __decorate([
        typeorm_1.Column({ name: 'user_verifications', type: 'simple-json', "default": { email: false, phoneNumber: false } })
    ], User.prototype, "userVerifications");
    __decorate([
        typeorm_1.CreateDateColumn({ name: 'created_at' })
    ], User.prototype, "createdAt");
    __decorate([
        typeorm_1.UpdateDateColumn({ name: 'updated_at' })
    ], User.prototype, "updatedAt");
    User = __decorate([
        typeorm_1.Entity()
    ], User);
    return User;
}());
exports.User = User;
