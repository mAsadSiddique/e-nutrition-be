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
exports.CategoryService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var response_messages_enum_1 = require("../utils/enums/response-messages.enum");
var typeorm_2 = require("typeorm");
var category_entity_1 = require("./entites/category.entity");
var category_entities_enum_1 = require("src/utils/enums/category-entities.enum");
var CategoryService = /** @class */ (function () {
    function CategoryService(categoryRepo, exceptionService, sharedService, dataSource, userWishlistService) {
        this.categoryRepo = categoryRepo;
        this.exceptionService = exceptionService;
        this.sharedService = sharedService;
        this.dataSource = dataSource;
        this.userWishlistService = userWishlistService;
    }
    CategoryService.prototype.createCategory = function (args, entity) {
        return __awaiter(this, void 0, void 0, function () {
            var repo, categoryToInsert, categoriesToBeReturn, existing, parentCategory, _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, this.getRepoObjByEntityName(entity)];
                    case 1:
                        repo = _b.sent();
                        categoryToInsert = void 0;
                        categoriesToBeReturn = [];
                        if (!repo) return [3 /*break*/, 7];
                        return [4 /*yield*/, repo.findOne({ where: { name: args.name } })];
                    case 2:
                        existing = _b.sent();
                        if (existing) {
                            this.exceptionService.sendConflictException(response_messages_enum_1.RESPONSE_MESSAGES.CATEGORY_ALREADY_EXIST_WITH_NAME + ": " + args.name);
                        }
                        if (!args.parentId) return [3 /*break*/, 4];
                        return [4 /*yield*/, repo.findOne({ where: { id: args.parentId } })];
                    case 3:
                        parentCategory = _b.sent();
                        if (!parentCategory)
                            this.exceptionService.sendNotFoundException(response_messages_enum_1.RESPONSE_MESSAGES.PARENT_CATEGORY_NOT_FOUND);
                        _b.label = 4;
                    case 4:
                        if (!(entity === category_entities_enum_1.CategoryEntitiesEnum.CATEGORY)) return [3 /*break*/, 7];
                        categoryToInsert = new category_entity_1.Category(args);
                        return [4 /*yield*/, repo.insert(categoryToInsert)];
                    case 5:
                        _b.sent();
                        _a = this;
                        return [4 /*yield*/, this.fetchCategories(entity)];
                    case 6:
                        categoriesToBeReturn = _a.categoriesCache = (_b.sent());
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.CATEGORY_REGISTERED, categoriesToBeReturn)];
                    case 8:
                        error_1 = _b.sent();
                        this.sharedService.sendError(error_1, this.createCategory.name);
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    CategoryService.prototype.updateCategory = function (args, entity) {
        return __awaiter(this, void 0, void 0, function () {
            var repo, categoriesToBeReturn, category, existing, _a, _b, error_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 9, , 10]);
                        return [4 /*yield*/, this.getRepoObjByEntityName(entity)];
                    case 1:
                        repo = _c.sent();
                        categoriesToBeReturn = [];
                        if (!repo) return [3 /*break*/, 8];
                        return [4 /*yield*/, repo.findOne({ where: { id: args.id } })];
                    case 2:
                        category = _c.sent();
                        if (!category)
                            this.exceptionService.sendNotFoundException(response_messages_enum_1.RESPONSE_MESSAGES.CATEGORY_NOT_FOUND);
                        return [4 /*yield*/, repo.findOne({ where: { name: args.name } })];
                    case 3:
                        existing = _c.sent();
                        if (existing && existing.name !== category.name) {
                            this.exceptionService.sendConflictException(response_messages_enum_1.RESPONSE_MESSAGES.CATEGORY_ALREADY_EXIST_WITH_NAME + ": " + args.name);
                        }
                        Object.assign(category, args);
                        return [4 /*yield*/, repo.update(category.id, category)];
                    case 4:
                        _c.sent();
                        if (!(entity === category_entities_enum_1.CategoryEntitiesEnum.CATEGORY)) return [3 /*break*/, 6];
                        _a = this;
                        return [4 /*yield*/, this.fetchCategories(entity)];
                    case 5:
                        categoriesToBeReturn = _a.categoriesCache = (_c.sent());
                        return [3 /*break*/, 8];
                    case 6:
                        _b = this;
                        return [4 /*yield*/, this.fetchCategories(entity)];
                    case 7:
                        categoriesToBeReturn = _b.productCategoriesCache = (_c.sent());
                        _c.label = 8;
                    case 8: return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.CATEGORY_UPDATED, categoriesToBeReturn)];
                    case 9:
                        error_2 = _c.sent();
                        this.sharedService.sendError(error_2, this.updateCategory.name);
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    CategoryService.prototype.categoryListing = function (args, entity) {
        return __awaiter(this, void 0, void 0, function () {
            var categoriesToReturn, repo, _a, _b, _c, _d, _e, error_3;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 14, , 15]);
                        categoriesToReturn = void 0;
                        return [4 /*yield*/, this.getRepoObjByEntityName(entity)];
                    case 1:
                        repo = _f.sent();
                        if (!args.id) return [3 /*break*/, 5];
                        if (!repo) return [3 /*break*/, 3];
                        return [4 /*yield*/, repo.findOne({
                                where: { id: args.id }
                            })];
                    case 2:
                        _a = _f.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = undefined;
                        _f.label = 4;
                    case 4:
                        categoriesToReturn = _a;
                        return [3 /*break*/, 13];
                    case 5:
                        if (!(entity === category_entities_enum_1.CategoryEntitiesEnum.CATEGORY)) return [3 /*break*/, 9];
                        if (!this.categoriesCache) return [3 /*break*/, 6];
                        _b = (categoriesToReturn = this.categoriesCache);
                        return [3 /*break*/, 8];
                    case 6:
                        _c = this;
                        return [4 /*yield*/, this.fetchCategories(entity)];
                    case 7:
                        _b = (_c.categoriesCache = categoriesToReturn = _f.sent());
                        _f.label = 8;
                    case 8:
                        _b;
                        return [3 /*break*/, 13];
                    case 9:
                        if (!this.productCategoriesCache) return [3 /*break*/, 10];
                        _d = (categoriesToReturn = this.productCategoriesCache);
                        return [3 /*break*/, 12];
                    case 10:
                        _e = this;
                        return [4 /*yield*/, this.fetchCategories(entity)];
                    case 11:
                        _d = (_e.productCategoriesCache = categoriesToReturn = _f.sent());
                        _f.label = 12;
                    case 12:
                        _d;
                        _f.label = 13;
                    case 13: return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.CATEGORIES_LISTING, categoriesToReturn)];
                    case 14:
                        error_3 = _f.sent();
                        this.sharedService.sendError(error_3, this.categoryListing.name);
                        return [3 /*break*/, 15];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    CategoryService.prototype.listHotCategories = function () {
        return __awaiter(this, void 0, void 0, function () {
            var hotCategories, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.categoryRepo.find({
                                select: { id: true, name: true },
                                where: { isHot: true },
                                order: { name: 'ASC' }
                            })];
                    case 1:
                        hotCategories = _a.sent();
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.CATEGORIES_LISTING, { hotCategories: hotCategories })];
                    case 2:
                        error_4 = _a.sent();
                        this.sharedService.sendError(error_4, this.listHotCategories.name);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CategoryService.prototype.removeCategory = function (id, entity) {
        return __awaiter(this, void 0, void 0, function () {
            var repo, category, _a, categoriesToBeDeleted, runnable, temporaryCategoryHolder, _b, _c, _d, error_5;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 18, , 19]);
                        return [4 /*yield*/, this.getRepoObjByEntityName(entity)];
                    case 1:
                        repo = _e.sent();
                        if (!repo) return [3 /*break*/, 3];
                        return [4 /*yield*/, repo.findOne({ where: { id: id } })];
                    case 2:
                        _a = _e.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = undefined;
                        _e.label = 4;
                    case 4:
                        category = _a;
                        if (!category)
                            this.exceptionService.sendNotFoundException(response_messages_enum_1.RESPONSE_MESSAGES.CATEGORY_NOT_FOUND);
                        categoriesToBeDeleted = [id];
                        runnable = true;
                        return [4 /*yield*/, this.getSubCategories([id], entity)];
                    case 5:
                        temporaryCategoryHolder = _e.sent();
                        _e.label = 6;
                    case 6:
                        if (!temporaryCategoryHolder.length) return [3 /*break*/, 8];
                        categoriesToBeDeleted.push.apply(categoriesToBeDeleted, temporaryCategoryHolder);
                        return [4 /*yield*/, this.getSubCategories(temporaryCategoryHolder, entity)];
                    case 7:
                        temporaryCategoryHolder = _e.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        runnable = false;
                        _e.label = 9;
                    case 9:
                        if (runnable) return [3 /*break*/, 6];
                        _e.label = 10;
                    case 10:
                        if (!repo) return [3 /*break*/, 12];
                        return [4 /*yield*/, repo["delete"]({ id: typeorm_2.In(categoriesToBeDeleted) })];
                    case 11:
                        _b = _e.sent();
                        return [3 /*break*/, 13];
                    case 12:
                        _b = null;
                        _e.label = 13;
                    case 13:
                        _b;
                        if (!(entity === category_entities_enum_1.CategoryEntitiesEnum.CATEGORY)) return [3 /*break*/, 15];
                        _c = this;
                        return [4 /*yield*/, this.fetchCategories(entity)];
                    case 14:
                        _c.categoriesCache = _e.sent();
                        return [3 /*break*/, 17];
                    case 15:
                        _d = this;
                        return [4 /*yield*/, this.fetchCategories(entity)];
                    case 16:
                        _d.productCategoriesCache = _e.sent();
                        _e.label = 17;
                    case 17: return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.CATEGORY_DELETED)];
                    case 18:
                        error_5 = _e.sent();
                        this.sharedService.sendError(error_5, this.removeCategory.name);
                        return [3 /*break*/, 19];
                    case 19: return [2 /*return*/];
                }
            });
        });
    };
    CategoryService.prototype.fetchCategories = function (entity) {
        return __awaiter(this, void 0, void 0, function () {
            var categoriesToReturn, repo, categories, _a, _loop_1, _i, categories_1, category, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        categoriesToReturn = [];
                        return [4 /*yield*/, this.getRepoObjByEntityName(entity)];
                    case 1:
                        repo = _b.sent();
                        if (!repo) return [3 /*break*/, 3];
                        return [4 /*yield*/, repo.find({
                                order: { parentId: { direction: 'DESC', nulls: 'LAST' }, id: 'DESC' }
                            })];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = [];
                        _b.label = 4;
                    case 4:
                        categories = _a;
                        _loop_1 = function (category) {
                            if (category.parentId) {
                                var parentCategoryIndex = categories.findIndex(function (cat) { return cat.id === category.parentId; });
                                categories[parentCategoryIndex]['children']
                                    ? categories[parentCategoryIndex]['children'].push({
                                        id: category.id,
                                        name: category.name,
                                        children: category['children']
                                    })
                                    : (categories[parentCategoryIndex]['children'] = [
                                        { id: category.id, name: category.name, children: category['children'] },
                                    ]);
                            }
                            else {
                                categoriesToReturn.push({
                                    id: category.id,
                                    name: category.name,
                                    children: category['children']
                                });
                            }
                        };
                        for (_i = 0, categories_1 = categories; _i < categories_1.length; _i++) {
                            category = categories_1[_i];
                            _loop_1(category);
                        }
                        return [2 /*return*/, categoriesToReturn];
                    case 5:
                        error_6 = _b.sent();
                        this.sharedService.sendError(error_6, this.fetchCategories.name);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    CategoryService.prototype.getSubCategories = function (ids, entity) {
        return __awaiter(this, void 0, void 0, function () {
            var categoryToBeDeleted, repo, subCategories, _i, subCategories_1, element, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        categoryToBeDeleted = [];
                        return [4 /*yield*/, this.getRepoObjByEntityName(entity)];
                    case 1:
                        repo = _a.sent();
                        if (!repo) return [3 /*break*/, 3];
                        return [4 /*yield*/, repo.find({ where: { parentId: typeorm_2.In(ids) }, select: { id: true } })];
                    case 2:
                        subCategories = _a.sent();
                        if (subCategories) {
                            for (_i = 0, subCategories_1 = subCategories; _i < subCategories_1.length; _i++) {
                                element = subCategories_1[_i];
                                categoryToBeDeleted.push(element.id);
                            }
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/, categoryToBeDeleted];
                    case 4:
                        error_7 = _a.sent();
                        this.sharedService.sendError(error_7, this.getSubCategories.name);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CategoryService.prototype.getCategoryById = function (id, entity) {
        return __awaiter(this, void 0, void 0, function () {
            var repo, _a, error_8;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.getRepoObjByEntityName(entity)];
                    case 1:
                        repo = _b.sent();
                        if (!repo) return [3 /*break*/, 3];
                        return [4 /*yield*/, repo.findOne({ where: { id: id } })];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = undefined;
                        _b.label = 4;
                    case 4: return [2 /*return*/, _a];
                    case 5:
                        error_8 = _b.sent();
                        this.sharedService.sendError(error_8, this.getCategoryById.name);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    CategoryService.prototype.getAllChildCategoreisByParentId = function (id, entity) {
        return __awaiter(this, void 0, void 0, function () {
            var parentIds_1, idsToReturn_1, index, parentId, repo, categoris, _a, error_9;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, , 9]);
                        parentIds_1 = [id];
                        idsToReturn_1 = [id];
                        index = 0;
                        _b.label = 1;
                    case 1:
                        if (!(index < parentIds_1.length)) return [3 /*break*/, 7];
                        parentId = parentIds_1.pop();
                        return [4 /*yield*/, this.getRepoObjByEntityName(entity)];
                    case 2:
                        repo = _b.sent();
                        if (!repo) return [3 /*break*/, 4];
                        return [4 /*yield*/, repo.findBy({ parentId: parentId })];
                    case 3:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        _a = [];
                        _b.label = 5;
                    case 5:
                        categoris = _a;
                        categoris.forEach(function (categoty) {
                            idsToReturn_1.push(categoty.id);
                            parentIds_1.push(categoty.id);
                        });
                        _b.label = 6;
                    case 6:
                        index++;
                        return [3 /*break*/, 1];
                    case 7: return [2 /*return*/, idsToReturn_1];
                    case 8:
                        error_9 = _b.sent();
                        this.sharedService.sendError(error_9, this.getAllChildCategoreisByParentId.name);
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    CategoryService.prototype.getRepoObjByEntityName = function (entity) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.dataSource.getRepository(entity)];
                }
                catch (error) {
                    this.sharedService.sendError(error, this.getRepoObjByEntityName.name);
                }
                return [2 /*return*/];
            });
        });
    };
    CategoryService.prototype.userWishlistToggle = function (args, user) {
        return __awaiter(this, void 0, void 0, function () {
            var category, userWishlist, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.categoryRepo.findOne({ where: { id: args.id } })];
                    case 1:
                        category = _a.sent();
                        if (!category)
                            this.exceptionService.sendNotFoundException(response_messages_enum_1.RESPONSE_MESSAGES.CATEGORY_NOT_FOUND);
                        return [4 /*yield*/, this.userWishlistService.userWishlistToggle(args.id, user, 'category')];
                    case 2:
                        userWishlist = _a.sent();
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.WISHLIST_UPDATED_SUCCESSFULLY, { userWishlist: userWishlist })];
                    case 3:
                        error_10 = _a.sent();
                        this.sharedService.sendError(error_10, this.userWishlistToggle.name);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CategoryService.prototype.userWishlist = function (args, user) {
        return __awaiter(this, void 0, void 0, function () {
            var categories, categoryIds, userWishlist, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.categoryRepo.find({ where: { id: typeorm_2.In(args.ids) } })];
                    case 1:
                        categories = _a.sent();
                        if (!(categories === null || categories === void 0 ? void 0 : categories.length))
                            this.exceptionService.sendNotFoundException(response_messages_enum_1.RESPONSE_MESSAGES.CATEGORY_NOT_FOUND);
                        categoryIds = categories.map(function (category) { return category.id; });
                        return [4 /*yield*/, this.userWishlistService.userWishlist(categoryIds, user, 'category')];
                    case 2:
                        userWishlist = _a.sent();
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.WISHLIST_UPDATED_SUCCESSFULLY, { userWishlist: userWishlist })];
                    case 3:
                        error_11 = _a.sent();
                        this.sharedService.sendError(error_11, this.userWishlist.name);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CategoryService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(category_entity_1.Category))
    ], CategoryService);
    return CategoryService;
}());
exports.CategoryService = CategoryService;
