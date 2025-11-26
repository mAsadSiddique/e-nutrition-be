"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.EditUserProfileDTO = void 0;
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var gender_enum_1 = require("../enums/gender.enum");
var swagger_1 = require("@nestjs/swagger");
var signup_dto_1 = require("./signup.dto");
var UserDobDTO = /** @class */ (function () {
    function UserDobDTO() {
    }
    __decorate([
        swagger_1.ApiProperty({ description: 'Day of birth', type: Number, minimum: 1, maximum: 31, example: 25 }),
        class_validator_1.IsNotEmpty(),
        class_validator_1.IsInt(),
        class_validator_1.Min(1),
        class_validator_1.Max(31)
    ], UserDobDTO.prototype, "day");
    __decorate([
        swagger_1.ApiProperty({ description: 'Month of birth', type: Number, minimum: 1, maximum: 12, example: 11 }),
        class_validator_1.IsNotEmpty(),
        class_validator_1.IsInt(),
        class_validator_1.Min(1),
        class_validator_1.Max(12)
    ], UserDobDTO.prototype, "month");
    __decorate([
        swagger_1.ApiProperty({ description: 'Year of birth', type: Number, minimum: 1900, maximum: 2100, example: 2005 }),
        class_validator_1.IsNotEmpty(),
        class_validator_1.IsInt(),
        class_validator_1.Min(1950),
        class_validator_1.Max(new Date().getFullYear())
    ], UserDobDTO.prototype, "year");
    return UserDobDTO;
}());
var ProfileImageDTO = /** @class */ (function () {
    function ProfileImageDTO() {
    }
    __decorate([
        swagger_1.ApiProperty({
            description: 'Enter user profile base64',
            type: String,
            nullable: true,
            example: '/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAQwAABtbnRyUkdCIFhZWiAH4AABAAEABhY3NwAAAQAA9tYAAQAAAADTLQA.....'
        }),
        class_validator_1.IsNotEmpty(),
        class_validator_1.IsBase64(),
        class_transformer_1.Transform(function (_a) {
            var value = _a.value;
            return value.trim();
        })
    ], ProfileImageDTO.prototype, "fileBase64");
    __decorate([
        swagger_1.ApiProperty({
            description: 'Enter user profile name',
            type: String,
            nullable: false,
            example: 'userProfileName'
        }),
        class_validator_1.IsNotEmpty(),
        class_validator_1.Length(1, 100),
        class_transformer_1.Transform(function (_a) {
            var value = _a.value;
            return (typeof value === 'string' ? value.trim() : value);
        })
    ], ProfileImageDTO.prototype, "fileName");
    return ProfileImageDTO;
}());
var EditUserProfileDTO = /** @class */ (function (_super) {
    __extends(EditUserProfileDTO, _super);
    function EditUserProfileDTO() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Enter user first name',
            type: String,
            nullable: true,
            example: 'waqar'
        }),
        class_validator_1.IsOptional(),
        class_validator_1.Length(1, 30),
        class_transformer_1.Transform(function (_a) {
            var value = _a.value;
            return (typeof value === 'string' ? value.trim() : value);
        })
    ], EditUserProfileDTO.prototype, "firstName");
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Enter user last name',
            type: String,
            nullable: true,
            example: 'hussain'
        }),
        class_validator_1.IsOptional(),
        class_validator_1.Length(1, 30),
        class_transformer_1.Transform(function (_a) {
            var value = _a.value;
            return (typeof value === 'string' ? value.trim() : value);
        })
    ], EditUserProfileDTO.prototype, "lastName");
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Enter user gender',
            "enum": gender_enum_1.GenderEnum,
            nullable: true,
            example: gender_enum_1.GenderEnum.MALE
        }),
        class_validator_1.IsOptional(),
        class_validator_1.IsEnum(gender_enum_1.GenderEnum)
    ], EditUserProfileDTO.prototype, "gender");
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Enter user address',
            type: String,
            nullable: true,
            example: '153 L Block lahore'
        }),
        class_validator_1.IsOptional(),
        class_validator_1.Length(1, 100),
        class_transformer_1.Transform(function (_a) {
            var value = _a.value;
            return (typeof value === 'string' ? value.trim() : value);
        })
    ], EditUserProfileDTO.prototype, "address");
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Enter the user dob',
            type: UserDobDTO,
            nullable: true
        }),
        class_validator_1.IsOptional(),
        class_validator_1.ValidateNested({ each: true }),
        class_transformer_1.Type(function () { return UserDobDTO; })
    ], EditUserProfileDTO.prototype, "dob");
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Enter user profile image',
            type: ProfileImageDTO,
            nullable: true
        }),
        class_validator_1.IsOptional(),
        class_validator_1.IsNotEmptyObject({ nullable: false }),
        class_transformer_1.Type(function () { return ProfileImageDTO; }),
        class_validator_1.ValidateNested()
    ], EditUserProfileDTO.prototype, "profileImage");
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Enter the fcm token for notifications',
            type: String,
            nullable: true,
            example: 'fcm_token***********'
        }),
        class_validator_1.IsOptional(),
        class_validator_1.Length(1, 100),
        class_transformer_1.Transform(function (_a) {
            var value = _a.value;
            return (typeof value === 'string' ? value.trim() : value);
        })
    ], EditUserProfileDTO.prototype, "fcmTokens");
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'User notification enabled/disabled',
            type: Boolean,
            nullable: true,
            example: true
        }),
        class_validator_1.IsOptional(),
        class_validator_1.IsBoolean()
    ], EditUserProfileDTO.prototype, "isNotificationEnabled");
    return EditUserProfileDTO;
}(swagger_1.PartialType(swagger_1.PickType(signup_dto_1.SignupDTO, ['email', 'phoneNumber', 'username']))));
exports.EditUserProfileDTO = EditUserProfileDTO;
