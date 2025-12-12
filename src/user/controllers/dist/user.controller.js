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
exports.UserController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var mock_ok_responses_1 = require("src/utils/mock_swagger_responses/mock_ok.responses");
var mock_error_responses_1 = require("src/utils/mock_swagger_responses/mock_error.responses");
var signup_dto_1 = require("../dtos/signup.dto");
var set_password_dto_1 = require("../dtos/set_password.dto");
var user_decorator_1 = require("src/auth/decorators/user.decorator");
var account_verification_dto_1 = require("../dtos/account_verification.dto");
var user_responses_1 = require("../mock_swagger_responses/user.responses");
var reset_password_dto_1 = require("../dtos/reset_password.dto");
var edit_user_profile_dto_1 = require("../dtos/edit_user_profile.dto");
var retry_account_verification_dto_1 = require("../dtos/retry_account_verification.dto");
var google_strategy_1 = require("../social_login-strategies/google.strategy");
var constant_1 = require("src/config/constant");
var response_messages_enum_1 = require("src/utils/enums/response-messages.enum");
var user_auth_guard_1 = require("src/auth/guard/user_auth.guard");
var login_dto_1 = require("src/shared/dto/login.dto");
var forgot_password_dto_1 = require("src/shared/dto/forgot_password.dto");
var change_password_dto_1 = require("src/shared/dto/change_password.dto");
var UserController = /** @class */ (function () {
    function UserController(userService, userAccountService) {
        this.userService = userService;
        this.userAccountService = userAccountService;
        this.logger = new common_1.Logger(UserController_1.name);
    }
    UserController_1 = UserController;
    UserController.prototype.signup = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.log("Request received to register a user with " + (args.email ? "email " + args.email : "phone number " + args.phoneNumber), this.signup.name);
                        return [4 /*yield*/, this.userAccountService.signup(args)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserController.prototype.accountVerification = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userAccountService.accountVerification(args)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserController.prototype.setPassword = function (args, user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userAccountService.setPassword(args, user)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserController.prototype.login = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userAccountService.login(args)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserController.prototype.forgotPassword = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userAccountService.forgotPassword(args)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserController.prototype.forgotPasswordUpdation = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userAccountService.userResetPassword(args)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserController.prototype.changePassword = function (args, user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userAccountService.changePassword(args, user)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserController.prototype.viewProfile = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.getUserProfile(user)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserController.prototype.editProfile = function (args, user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.editProfile(args, user)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserController.prototype.resendEmailOrSms = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userAccountService.resendEmailOrSms(args)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserController.prototype.googleAuth = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    UserController.prototype.googleAuthRedirect = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var cancelUrl, url;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // Handle cancel/denied consent gracefully: send user back to FE without extra params
                        if ((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.error) {
                            cancelUrl = constant_1.ENV.GOOGLE_LOGIN.CANCEL_REDIRECT_URL;
                            return [2 /*return*/, res.redirect(cancelUrl)];
                        }
                        return [4 /*yield*/, this.userAccountService.googleLogin(req === null || req === void 0 ? void 0 : req['user'])];
                    case 1:
                        url = _b.sent();
                        return [2 /*return*/, res.redirect(url)];
                }
            });
        });
    };
    UserController.prototype.checkUserAvailability = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.checkUserAvailability(args)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    var UserController_1;
    __decorate([
        swagger_1.ApiOperation({
            summary: 'User Registration',
            description: "This endpoint allows users to register for the application using their necessary details. Upon successful registration, users will be provided access to the application's features."
        }),
        swagger_1.ApiBody({ type: signup_dto_1.SignupDTO }),
        mock_ok_responses_1.MockOkResponses.sendEmptyResponse("" + response_messages_enum_1.RESPONSE_MESSAGES.EMAIL_VERIFICATION_CODE_SENT),
        mock_error_responses_1.MockErrorResponses.sendBbadRequestResponse(),
        mock_error_responses_1.MockErrorResponses.sendInternalServerErrorResponse(),
        common_1.Post('/signup'),
        __param(0, common_1.Body())
    ], UserController.prototype, "signup");
    __decorate([
        swagger_1.ApiOperation({
            summary: 'Account Verification',
            description: 'This endpoint allows users to verify their account and returns JWT token for immediate app access'
        }),
        swagger_1.ApiBody({ type: account_verification_dto_1.AccountVerificationDTO }),
        mock_ok_responses_1.MockOkResponses.sendOkResponse(user_responses_1.MockUserResponses.login),
        mock_error_responses_1.MockErrorResponses.sendBbadRequestResponse(),
        mock_error_responses_1.MockErrorResponses.sendInternalServerErrorResponse(),
        common_1.Put('/account/verification'),
        __param(0, common_1.Body())
    ], UserController.prototype, "accountVerification");
    __decorate([
        swagger_1.ApiOperation({
            summary: 'Set Password',
            description: 'This endpoint allows users to set a new password as part of the account verification. Typically used after receiving verification email.'
        }),
        swagger_1.ApiBody({ type: set_password_dto_1.SetPasswordDTO }),
        mock_error_responses_1.MockErrorResponses.sendBbadRequestResponse(),
        mock_error_responses_1.MockErrorResponses.sendForbiddenResponse(),
        mock_error_responses_1.MockErrorResponses.sendInternalServerErrorResponse(),
        common_1.UseGuards(user_auth_guard_1.UserAuthGuard),
        common_1.Put('/set/password'),
        __param(0, common_1.Body()), __param(1, user_decorator_1.user())
    ], UserController.prototype, "setPassword");
    __decorate([
        swagger_1.ApiOperation({
            summary: 'User Login',
            description: 'Authenticates a user using valid credentials (such as email and password) and returns an access token and user info upon successful login.'
        }),
        swagger_1.ApiBody({ type: login_dto_1.LoginDTO }),
        mock_ok_responses_1.MockOkResponses.sendOkResponse(user_responses_1.MockUserResponses.login),
        mock_error_responses_1.MockErrorResponses.sendBbadRequestResponse(),
        mock_error_responses_1.MockErrorResponses.sendForbiddenResponse(),
        mock_error_responses_1.MockErrorResponses.sendInternalServerErrorResponse(),
        common_1.Post('/login'),
        __param(0, common_1.Body())
    ], UserController.prototype, "login");
    __decorate([
        swagger_1.ApiOperation({
            summary: 'Forgot Password',
            description: "Initiates the password reset process by sending a reset link or code to the user's registered email or phone number."
        }),
        swagger_1.ApiBody({ type: forgot_password_dto_1.ForgotPasswordDTO }),
        mock_error_responses_1.MockErrorResponses.sendBbadRequestResponse(),
        mock_error_responses_1.MockErrorResponses.sendInternalServerErrorResponse(),
        common_1.Post('/forgot/password'),
        __param(0, common_1.Body())
    ], UserController.prototype, "forgotPassword");
    __decorate([
        swagger_1.ApiOperation({
            summary: 'Reset Password',
            description: 'Allows users to reset their password using a valid password reset token, typically received via email/phoneNumber.'
        }),
        swagger_1.ApiBody({ type: reset_password_dto_1.ResetPasswordDTO }),
        mock_error_responses_1.MockErrorResponses.sendBbadRequestResponse(),
        mock_error_responses_1.MockErrorResponses.sendInternalServerErrorResponse(),
        common_1.Put('/reset/password'),
        __param(0, common_1.Body())
    ], UserController.prototype, "forgotPasswordUpdation");
    __decorate([
        swagger_1.ApiOperation({
            summary: 'Change Password',
            description: 'Allows the authenticated user to change their current password by providing the old password and a new password.'
        }),
        swagger_1.ApiBody({ type: change_password_dto_1.ChangePasswordDTO }),
        mock_error_responses_1.MockErrorResponses.sendBbadRequestResponse(),
        mock_error_responses_1.MockErrorResponses.sendForbiddenResponse(),
        mock_error_responses_1.MockErrorResponses.sendInternalServerErrorResponse(),
        common_1.UseGuards(user_auth_guard_1.UserAuthGuard),
        common_1.Put('/change/password'),
        __param(0, common_1.Body()), __param(1, user_decorator_1.user())
    ], UserController.prototype, "changePassword");
    __decorate([
        swagger_1.ApiOperation({
            summary: 'Get Profile',
            description: "Retrieves the authenticated user's profile information, including personal details and account metadata."
        }),
        mock_error_responses_1.MockErrorResponses.sendBbadRequestResponse(),
        mock_error_responses_1.MockErrorResponses.sendInternalServerErrorResponse(),
        common_1.UseGuards(user_auth_guard_1.UserAuthGuard),
        common_1.Get('/profile'),
        __param(0, user_decorator_1.user())
    ], UserController.prototype, "viewProfile");
    __decorate([
        swagger_1.ApiOperation({
            summary: 'Edit Profile',
            description: 'Allows the authenticated user to update their profile information, such as name, bio, profile image, and other editable account details.'
        }),
        swagger_1.ApiBody({ type: edit_user_profile_dto_1.EditUserProfileDTO }),
        mock_error_responses_1.MockErrorResponses.sendBbadRequestResponse(),
        mock_error_responses_1.MockErrorResponses.sendInternalServerErrorResponse(),
        common_1.UseGuards(user_auth_guard_1.UserAuthGuard),
        common_1.Put('/profile'),
        __param(0, common_1.Body()), __param(1, user_decorator_1.user())
    ], UserController.prototype, "editProfile");
    __decorate([
        swagger_1.ApiOperation({
            summary: 'Resend Account Verification',
            description: 'This endpoint allows users to request a resend of the account verification email or SMS message to complete their account verification.'
        }),
        swagger_1.ApiBody({ type: retry_account_verification_dto_1.RetryAccountVerificationDTO }),
        mock_error_responses_1.MockErrorResponses.sendBbadRequestResponse(),
        mock_error_responses_1.MockErrorResponses.sendInternalServerErrorResponse(),
        common_1.Post('/resend/account/verification'),
        __param(0, common_1.Body())
    ], UserController.prototype, "resendEmailOrSms");
    __decorate([
        common_1.Get('/google'),
        common_1.UseGuards(google_strategy_1.GoogleAuthGuard)
    ], UserController.prototype, "googleAuth");
    __decorate([
        common_1.Get('/google/redirect'),
        common_1.UseGuards(google_strategy_1.GoogleAuthGuard),
        __param(0, common_1.Req()), __param(1, common_1.Res())
    ], UserController.prototype, "googleAuthRedirect");
    __decorate([
        swagger_1.ApiOperation({
            summary: 'Validate User Existance',
            description: 'Checks if a user already exists in the system using email or phone number. Returns appropriate response if user is found, not found, or pending verification.'
        }),
        swagger_1.ApiBody({ type: retry_account_verification_dto_1.RetryAccountVerificationDTO }),
        mock_error_responses_1.MockErrorResponses.sendBbadRequestResponse(),
        mock_error_responses_1.MockErrorResponses.sendInternalServerErrorResponse(),
        common_1.Post('/availability'),
        __param(0, common_1.Body())
    ], UserController.prototype, "checkUserAvailability");
    UserController = UserController_1 = __decorate([
        common_1.Controller('user')
    ], UserController);
    return UserController;
}());
exports.UserController = UserController;
