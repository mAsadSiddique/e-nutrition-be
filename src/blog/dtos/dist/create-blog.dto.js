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
exports.CreateBlogDTO = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var blog_entity_1 = require("../entities/blog.entity");
var dim_dto_1 = require("./dim.dto");
var CreateBlogDTO = /** @class */ (function (_super) {
    __extends(CreateBlogDTO, _super);
    function CreateBlogDTO() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        swagger_1.ApiProperty({
            description: 'Blog title',
            example: 'How to Build a NestJS Application'
        }),
        class_validator_1.IsNotEmpty(),
        class_validator_1.Length(1, 100),
        class_transformer_1.Transform(function (_a) {
            var value = _a.value;
            return value.trim();
        })
    ], CreateBlogDTO.prototype, "title");
    __decorate([
        swagger_1.ApiProperty({
            description: 'Blog content/body (HTML supported with headings, subheadings, images)',
            example: '<p>Hi This is our testing body content</p><p>This is small heading.<br></p>'
        }),
        class_validator_1.IsNotEmpty(),
        class_validator_1.Length(1, 5000)
    ], CreateBlogDTO.prototype, "content");
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Blog excerpt/summary',
            example: 'A brief summary of the blog post'
        }),
        class_validator_1.IsOptional(),
        class_validator_1.Length(1, 200)
    ], CreateBlogDTO.prototype, "excerpt");
    __decorate([
        swagger_1.ApiProperty({
            description: 'Array of category IDs (at least one required for publishing)',
            example: [1, 2],
            type: [Number]
        }),
        class_validator_1.IsNotEmpty(),
        class_validator_1.ArrayMinSize(1),
        class_validator_1.IsPositive({ each: true }),
        class_validator_1.IsInt({ each: true }),
        class_transformer_1.Transform(function (_a) {
            var value = _a.value;
            return value.split(',').map(Number);
        })
    ], CreateBlogDTO.prototype, "categoryIds");
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
        class_validator_1.Length(1, 100),
        class_transformer_1.Transform(function (_a) {
            var value = _a.value;
            return value === null || value === void 0 ? void 0 : value.trim();
        })
    ], CreateBlogDTO.prototype, "slug");
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'SEO title',
            example: 'NestJS Application Development Guide'
        }),
        class_validator_1.IsOptional(),
        class_validator_1.Length(1, 100),
        class_transformer_1.Transform(function (_a) {
            var value = _a.value;
            return value === null || value === void 0 ? void 0 : value.trim();
        })
    ], CreateBlogDTO.prototype, "seoTitle");
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'SEO description',
            example: 'Learn how to build a NestJS application from scratch'
        }),
        class_validator_1.IsOptional(),
        class_validator_1.Length(1, 200)
    ], CreateBlogDTO.prototype, "seoDescription");
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Blog tags (comma-separated or array)',
            example: ['nestjs', 'backend', 'api']
        }),
        class_validator_1.IsOptional(),
        class_transformer_1.Transform(function (_a) {
            var value = _a.value;
            return value.split(',').map(function (tag) { return tag.trim(); });
        }),
        class_validator_1.ArrayMinSize(1),
        class_validator_1.IsString({ each: true })
    ], CreateBlogDTO.prototype, "tags");
    return CreateBlogDTO;
}(dim_dto_1.ImgsDimDTO));
exports.CreateBlogDTO = CreateBlogDTO;
