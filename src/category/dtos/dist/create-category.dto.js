"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CreateCategoryDTO = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var utils_1 = require("src/utils/utils");
var zod_1 = require("zod");
var CreateCategoryDTO = /** @class */ (function () {
    function CreateCategoryDTO() {
    }
    __decorate([
        swagger_1.ApiProperty({
            description: 'Name of the category is required',
            nullable: false,
            example: 'category'
        }),
        class_validator_1.IsNotEmpty(),
        class_validator_1.IsString()
    ], CreateCategoryDTO.prototype, "name");
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'parent id is required to add new category as a child',
            nullable: true,
            example: 4
        }),
        class_validator_1.IsOptional(),
        class_validator_1.IsNumber()
    ], CreateCategoryDTO.prototype, "parentId");
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Is hot cetegory?',
            type: zod_1.boolean,
            "default": false
        }),
        class_validator_1.IsOptional(),
        class_transformer_1.Transform(function (_a) {
            var value = _a.value;
            return utils_1.toBoolean(value);
        }),
        class_validator_1.IsBoolean()
    ], CreateCategoryDTO.prototype, "isHot");
    return CreateCategoryDTO;
}());
exports.CreateCategoryDTO = CreateCategoryDTO;
