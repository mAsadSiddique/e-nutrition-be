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
exports.UpdateCategoryDTO = void 0;
var swagger_1 = require("@nestjs/swagger");
var create_category_dto_1 = require("./create-category.dto");
var id_dto_1 = require("src/shared/dto/id.dto");
var UpdateCategoryDTO = /** @class */ (function (_super) {
    __extends(UpdateCategoryDTO, _super);
    function UpdateCategoryDTO() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UpdateCategoryDTO;
}(swagger_1.IntersectionType(id_dto_1.IdDTO, swagger_1.PartialType(swagger_1.PickType(create_category_dto_1.CreateCategoryDTO, ['name', 'isHot'])))));
exports.UpdateCategoryDTO = UpdateCategoryDTO;
