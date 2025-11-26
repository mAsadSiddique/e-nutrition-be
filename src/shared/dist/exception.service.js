"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ExceptionService = void 0;
var common_1 = require("@nestjs/common");
var ExceptionService = /** @class */ (function () {
    function ExceptionService() {
    }
    ExceptionService.prototype.sendNotAcceptableException = function (message) {
        throw new common_1.NotAcceptableException(message);
    };
    ExceptionService.prototype.sendNotFoundException = function (message) {
        throw new common_1.NotFoundException(message);
    };
    ExceptionService.prototype.sendInternalServerErrorException = function (message) {
        throw new common_1.InternalServerErrorException(message);
    };
    ExceptionService.prototype.sendConflictException = function (message) {
        throw new common_1.ConflictException(message);
    };
    ExceptionService.prototype.sendUnprocessableEntityException = function (message) {
        throw new common_1.UnprocessableEntityException(message);
    };
    ExceptionService.prototype.sendBadRequestException = function (message) {
        throw new common_1.BadRequestException(message);
    };
    ExceptionService.prototype.sendForbiddenException = function (message) {
        throw new common_1.ForbiddenException(message);
    };
    ExceptionService.prototype.sendUnauthorizedException = function (message) {
        throw new common_1.UnauthorizedException(message);
    };
    ExceptionService.prototype.sendUnsupportedMediaTypeException = function (message) {
        throw new common_1.UnsupportedMediaTypeException(message);
    };
    ExceptionService.prototype.sendGoneException = function (message) {
        throw new common_1.GoneException(message);
    };
    ExceptionService.prototype.sendTooManyRequestsException = function (message) {
        throw new common_1.HttpException({
            message: message,
            error: 'Too Many Requests',
            statusCode: common_1.HttpStatus.TOO_MANY_REQUESTS
        }, common_1.HttpStatus.TOO_MANY_REQUESTS);
    };
    ExceptionService = __decorate([
        common_1.Injectable()
    ], ExceptionService);
    return ExceptionService;
}());
exports.ExceptionService = ExceptionService;
