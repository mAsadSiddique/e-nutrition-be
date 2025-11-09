"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ParamIdDTO = exports.IdDTO = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var IdDTO = /** @class */ (function () {
    function IdDTO() {
    }
    __decorate([
        swagger_1.ApiProperty({
            description: 'id',
            type: String,
            example: 1,
            required: true
        }),
        class_validator_1.IsNotEmpty(),
        class_transformer_1.Type(function () { return Number; }),
        class_validator_1.IsPositive(),
        class_validator_1.IsInt()
    ], IdDTO.prototype, "id");
    return IdDTO;
}());
exports.IdDTO = IdDTO;
var ParamIdDTO = /** @class */ (function () {
    function ParamIdDTO() {
    }
    __decorate([
        swagger_1.ApiProperty({
            description: 'id',
            type: Number,
            example: 567,
            required: true
        }),
        class_validator_1.IsNotEmpty(),
        class_transformer_1.Type(function () { return Number; }),
        class_validator_1.IsPositive(),
        class_validator_1.IsInt()
    ], ParamIdDTO.prototype, "id");
    return ParamIdDTO;
}());
exports.ParamIdDTO = ParamIdDTO;
