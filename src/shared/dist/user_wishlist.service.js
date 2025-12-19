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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.UserWishlistService = void 0;
var common_1 = require("@nestjs/common");
var user_wihshlist_entity_1 = require("./entities/user_wihshlist.entity");
var typeorm_1 = require("@nestjs/typeorm");
var UserWishlistService = /** @class */ (function () {
    // This service can be used to manage user wishlists, such as adding or removing items.
    // It can also include methods to retrieve a user's wishlist or check if an item is in the wishlist.
    function UserWishlistService(userWishlistRepo, sharedService) {
        this.userWishlistRepo = userWishlistRepo;
        this.sharedService = sharedService;
    }
    /**
     * Toggles a single tasker/taskerService/task ID in the user's wishlist.
     * If the ID exists in the wishlist, it will be removed. If it doesn't exist, it will be added.
     * Uses upsert to insert or update based on userId.
     */
    UserWishlistService.prototype.userWishlistToggle = function (id, user, type) {
        return __awaiter(this, void 0, void 0, function () {
            var wishlist, currentWishlist, currentWishlist, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getUserWishlistByUserId(user.id)];
                    case 1:
                        wishlist = (_a.sent()) || new user_wihshlist_entity_1.UserWishlist();
                        wishlist.userId = user;
                        // Handle blog wishlist logic
                        if (type === 'blog') {
                            currentWishlist = wishlist.blogsWishlist || [];
                            if (currentWishlist.includes(id)) {
                                // Remove if exists
                                wishlist.blogsWishlist = currentWishlist.filter(function (itemId) { return itemId !== id; });
                            }
                            else {
                                // Add if doesn't exist
                                wishlist.blogsWishlist = __spreadArrays(currentWishlist, [id]);
                            }
                        }
                        // Handle category wishlist logic
                        if (type === 'category') {
                            currentWishlist = wishlist.categoriesWishlist || [];
                            if (currentWishlist.includes(id)) {
                                // Remove if exists
                                wishlist.categoriesWishlist = currentWishlist.filter(function (itemId) { return itemId !== id; });
                            }
                            else {
                                // Add if doesn't exist
                                wishlist.categoriesWishlist = __spreadArrays(currentWishlist, [id]);
                            }
                        }
                        // Upsert the wishlist based on userId
                        return [4 /*yield*/, this.userWishlistRepo.upsert([wishlist], ['userId'])];
                    case 2:
                        // Upsert the wishlist based on userId
                        _a.sent();
                        return [2 /*return*/, { blogsWishlist: wishlist.blogsWishlist, categoriesWishlist: wishlist.categoriesWishlist }];
                    case 3:
                        error_1 = _a.sent();
                        this.sharedService.sendError(error_1, this.userWishlistToggle.name);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserWishlistService.prototype.getUserWishlistByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var userWishlist, responseToSend, id, res, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.userWishlistRepo.findOne({
                                where: { userId: { id: userId } },
                                select: { id: true, blogsWishlist: true, categoriesWishlist: true }
                            })];
                    case 1:
                        userWishlist = _a.sent();
                        responseToSend = void 0;
                        if (userWishlist) {
                            id = userWishlist.id, res = __rest(userWishlist, ["id"]);
                            responseToSend = res;
                        }
                        return [2 /*return*/, responseToSend];
                    case 2:
                        error_2 = _a.sent();
                        this.sharedService.sendError(error_2, this.getUserWishlistByUserId.name);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserWishlistService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(user_wihshlist_entity_1.UserWishlist))
    ], UserWishlistService);
    return UserWishlistService;
}());
exports.UserWishlistService = UserWishlistService;
