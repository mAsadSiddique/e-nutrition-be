"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CreateBlogDTO = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var blog_entity_1 = require("../entities/blog.entity");
var CreateBlogDTO = /** @class */ (function () {
    function CreateBlogDTO() {
    }
    __decorate([
        swagger_1.ApiProperty({
            description: 'Blog title',
            example: 'How to Build a NestJS Application'
        }),
        class_validator_1.IsNotEmpty(),
        class_validator_1.IsString(),
        class_transformer_1.Transform(function (_a) {
            var value = _a.value;
            return value.trim();
        })
    ], CreateBlogDTO.prototype, "title");
    __decorate([
        swagger_1.ApiProperty({
            description: 'Blog content/body',
            example: 'This is the full content of the blog post...'
        }),
        class_validator_1.IsNotEmpty(),
        class_validator_1.IsString()
    ], CreateBlogDTO.prototype, "content");
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Blog excerpt/summary',
            example: 'A brief summary of the blog post'
        }),
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], CreateBlogDTO.prototype, "excerpt");
    __decorate([
        swagger_1.ApiProperty({
            description: 'Category ID for the blog',
            example: 1
        }),
        class_validator_1.IsNotEmpty(),
        class_validator_1.IsNumber()
    ], CreateBlogDTO.prototype, "categoryId");
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Blog status',
            "enum": blog_entity_1.BlogStatus,
            "default": blog_entity_1.BlogStatus.DRAFT
        }),
        class_validator_1.IsOptional(),
        class_validator_1.IsEnum(blog_entity_1.BlogStatus)
    ], CreateBlogDTO.prototype, "status");
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Blog slug for SEO (auto-generated if not provided)',
            example: 'how-to-build-nestjs-application'
        }),
        class_validator_1.IsOptional(),
        class_validator_1.IsString(),
        class_transformer_1.Transform(function (_a) {
            var value = _a.value;
            return value === null || value === void 0 ? void 0 : value.trim();
        })
    ], CreateBlogDTO.prototype, "slug");
    return CreateBlogDTO;
}());
exports.CreateBlogDTO = CreateBlogDTO;
