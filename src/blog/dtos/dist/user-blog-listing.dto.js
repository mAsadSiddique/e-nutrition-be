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
exports.UserBlogListingDTO = exports.BlogSortBy = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var id_dto_1 = require("src/shared/dto/id.dto");
var pagination_dto_1 = require("src/shared/dto/pagination.dto");
var BlogSortBy;
(function (BlogSortBy) {
    BlogSortBy["LATEST"] = "latest";
    BlogSortBy["TRENDING"] = "trending";
})(BlogSortBy = exports.BlogSortBy || (exports.BlogSortBy = {}));
var UserBlogListingDTO = /** @class */ (function (_super) {
    __extends(UserBlogListingDTO, _super);
    function UserBlogListingDTO() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.sortBy = BlogSortBy.LATEST;
        return _this;
    }
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Filter by specific category ID',
            example: 1
        }),
        class_validator_1.IsOptional(),
        class_transformer_1.Type(function () { return Number; }),
        class_validator_1.IsPositive()
    ], UserBlogListingDTO.prototype, "categoryId");
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Sort blogs by latest or trending',
            "enum": BlogSortBy,
            "default": BlogSortBy.LATEST
        }),
        class_validator_1.IsOptional(),
        class_validator_1.IsEnum(BlogSortBy)
    ], UserBlogListingDTO.prototype, "sortBy");
    return UserBlogListingDTO;
}(swagger_1.IntersectionType(pagination_dto_1.PaginationDTO, swagger_1.PartialType(id_dto_1.IdDTO))));
exports.UserBlogListingDTO = UserBlogListingDTO;
