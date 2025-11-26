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
exports.SetPasswordDTO = void 0;
var signup_dto_1 = require("./signup.dto");
var swagger_1 = require("@nestjs/swagger");
var SetPasswordDTO = /** @class */ (function (_super) {
    __extends(SetPasswordDTO, _super);
    function SetPasswordDTO() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SetPasswordDTO;
}(swagger_1.OmitType(signup_dto_1.SignupDTO, ['email', 'phoneNumber'])));
exports.SetPasswordDTO = SetPasswordDTO;
