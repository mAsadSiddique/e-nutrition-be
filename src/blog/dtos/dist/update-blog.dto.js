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
exports.__esModule = true;
exports.UpdateBlogDTO = void 0;
var swagger_1 = require("@nestjs/swagger");
var id_dto_1 = require("src/shared/dto/id.dto");
var create_blog_dto_1 = require("./create-blog.dto");
var UpdateBlogDTO = /** @class */ (function (_super) {
    __extends(UpdateBlogDTO, _super);
    function UpdateBlogDTO() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UpdateBlogDTO;
}(swagger_1.IntersectionType(id_dto_1.IdDTO, swagger_1.PartialType(create_blog_dto_1.CreateBlogDTO))));
exports.UpdateBlogDTO = UpdateBlogDTO;
