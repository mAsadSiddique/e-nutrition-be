"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.AdminService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var response_messages_enum_1 = require("src/utils/enums/response-messages.enum");
var typeorm_2 = require("typeorm");
var admin_entity_1 = require("../entities/admin.entity");
var guards_enum_1 = require("src/utils/enums/guards.enum");
var AdminService = /** @class */ (function () {
    function AdminService(adminRepo, exceptionService, sharedService) {
        this.adminRepo = adminRepo;
        this.exceptionService = exceptionService;
        this.sharedService = sharedService;
    }
    AdminService.prototype.getProfile = function (admin) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.profileData(admin)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.SUCCESS, data)];
                    case 2:
                        error_1 = _a.sent();
                        this.sharedService.sendError(error_1, this.getProfile.name);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AdminService.prototype.editProfile = function (editProfDto, admin) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        Object.assign(admin, editProfDto);
                        return [4 /*yield*/, this.adminRepo.save(admin)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getProfile(admin)];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.PROFILE_UPDATED, data)];
                    case 3:
                        error_2 = _a.sent();
                        this.sharedService.sendError(error_2, this.editProfile.name);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AdminService.prototype.blockAdminToggle = function (id, admin) {
        return __awaiter(this, void 0, void 0, function () {
            var adminInDB, msg, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (id === admin.id) {
                            this.exceptionService.sendUnprocessableEntityException(response_messages_enum_1.RESPONSE_MESSAGES.SELF_BLOCKING_NOT_ALLOWED);
                        }
                        return [4 /*yield*/, this.adminRepo.findOne({
                                where: { id: id }
                            })];
                    case 1:
                        adminInDB = _a.sent();
                        if (!adminInDB) {
                            this.exceptionService.sendNotFoundException(response_messages_enum_1.RESPONSE_MESSAGES.ADMIN_NOT_FOUND);
                        }
                        return [4 /*yield*/, this.adminRepo.update(id, { isBlocked: !adminInDB.isBlocked })];
                    case 2:
                        _a.sent();
                        msg = adminInDB.isBlocked ? response_messages_enum_1.RESPONSE_MESSAGES.ADMIN_UNBLOCKED : response_messages_enum_1.RESPONSE_MESSAGES.ADMIN_BLOCKED;
                        return [2 /*return*/, this.sharedService.sendResponse(msg)];
                    case 3:
                        error_3 = _a.sent();
                        this.sharedService.sendError(error_3, this.blockAdminToggle.name);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AdminService.prototype.updateAdminRole = function (args, admin) {
        return __awaiter(this, void 0, void 0, function () {
            var adminMember, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (args.id === admin.id) {
                            this.exceptionService.sendUnprocessableEntityException(response_messages_enum_1.RESPONSE_MESSAGES.SELF_UPDATION_NOT_ALLOWED);
                        }
                        return [4 /*yield*/, this.adminRepo.findOne({
                                where: { id: args.id }
                            })];
                    case 1:
                        adminMember = _a.sent();
                        if (!adminMember) {
                            this.exceptionService.sendNotFoundException(response_messages_enum_1.RESPONSE_MESSAGES.ADMIN_NOT_FOUND);
                        }
                        adminMember.role = args.role;
                        return [4 /*yield*/, this.adminRepo.save(adminMember)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.ADMIN_ROLE_UPDATED, { admin: adminMember })];
                    case 3:
                        error_4 = _a.sent();
                        this.sharedService.sendError(error_4, this.updateAdminRole.name);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AdminService.prototype.getAdminByEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.adminRepo.findOneBy({ email: email })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_5 = _a.sent();
                        this.sharedService.sendError(error_5, this.getAdminByEmail.name);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AdminService.prototype.getPayload = function (admin) {
        return {
            email: admin.email,
            firstName: admin.firstName,
            role: admin.role,
            type: guards_enum_1.GuardsEnum.ADMIN
        };
    };
    AdminService.prototype.profileData = function (admin) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, error_6;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 4, , 5]);
                        _a = {
                            firstName: admin.firstName,
                            lastName: admin.lastName,
                            email: admin.email,
                            role: admin.role,
                            isEmailVerified: admin.isEmailVerified,
                            isBlocked: admin.isBlocked,
                            isTwoFaEnable: admin.isTwoFaEnable,
                            twoFaAuth: admin.twoFaAuth,
                            createdAt: admin.createdAt,
                            updatedAt: admin.updatedAt,
                            fcmTokens: admin.fcmTokens,
                            isNotificationEnabled: admin.isNotificationEnabled
                        };
                        if (!(admin === null || admin === void 0 ? void 0 : admin.imageUrl)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.sharedService.getFileFromS3Bucket(admin.imageUrl)];
                    case 1:
                        _b = _c.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _b = null;
                        _c.label = 3;
                    case 3: return [2 /*return*/, (_a.imageUrl = _b,
                            _a)];
                    case 4:
                        error_6 = _c.sent();
                        throw error_6;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AdminService.prototype.adminsListing = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var whereClause, _a, admins, count, error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        whereClause = {};
                        if (args.hasOwnProperty('isBlocked') && args.isBlocked !== undefined) {
                            whereClause['isBlocked'] = args.isBlocked;
                        }
                        if (args.hasOwnProperty('isEmailVerified') && args.isEmailVerified !== undefined) {
                            whereClause['isEmailVerified'] = args.isEmailVerified;
                        }
                        if (args.id) {
                            whereClause['id'] = args.id;
                        }
                        if (args.role) {
                            whereClause['role'] = args.role;
                        }
                        if (args.search) {
                            whereClause = [
                                __assign(__assign({}, whereClause), { firstName: typeorm_2.ILike("%" + args.search + "%") }),
                                __assign(__assign({}, whereClause), { lastName: typeorm_2.ILike("%" + args.search + "%") }),
                                __assign(__assign({}, whereClause), { email: typeorm_2.ILike("%" + args.search + "%") })
                            ];
                        }
                        return [4 /*yield*/, this.adminRepo.findAndCount({
                                where: whereClause,
                                skip: args.pageNumber * args.pageSize,
                                take: args.pageSize,
                                order: { 'id': 'DESC' }
                            })];
                    case 1:
                        _a = _b.sent(), admins = _a[0], count = _a[1];
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.ADMIN_LISTING, { count: count, admins: admins })];
                    case 2:
                        error_7 = _b.sent();
                        this.sharedService.sendError(error_7, this.adminsListing.name);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AdminService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(admin_entity_1.Admin))
    ], AdminService);
    return AdminService;
}());
exports.AdminService = AdminService;
