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
exports.BlogListingDTO = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var blog_entity_1 = require("../entities/blog.entity");
var pagination_dto_1 = require("src/shared/dto/pagination.dto");
var id_dto_1 = require("src/shared/dto/id.dto");
var create_blog_dto_1 = require("./create-blog.dto");
var BlogListingDTO = /** @class */ (function (_super) {
    __extends(BlogListingDTO, _super);
    function BlogListingDTO() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Filter by category ID',
            example: 1
        }),
        class_validator_1.IsOptional(),
        class_transformer_1.Type(function () { return Number; }),
        class_validator_1.IsPositive(),
        class_validator_1.IsInt()
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
        class_validator_1.Length(1, 100)
    ], BlogListingDTO.prototype, "search");
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Filter by created date from',
            example: '2024-01-01'
        }),
        class_validator_1.IsOptional(),
        class_validator_1.IsDateString()
    ], BlogListingDTO.prototype, "fromDate");
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Filter by created date to',
            example: '2024-12-31'
        }),
        class_validator_1.IsOptional(),
        class_validator_1.IsDateString()
    ], BlogListingDTO.prototype, "toDate");
    return BlogListingDTO;
}(swagger_1.IntersectionType(pagination_dto_1.PaginationDTO, swagger_1.PartialType(id_dto_1.IdDTO), swagger_1.PickType(create_blog_dto_1.CreateBlogDTO, ['tags']))));
exports.BlogListingDTO = BlogListingDTO;
