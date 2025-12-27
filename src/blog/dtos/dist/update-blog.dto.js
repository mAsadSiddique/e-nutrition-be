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
exports.UpdateBlogDTO = void 0;
var swagger_1 = require("@nestjs/swagger");
var id_dto_1 = require("src/shared/dto/id.dto");
var create_blog_dto_1 = require("./create-blog.dto");
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var RemoveMediaDTO = /** @class */ (function () {
    function RemoveMediaDTO() {
    }
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Enter image keys for deletion',
            nullable: true,
            type: Array,
            example: ['1747981199611Screenshot from 2025-04-30 14-48-57.png']
        }),
        class_validator_1.IsOptional(),
        class_transformer_1.Transform(function (_a) {
            var value = _a.value;
            return (typeof value === 'string' ? JSON.parse(value.replace(/\s+/g, '')) : value);
        }) // .replace(/\s+/g, '') remove all white spaces from string
        ,
        class_validator_1.ArrayMinSize(1)
    ], RemoveMediaDTO.prototype, "imageKeys");
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Enter video keys for deletion',
            nullable: true,
            type: Array,
            example: ['1747981199611Screenshot from 2025-04-30 14-48-57.png']
        }),
        class_validator_1.IsOptional(),
        class_transformer_1.Transform(function (_a) {
            var value = _a.value;
            return (typeof value === 'string' ? JSON.parse(value.replace(/\s+/g, '')) : value);
        }) // .replace(/\s+/g, '') remove all white spaces from string
        ,
        class_validator_1.ArrayMinSize(1)
    ], RemoveMediaDTO.prototype, "videoKeys");
    return RemoveMediaDTO;
}());
var UpdateBlogDTO = /** @class */ (function (_super) {
    __extends(UpdateBlogDTO, _super);
    function UpdateBlogDTO() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        swagger_1.ApiPropertyOptional({
            description: 'Media files to be removed',
            nullable: true,
            type: RemoveMediaDTO
        }),
        class_validator_1.IsOptional(),
        class_validator_1.ValidateNested()
    ], UpdateBlogDTO.prototype, "mediaToBeRemoved");
    return UpdateBlogDTO;
}(swagger_1.IntersectionType(id_dto_1.IdDTO, swagger_1.PartialType(create_blog_dto_1.CreateBlogDTO))));
exports.UpdateBlogDTO = UpdateBlogDTO;
