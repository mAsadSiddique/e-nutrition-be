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
exports.AdminAccountService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var constant_1 = require("src/config/constant");
var cache_manager_1 = require("@nestjs/cache-manager");
var randomString = require("randomstring");
var response_messages_enum_1 = require("src/utils/enums/response-messages.enum");
var mailer_1 = require("src/utils/mailer/mailer");
var admin_entity_1 = require("../entities/admin.entity");
var AdminAccountService = /** @class */ (function () {
    function AdminAccountService(accountVerificationCache, adminRepo, exceptionService, sharedService, adminService) {
        this.accountVerificationCache = accountVerificationCache;
        this.adminRepo = adminRepo;
        this.exceptionService = exceptionService;
        this.sharedService = sharedService;
        this.adminService = adminService;
        this.logger = new common_1.Logger(AdminAccountService_1.name);
    }
    AdminAccountService_1 = AdminAccountService;
    AdminAccountService.prototype.resendEmail = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var admin, password, isEmailSent, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.adminService.getAdminByEmail(args.email)];
                    case 1:
                        admin = _a.sent();
                        if (!admin)
                            this.exceptionService.sendNotFoundException(response_messages_enum_1.RESPONSE_MESSAGES.ADMIN_NOT_FOUND);
                        password = this.generateSecurePassword();
                        admin.password = this.sharedService.hashedPassword(password);
                        return [4 /*yield*/, this.adminRepo.update(admin.id, { password: admin.password })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, mailer_1.Mailer.sendAdminCredentials(args.email, (admin.firstName || '') + " " + (admin.lastName || ''), password)];
                    case 3:
                        isEmailSent = _a.sent();
                        if (!isEmailSent) {
                            this.exceptionService.sendInternalServerErrorException(response_messages_enum_1.RESPONSE_MESSAGES.EMAIL_RESEND_FAILED);
                        }
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.EMAIL_RESEND)];
                    case 4:
                        error_1 = _a.sent();
                        this.sharedService.sendError(error_1, this.resendEmail.name);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AdminAccountService.prototype.login = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var admin, user, msg, data, payload, jwtToken, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getUserOrThrowException({ email: args.email })];
                    case 1:
                        admin = _a.sent();
                        if (admin.isBlocked) {
                            this.exceptionService.sendForbiddenException(response_messages_enum_1.RESPONSE_MESSAGES.USER_BLOCKED);
                        }
                        if (!admin.isEmailVerified) {
                            this.exceptionService.sendUnprocessableEntityException(response_messages_enum_1.RESPONSE_MESSAGES.USER_EMAIL_UNVERIFIED);
                        }
                        this.sharedService.bcryptCompareVerificatoin(args.password, admin.password);
                        admin.password = undefined;
                        user = this.adminService.getPayload(admin);
                        msg = void 0;
                        data = {};
                        return [4 /*yield*/, this.adminService.profileData(admin)];
                    case 2:
                        user = _a.sent();
                        msg = response_messages_enum_1.RESPONSE_MESSAGES.LOGGED_IN;
                        data['user'] = user;
                        payload = this.adminService.getPayload(admin);
                        jwtToken = this.sharedService.getJwt(payload);
                        data['jwtToken'] = jwtToken;
                        return [2 /*return*/, this.sharedService.sendResponse(msg, data)];
                    case 3:
                        error_2 = _a.sent();
                        this.sharedService.sendError(error_2, this.login.name);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AdminAccountService.prototype.setPassword = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var admin, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.getUserOrThrowException({ email: args.email })];
                    case 1:
                        admin = _a.sent();
                        if (!this.sharedService.isValidPassword(constant_1.ENV.DEFAULT_USER.PASSWORD, admin.password)) {
                            this.exceptionService.sendNotFoundException(response_messages_enum_1.RESPONSE_MESSAGES.PASSWORD_ALREADY_SET);
                        }
                        this.sharedService.passwordsVerificatoin(args.password, args.confirmPassword);
                        return [4 /*yield*/, this.verifyAccountCode("setPassword" + args.email, args.code)];
                    case 2:
                        _a.sent();
                        admin.password = this.sharedService.hashedPassword(args.password);
                        admin.isEmailVerified = true;
                        return [4 /*yield*/, this.adminRepo.update(admin.id, { password: admin.password, isEmailVerified: admin.isEmailVerified })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.PASSWORD_SET)];
                    case 4:
                        error_3 = _a.sent();
                        this.sharedService.sendError(error_3, this.setPassword.name);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AdminAccountService.prototype.forgetPasswordRequest = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var admin, msg, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getUserOrThrowException(args)];
                    case 1:
                        admin = _a.sent();
                        if (!admin.isEmailVerified) {
                            this.exceptionService.sendForbiddenException(response_messages_enum_1.RESPONSE_MESSAGES.USER_EMAIL_UNVERIFIED);
                        }
                        return [4 /*yield*/, this.sendForgotPasswordCode(args)];
                    case 2:
                        msg = _a.sent();
                        return [2 /*return*/, this.sharedService.sendResponse(msg)];
                    case 3:
                        error_4 = _a.sent();
                        this.sharedService.sendError(error_4, this.forgetPasswordRequest.name);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Reset admin password using token or code
     * @param args Reset password data with token
     * @returns Success response
     */
    AdminAccountService.prototype.resetPassword = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var admin, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        this.logger.log('Processing password reset request');
                        admin = null;
                        if (!args.email) return [3 /*break*/, 3];
                        // Verify the email verification code
                        return [4 /*yield*/, this.verifyAccountCode("resetPassword" + args.email, args.code)];
                    case 1:
                        // Verify the email verification code
                        _a.sent();
                        this.logger.debug('Email verification code to reset password validated successfully', this.resetPassword.name);
                        return [4 /*yield*/, this.getUserOrThrowException({ email: args.email })];
                    case 2:
                        // Retrieve admin by email
                        admin = (_a.sent());
                        this.logger.debug("User found with email to reset password: " + admin.id, this.resetPassword.name);
                        return [3 /*break*/, 4];
                    case 3:
                        this.logger.error('No email or phone number provided for reset password', this.resetPassword.name);
                        this.exceptionService.sendBadRequestException(response_messages_enum_1.RESPONSE_MESSAGES.EMAIL_OR_PHONE_NUMBER_REQUIRED);
                        _a.label = 4;
                    case 4:
                        if (args.password !== args.confirmPassword) {
                            this.logger.warn('Password and confirm password do not match');
                            this.exceptionService.sendBadRequestException(response_messages_enum_1.RESPONSE_MESSAGES.PASSWORD_NOT_MATCHED);
                        }
                        admin.password = this.sharedService.hashedPassword(args.password);
                        return [4 /*yield*/, this.adminRepo.update({ id: admin.id }, { password: admin.password })];
                    case 5:
                        _a.sent();
                        this.logger.log("Password reset successful for admin: " + admin.id);
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.PASS_CHANGED_SUCCESSFULLY)];
                    case 6:
                        error_5 = _a.sent();
                        this.sharedService.jwtExceptionDetector(error_5);
                        this.sharedService.sendError(error_5, this.resetPassword.name);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    AdminAccountService.prototype.changePassword = function (args, user) {
        return __awaiter(this, void 0, void 0, function () {
            var admin, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getUserOrThrowException({ email: user.email })];
                    case 1:
                        admin = _a.sent();
                        this.logger.log("Change password request for user: " + admin.id);
                        // Validate admin registration type
                        // Check if new password is same as old password
                        if (args.oldPassword === args.password) {
                            this.exceptionService.sendBadRequestException(response_messages_enum_1.RESPONSE_MESSAGES.OLD_AND_NEW_PASSWORD_SHOULD_NOT_SAME);
                        }
                        if (!this.sharedService.isValidPassword(args.oldPassword, admin.password)) {
                            this.logger.warn('Old password verification failed');
                            this.exceptionService.sendForbiddenException(response_messages_enum_1.RESPONSE_MESSAGES.INVALID_OLD_PASSWORD);
                        }
                        if (args.password !== args.confirmPassword) {
                            this.logger.warn('Password and confirm password do not match');
                            this.exceptionService.sendBadRequestException(response_messages_enum_1.RESPONSE_MESSAGES.PASSWORD_NOT_MATCHED);
                        }
                        admin.password = this.sharedService.hashedPassword(args.password);
                        return [4 /*yield*/, this.adminRepo.update({ id: admin.id }, { password: admin.password })];
                    case 2:
                        _a.sent();
                        this.logger.log("Password changed successfully for admin: " + admin.id);
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.PASS_CHANGED_SUCCESSFULLY)];
                    case 3:
                        error_6 = _a.sent();
                        this.sharedService.sendError(error_6, this.changePassword.name);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AdminAccountService.prototype.addAdmin = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var adminInDb, admin, randomPassword, isEmailSent, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.adminService.getAdminByEmail(args.email)];
                    case 1:
                        adminInDb = _a.sent();
                        if (adminInDb) {
                            this.exceptionService.sendForbiddenException(response_messages_enum_1.RESPONSE_MESSAGES.ADMIN_ALREADY_EXIST);
                        }
                        admin = new admin_entity_1.Admin(args);
                        randomPassword = this.generateSecurePassword();
                        admin.password = this.sharedService.hashedPassword(randomPassword);
                        admin.isEmailVerified = true;
                        return [4 /*yield*/, mailer_1.Mailer.sendAdminCredentials(args.email, (args.firstName || '') + " " + (args.lastName || ''), randomPassword)];
                    case 2:
                        isEmailSent = _a.sent();
                        if (!isEmailSent) {
                            this.exceptionService.sendInternalServerErrorException('Failed to send admin credentials email');
                        }
                        return [4 /*yield*/, this.adminRepo.insert(admin)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.ADMIN_REGISTERED)];
                    case 4:
                        error_7 = _a.sent();
                        this.sharedService.sendError(error_7, this.addAdmin.name);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AdminAccountService.prototype.getUserOrThrowException = function (whereClause) {
        return __awaiter(this, void 0, void 0, function () {
            var admin, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.adminRepo.findOne({ where: whereClause })];
                    case 1:
                        admin = _a.sent();
                        if (!admin) {
                            this.exceptionService.sendNotFoundException(response_messages_enum_1.RESPONSE_MESSAGES.ADMIN_NOT_FOUND);
                        }
                        return [2 /*return*/, admin];
                    case 2:
                        error_8 = _a.sent();
                        this.sharedService.sendError(error_8, this.getUserOrThrowException.name);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AdminAccountService.prototype.verifyAccountCode = function (key, verificationCode) {
        return __awaiter(this, void 0, void 0, function () {
            var code, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.accountVerificationCache.get(key)];
                    case 1:
                        code = _a.sent();
                        if (!code)
                            this.exceptionService.sendForbiddenException(response_messages_enum_1.RESPONSE_MESSAGES.CODE_EXPIRED);
                        if (verificationCode !== code)
                            this.exceptionService.sendNotAcceptableException(response_messages_enum_1.RESPONSE_MESSAGES.INVALID_CODE);
                        return [4 /*yield*/, this.accountVerificationCache.del(key)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, code];
                    case 3:
                        error_9 = _a.sent();
                        this.sharedService.sendError(error_9, this.verifyAccountCode.name);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AdminAccountService.prototype.sendForgotPasswordCode = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var msg, code, iscodeSent, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        msg = void 0;
                        code = randomString.generate({ length: 6, charset: 'numeric' });
                        this.logger.debug("Verification code generated for user : " + args.email);
                        if (!args.email) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.accountVerificationCache.get("resetPassword" + args.email)];
                    case 1:
                        if (_a.sent()) {
                            this.exceptionService.sendForbiddenException(response_messages_enum_1.RESPONSE_MESSAGES.WAIT_TO_RESEND_AGAIN);
                        }
                        return [4 /*yield*/, mailer_1.Mailer.sendForgotPasswordCode(args.email, 'Admin', code)]; // code expiry time is 5 minute
                    case 2:
                        iscodeSent = _a.sent() // code expiry time is 5 minute
                        ;
                        if (!iscodeSent) {
                            this.exceptionService.sendInternalServerErrorException(response_messages_enum_1.RESPONSE_MESSAGES.EMAIL_RESEND_FAILED);
                        }
                        return [4 /*yield*/, this.accountVerificationCache.set("resetPassword" + args.email, code, 300000)]; // 5 * 60 * 1000 = 300000 seconds in MILLISECONDS (1000ms = 1s)
                    case 3:
                        _a.sent(); // 5 * 60 * 1000 = 300000 seconds in MILLISECONDS (1000ms = 1s)
                        msg = response_messages_enum_1.RESPONSE_MESSAGES.EMAIL_RESEND_CODE;
                        return [3 /*break*/, 5];
                    case 4:
                        // Currently using a default verification code for all phone numbers.
                        // Will implement random code generation and validation in the future.
                        msg = response_messages_enum_1.RESPONSE_MESSAGES.PHONE_NUMBER_NOT_SUPPORTED;
                        _a.label = 5;
                    case 5: return [2 /*return*/, msg];
                    case 6:
                        error_10 = _a.sent();
                        this.sharedService.sendError(error_10, this.sendForgotPasswordCode.name);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    AdminAccountService.prototype.sendSetPasswordCode = function (args, admin) {
        return __awaiter(this, void 0, void 0, function () {
            var msg, code, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        msg = response_messages_enum_1.RESPONSE_MESSAGES.EMAIL_VERIFICATION_CODE_SENT;
                        code = randomString.generate({ length: 6, charset: 'numeric' });
                        this.logger.debug("Set Password code generated for admin : " + args.email);
                        if (!args.email) return [3 /*break*/, 3];
                        if (admin.isEmailVerified) {
                            this.logger.warn("Admin email already verified: " + admin.id);
                            this.exceptionService.sendNotAcceptableException(response_messages_enum_1.RESPONSE_MESSAGES.ADMIN_EMAIL_ALREADY_VERIFIED);
                        }
                        return [4 /*yield*/, this.accountVerificationCache.get("setPassword" + args.email)];
                    case 1:
                        if (_a.sent()) {
                            this.exceptionService.sendForbiddenException(response_messages_enum_1.RESPONSE_MESSAGES.WAIT_TO_RESEND_AGAIN);
                        }
                        // send an email to admin for account verification
                        // TODO: Will send email verification code dynamically after settting up sendgrid templates
                        // const isVerificationSent = await Mailer.sendEmailVerificationCode(args.email, code, 5) // code expiry time is 5 minute
                        // if (!isVerificationSent) {
                        // 	this.exceptionService.sendInternalServerErrorException(ResponseMessagesEnum.VerificationCodeFailed)
                        // }
                        return [4 /*yield*/, this.accountVerificationCache.set("setPassword" + args.email, '123456', 300000)]; // 5 * 60 * 1000 = 300000 seconds in MILLISECONDS (1000ms = 1s)
                    case 2:
                        // send an email to admin for account verification
                        // TODO: Will send email verification code dynamically after settting up sendgrid templates
                        // const isVerificationSent = await Mailer.sendEmailVerificationCode(args.email, code, 5) // code expiry time is 5 minute
                        // if (!isVerificationSent) {
                        // 	this.exceptionService.sendInternalServerErrorException(ResponseMessagesEnum.VerificationCodeFailed)
                        // }
                        _a.sent(); // 5 * 60 * 1000 = 300000 seconds in MILLISECONDS (1000ms = 1s)
                        msg = response_messages_enum_1.RESPONSE_MESSAGES.EMAIL_VERIFICATION_CODE_SENT;
                        return [3 /*break*/, 4];
                    case 3:
                        // TODO: if we support phone number in future
                        msg = response_messages_enum_1.RESPONSE_MESSAGES.PHONE_NUMBER_NOT_SUPPORTED;
                        _a.label = 4;
                    case 4: return [2 /*return*/, msg];
                    case 5:
                        error_11 = _a.sent();
                        this.sharedService.sendError(error_11, this.sendSetPasswordCode.name);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    AdminAccountService.prototype.generateSecurePassword = function () {
        var uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var lowercase = 'abcdefghijklmnopqrstuvwxyz';
        var numbers = '0123456789';
        var specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        // Ensure at least one character from each required category
        var password = '';
        password += uppercase[Math.floor(Math.random() * uppercase.length)]; // At least 1 uppercase
        password += lowercase[Math.floor(Math.random() * lowercase.length)]; // At least 1 lowercase
        password += numbers[Math.floor(Math.random() * numbers.length)]; // At least 1 number
        password += specialChars[Math.floor(Math.random() * specialChars.length)]; // At least 1 special char
        // Fill the rest with random characters from all categories
        var allChars = uppercase + lowercase + numbers + specialChars;
        for (var i = 4; i < 12; i++) { // Total length 12 characters
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }
        // Shuffle the password to make it more random
        return password.split('').sort(function () { return Math.random() - 0.5; }).join('');
    };
    var AdminAccountService_1;
    AdminAccountService = AdminAccountService_1 = __decorate([
        common_1.Injectable(),
        __param(0, common_1.Inject(cache_manager_1.CACHE_MANAGER)),
        __param(1, typeorm_1.InjectRepository(admin_entity_1.Admin))
    ], AdminAccountService);
    return AdminAccountService;
}());
exports.AdminAccountService = AdminAccountService;
