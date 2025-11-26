"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SignupDTO = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var SignupDTO = /** @class */ (function () {
    function SignupDTO() {
    }
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'User name',
            nullable: false,
            example: 'tacticminds@786'
        }),
        class_validator_1.IsOptional(),
        class_validator_1.Length(1, 20),
        class_transformer_1.Transform(function (_a) {
            var value = _a.value;
            return value.toLowerCase().replace(/\s+/g, '');
        })
    ], SignupDTO.prototype, "username");
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Signup with email',
            nullable: true,
            example: 'tacticminds@gmail.com'
        }),
        class_validator_1.ValidateIf(function (obj) { return !obj.phoneNumber; }),
        class_validator_1.IsNotEmpty(),
        class_validator_1.IsEmail(),
        class_transformer_1.Transform(function (_a) {
            var value = _a.value;
            return value.toLowerCase();
        })
    ], SignupDTO.prototype, "email");
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Signup with phone number',
            nullable: true,
            example: '+923087510404'
        }),
        class_validator_1.ValidateIf(function (obj) { return !obj.email; }),
        class_validator_1.IsNotEmpty(),
        class_validator_1.IsPhoneNumber(undefined, { message: 'phone number must be correct phone number and also contain country code' })
    ], SignupDTO.prototype, "phoneNumber");
    __decorate([
        swagger_1.ApiProperty({
            description: 'Password is required',
            nullable: false,
            example: 'Tacticminds@786'
        }),
        class_validator_1.IsNotEmpty(),
        class_validator_1.Matches(/^((?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*\W).{8,30})$/, {
            message: 'password must contain atleast 8 letters, 1 upper case, lower case, number and special character'
        })
    ], SignupDTO.prototype, "password");
    __decorate([
        swagger_1.ApiProperty({
            description: 'Confirm password is required',
            nullable: false,
            example: 'Tacticminds@786'
        }),
        class_validator_1.IsNotEmpty(),
        class_validator_1.Matches(/^((?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*\W).{8,30})$/, {
            message: 'confirmPassword must contain atleast 8 letters, 1 upper case, lower case, number and special character'
        })
    ], SignupDTO.prototype, "confirmPassword");
    return SignupDTO;
}());
exports.SignupDTO = SignupDTO;
