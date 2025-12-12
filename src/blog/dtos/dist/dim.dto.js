"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ImgsDimDTO = exports.ImgDimDTO = exports.DimDTO = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var utils_1 = require("src/utils/utils");
var DimDTO = /** @class */ (function () {
    function DimDTO() {
    }
    __decorate([
        swagger_1.ApiProperty({
            description: 'width of the image',
            type: Number,
            required: true,
            example: 640
        }),
        class_validator_1.IsNotEmpty(),
        class_validator_1.IsInt(),
        class_validator_1.Min(1),
        class_transformer_1.Type(function () { return Number; })
    ], DimDTO.prototype, "width");
    __decorate([
        swagger_1.ApiProperty({
            description: 'Hight of the image',
            type: Number,
            required: true,
            example: 720
        }),
        class_validator_1.IsNotEmpty(),
        class_validator_1.IsInt(),
        class_validator_1.Min(1),
        class_transformer_1.Type(function () { return Number; })
    ], DimDTO.prototype, "height");
    return DimDTO;
}());
exports.DimDTO = DimDTO;
var ImgDimDTO = /** @class */ (function () {
    function ImgDimDTO() {
    }
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Media files dimentions',
            type: DimDTO,
            required: false
        }),
        class_validator_1.IsOptional(),
        class_validator_1.IsNotEmptyObject(),
        class_transformer_1.Type(function () { return DimDTO; }),
        class_validator_1.ValidateNested({ each: true })
    ], ImgDimDTO.prototype, 1);
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Media files dimentions',
            type: DimDTO,
            required: false
        }),
        class_validator_1.IsOptional(),
        class_transformer_1.Type(function () { return DimDTO; }),
        class_validator_1.ValidateNested({ each: true })
    ], ImgDimDTO.prototype, 2);
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Media files dimentions',
            type: DimDTO,
            required: false
        }),
        class_validator_1.IsOptional(),
        class_transformer_1.Type(function () { return DimDTO; }),
        class_validator_1.ValidateNested({ each: true })
    ], ImgDimDTO.prototype, 3);
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Media files dimentions',
            type: DimDTO,
            required: false
        }),
        class_validator_1.IsOptional(),
        class_transformer_1.Type(function () { return DimDTO; }),
        class_validator_1.ValidateNested({ each: true })
    ], ImgDimDTO.prototype, 4);
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Media files dimentions',
            type: DimDTO,
            required: false
        }),
        class_validator_1.IsOptional(),
        class_transformer_1.Type(function () { return DimDTO; }),
        class_validator_1.ValidateNested({ each: true })
    ], ImgDimDTO.prototype, 5);
    return ImgDimDTO;
}());
exports.ImgDimDTO = ImgDimDTO;
var ImgsDimDTO = /** @class */ (function () {
    function ImgsDimDTO() {
    }
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Media files dimentions',
            type: ImgDimDTO,
            required: false
        }),
        class_validator_1.IsOptional(),
        class_transformer_1.Transform(function (_a) {
            var value = _a.value;
            return utils_1.parseToJson(value, ImgDimDTO);
        }),
        class_validator_1.ValidateNested({ each: true }),
        class_validator_1.IsNotEmptyObject({ nullable: false })
    ], ImgsDimDTO.prototype, "dims");
    return ImgsDimDTO;
}());
exports.ImgsDimDTO = ImgsDimDTO;
