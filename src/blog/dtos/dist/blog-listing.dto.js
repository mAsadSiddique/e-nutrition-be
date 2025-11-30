"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BlogListingDTO = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var blog_entity_1 = require("../entities/blog.entity");
var BlogListingDTO = /** @class */ (function () {
    function BlogListingDTO() {
        this.page = 1;
        this.limit = 10;
    }
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Page number for pagination',
            example: 1,
            "default": 1
        }),
        class_validator_1.IsOptional(),
        class_transformer_1.Type(function () { return Number; }),
        class_validator_1.IsPositive()
    ], BlogListingDTO.prototype, "page");
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Number of items per page',
            example: 10,
            "default": 10
        }),
        class_validator_1.IsOptional(),
        class_transformer_1.Type(function () { return Number; }),
        class_validator_1.IsPositive()
    ], BlogListingDTO.prototype, "limit");
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Filter by category ID',
            example: 1
        }),
        class_validator_1.IsOptional(),
        class_transformer_1.Type(function () { return Number; }),
        class_validator_1.IsPositive()
    ], BlogListingDTO.prototype, "categoryId");
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Filter by status',
            "enum": blog_entity_1.BlogStatus
        }),
        class_validator_1.IsOptional(),
        class_validator_1.IsEnum(blog_entity_1.BlogStatus)
    ], BlogListingDTO.prototype, "status");
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Search by title or content',
            example: 'nestjs'
        }),
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], BlogListingDTO.prototype, "search");
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Get specific blog by ID',
            example: 1
        }),
        class_validator_1.IsOptional(),
        class_transformer_1.Type(function () { return Number; }),
        class_validator_1.IsPositive()
    ], BlogListingDTO.prototype, "id");
    return BlogListingDTO;
}());
exports.BlogListingDTO = BlogListingDTO;
