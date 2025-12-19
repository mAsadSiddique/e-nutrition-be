"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.CategoryController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var response_messages_enum_1 = require("src/utils/enums/response-messages.enum");
var category_entity_1 = require("../entites/category.entity");
var admin_auth_guard_1 = require("src/auth/guard/admin_auth.guard");
var category_entities_enum_1 = require("src/utils/enums/category-entities.enum");
var user_decorator_1 = require("src/auth/decorators/user.decorator");
var user_auth_guard_1 = require("src/auth/guard/user_auth.guard");
var CategoryController = /** @class */ (function () {
    function CategoryController(categoryService) {
        this.categoryService = categoryService;
    }
    // TODO: we will apply guard for these endpoints later
    CategoryController.prototype.addCategory = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.categoryService.createCategory(args, category_entities_enum_1.CategoryEntitiesEnum.CATEGORY)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CategoryController.prototype.updateCategory = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.categoryService.updateCategory(args, category_entities_enum_1.CategoryEntitiesEnum.CATEGORY)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CategoryController.prototype.removeCategory = function (_a) {
        var id = _a.id;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.categoryService.removeCategory(id, category_entities_enum_1.CategoryEntitiesEnum.CATEGORY)];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    CategoryController.prototype.categories = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.categoryService.categoryListing(args, category_entities_enum_1.CategoryEntitiesEnum.CATEGORY)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CategoryController.prototype.hotCategories = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.categoryService.listHotCategories()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CategoryController.prototype.userWishlistToggle = function (args, user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.categoryService.userWishlistToggle(args, user)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    __decorate([
        swagger_1.ApiCreatedResponse({
            description: response_messages_enum_1.RESPONSE_MESSAGES.CATEGORY_REGISTERED,
            type: category_entity_1.Category
        }),
        common_1.UseGuards(admin_auth_guard_1.AdminAuthGuard),
        common_1.Post('/add'),
        __param(0, common_1.Body())
    ], CategoryController.prototype, "addCategory");
    __decorate([
        swagger_1.ApiCreatedResponse({
            description: response_messages_enum_1.RESPONSE_MESSAGES.CATEGORY_UPDATED,
            type: category_entity_1.Category
        }),
        swagger_1.ApiNotFoundResponse({
            description: response_messages_enum_1.RESPONSE_MESSAGES.CATEGORY_NOT_FOUND
        }),
        common_1.UseGuards(admin_auth_guard_1.AdminAuthGuard),
        common_1.Put('/update'),
        __param(0, common_1.Body())
    ], CategoryController.prototype, "updateCategory");
    __decorate([
        swagger_1.ApiCreatedResponse({
            description: response_messages_enum_1.RESPONSE_MESSAGES.CATEGORY_DELETED,
            type: category_entity_1.Category
        }),
        common_1.UseGuards(admin_auth_guard_1.AdminAuthGuard),
        common_1.Delete('/remove'),
        __param(0, common_1.Query())
    ], CategoryController.prototype, "removeCategory");
    __decorate([
        swagger_1.ApiCreatedResponse({
            description: response_messages_enum_1.RESPONSE_MESSAGES.CATEGORIES_LISTING,
            type: category_entity_1.Category
        }),
        common_1.Get('/'),
        __param(0, common_1.Query())
    ], CategoryController.prototype, "categories");
    __decorate([
        swagger_1.ApiCreatedResponse({
            description: response_messages_enum_1.RESPONSE_MESSAGES.CATEGORIES_LISTING,
            type: category_entity_1.Category
        }),
        common_1.Get('/hot')
    ], CategoryController.prototype, "hotCategories");
    __decorate([
        swagger_1.ApiCreatedResponse({
            description: response_messages_enum_1.RESPONSE_MESSAGES.USER_CATEGORIES_LISTING
        }),
        common_1.UseGuards(user_auth_guard_1.UserAuthGuard),
        common_1.Post('/wishlist/toggle'),
        __param(0, common_1.Body()), __param(1, user_decorator_1.user())
    ], CategoryController.prototype, "userWishlistToggle");
    CategoryController = __decorate([
        swagger_1.ApiTags('category'),
        swagger_1.ApiBearerAuth('JWT'),
        common_1.Controller('category')
    ], CategoryController);
    return CategoryController;
}());
exports.CategoryController = CategoryController;
