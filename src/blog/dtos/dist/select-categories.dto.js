"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SelectCategoriesDTO = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var SelectCategoriesDTO = /** @class */ (function () {
    function SelectCategoriesDTO() {
    }
    __decorate([
        swagger_1.ApiProperty({
            description: 'Array of category IDs that user is interested in',
            example: [1, 2, 3],
            type: [Number]
        }),
        class_validator_1.IsNotEmpty(),
        class_validator_1.IsArray(),
        class_validator_1.ArrayMinSize(1),
        class_validator_1.IsPositive({ each: true }),
        class_transformer_1.Type(function () { return Number; }),
        class_validator_1.IsInt({ each: true })
    ], SelectCategoriesDTO.prototype, "categoryIds");
    return SelectCategoriesDTO;
}());
exports.SelectCategoriesDTO = SelectCategoriesDTO;
