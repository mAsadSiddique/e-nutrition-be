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
exports.UserAccountService = void 0;
var common_1 = require("@nestjs/common");
var user_entity_1 = require("../entities/user.entity");
var typeorm_1 = require("@nestjs/typeorm");
var user_enums_1 = require("../enums/user.enums");
var status_enum_1 = require("../enums/status.enum");
var bcrypt = require("bcrypt");
var constant_1 = require("src/config/constant");
var randomString = require("randomstring");
var cache_manager_1 = require("@nestjs/cache-manager");
var response_messages_enum_1 = require("src/utils/enums/response-messages.enum");
/**
 * Service responsible for user account management operations including:
 * - User registration
 * - Authentication
 * - Password management
 * - Account verification
 */
var UserAccountService = /** @class */ (function () {
    function UserAccountService(accountVerificationCache, userRepo, exceptionService, sharedService, jwtService, blogService, userWishlistService) {
        this.accountVerificationCache = accountVerificationCache;
        this.userRepo = userRepo;
        this.exceptionService = exceptionService;
        this.sharedService = sharedService;
        this.jwtService = jwtService;
        this.blogService = blogService;
        this.userWishlistService = userWishlistService;
        this.logger = new common_1.Logger(UserAccountService_1.name);
    }
    UserAccountService_1 = UserAccountService;
    /**
     * Register a new user
     * @param args User signup data
     * @returns Response with success message
     */
    UserAccountService.prototype.signup = function (args, userType) {
        if (userType === void 0) { userType = user_enums_1.UserTypeEnum.USER; }
        return __awaiter(this, void 0, void 0, function () {
            var user, _a, _b, msg, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 11, , 12]);
                        this.logger.log("Attempting to register user with email: " + (args.email || 'N/A') + " or phone: " + (args.phoneNumber || 'N/A'));
                        // verify the password and confirm password are same
                        if (args.password !== args.confirmPassword) {
                            this.logger.warn('Password and confirm password do not match');
                            this.exceptionService.sendBadRequestException(response_messages_enum_1.RESPONSE_MESSAGES.PASSWORD_NOT_MATCHED);
                        }
                        return [4 /*yield*/, this.checkUserExistance(args.email, args.phoneNumber, args.username)];
                    case 1:
                        user = _c.sent();
                        if (!!user) return [3 /*break*/, 5];
                        user = new user_entity_1.User(args);
                        _a = user;
                        if (!args.username) return [3 /*break*/, 2];
                        _b = args.username;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.generateUniqueUsername(constant_1.ENV.DEFAULT_USER.NAME)];
                    case 3:
                        _b = _c.sent();
                        _c.label = 4;
                    case 4:
                        _a.username = _b;
                        _c.label = 5;
                    case 5:
                        // Hash password and set registration type
                        user.password = bcrypt.hashSync(args.password, constant_1.ENV.JWT.SALT_ROUNDS);
                        user.registrationType = args.email ? user_enums_1.RegisterationTypeEnum.EMAIL : user_enums_1.RegisterationTypeEnum.PHONE;
                        user.userType = userType;
                        if (!!user.id) return [3 /*break*/, 7];
                        user.status = status_enum_1.UserStatusEnum.VERIFICATION_PENDING;
                        return [4 /*yield*/, this.userRepo.insert(user)];
                    case 6:
                        _c.sent();
                        this.logger.log("New user created with ID: " + user.id);
                        return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, this.userRepo.update({ id: user.id }, user)];
                    case 8:
                        _c.sent();
                        this.logger.log("Existing user updated with ID: " + user.id);
                        _c.label = 9;
                    case 9: return [4 /*yield*/, this.sendAccountVerificationCode(args, user)];
                    case 10:
                        msg = _c.sent();
                        this.logger.log("Verification code sent successfully for user " + user.id, this.signup.name);
                        return [2 /*return*/, this.sharedService.sendResponse(msg, userType === user_enums_1.UserTypeEnum.TASKER ? user : null)];
                    case 11:
                        error_1 = _c.sent();
                        this.sharedService.sendError(error_1, this.signup.name);
                        return [3 /*break*/, 12];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Generates a unique username by appending a random 6-character string to the provided base username.
     * Checks the database to ensure the resulting username is not already taken.
     *
     * @param username - The base username to start with.
     * @returns A unique username string.
     */
    UserAccountService.prototype.generateUniqueUsername = function (baseName) {
        return __awaiter(this, void 0, void 0, function () {
            var username, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        username = void 0;
                        _a.label = 1;
                    case 1:
                        username = baseName + this.sharedService.generateRandomString(6);
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.userRepo.findOneBy({ username: username })];
                    case 3:
                        if (_a.sent()) return [3 /*break*/, 1];
                        _a.label = 4;
                    case 4: return [2 /*return*/, username];
                    case 5:
                        error_2 = _a.sent();
                        this.sharedService.sendError(error_2, this.generateUniqueUsername.name);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Authenticate a user and generate JWT token
     * @param args Login credentials
     * @returns JWT token and user information
     */
    UserAccountService.prototype.login = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var whereClause, user, msg, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        whereClause = args.email ? { email: args.email } : { phoneNumber: args.phoneNumber };
                        return [4 /*yield*/, this.userRepo.findOne({
                                select: {
                                    id: true,
                                    username: true,
                                    email: true,
                                    phoneNumber: true,
                                    registrationType: true,
                                    firstName: true,
                                    lastName: true,
                                    address: true,
                                    status: true,
                                    password: true,
                                    profileImage: { url: true },
                                    userType: true,
                                    userVerifications: true
                                },
                                where: whereClause
                            })
                            // Validate user existence
                        ];
                    case 1:
                        user = _a.sent();
                        // Validate user existence
                        if (!user) {
                            this.logger.warn("User not found: " + args.email);
                            this.exceptionService.sendNotFoundException(response_messages_enum_1.RESPONSE_MESSAGES.USER_NOT_FOUND);
                        }
                        // Validate registration type
                        if (user.registrationType !== user_enums_1.RegisterationTypeEnum.EMAIL && user.registrationType !== user_enums_1.RegisterationTypeEnum.PHONE) {
                            this.logger.warn("Invalid registration type for user: " + user.id);
                            this.exceptionService.sendUnprocessableEntityException(response_messages_enum_1.RESPONSE_MESSAGES.RegisteredNotWithThisMethod);
                        }
                        // Check user account status
                        if (user.status !== status_enum_1.UserStatusEnum.ACTIVE) {
                            msg = user.status === status_enum_1.UserStatusEnum.VERIFICATION_PENDING ? response_messages_enum_1.RESPONSE_MESSAGES.UserVerificationPending : response_messages_enum_1.RESPONSE_MESSAGES.USER_BLOCKED;
                            this.logger.warn("User status check failed: " + msg + " for user: " + user.id);
                            this.exceptionService.sendForbiddenException(msg);
                        }
                        if (args.email && !user.userVerifications.email)
                            this.exceptionService.sendForbiddenException(response_messages_enum_1.RESPONSE_MESSAGES.EmailVerificationPending);
                        if (args.phoneNumber && !user.userVerifications.phoneNumber)
                            this.exceptionService.sendForbiddenException(response_messages_enum_1.RESPONSE_MESSAGES.PhoneVerificationPending);
                        // Validate password
                        if (!bcrypt.compareSync(args.password, user.password)) {
                            this.logger.warn("Invalid password attempt for user: " + user.id);
                            this.exceptionService.sendForbiddenException(response_messages_enum_1.RESPONSE_MESSAGES.INVALID_PASSWORD);
                        }
                        this.logger.log("User logged in successfully: " + user.id);
                        return [4 /*yield*/, this.generateJwtAndSendResponse(user, false)]; // returning false as it's normal login not for verification
                    case 2: return [2 /*return*/, _a.sent()]; // returning false as it's normal login not for verification
                    case 3:
                        error_3 = _a.sent();
                        this.sharedService.sendError(error_3, this.login.name);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Handles Google social login and user creation/update logic.
     *
     * If the user doesn't exist, it creates a new one with a unique username and hashed password.
     * If the user exists but is in VERIFICATION_PENDING status, it activates the user.
     * Finally, it returns a redirect URL depending on the result.
     *
     * @param args - UserSocialLoginType object containing email, username, and password (from Google).
     * @returns A redirect URL indicating the login status.
     */
    UserAccountService.prototype.googleLogin = function (args) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var user, url, _c, _d, phoneVerificationStatus, error_4;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 10, , 11]);
                        user = void 0;
                        url = constant_1.ENV.FE_REDIRECT_PAGES.SOCIAL_MEDIA_REDIRECT_URL + "?status=404";
                        if (!args) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.userRepo.findOneBy({ email: args.email })];
                    case 1:
                        user = (_e.sent()) || new user_entity_1.User(args);
                        if (!!user.id) return [3 /*break*/, 6];
                        _c = user;
                        if (!args.username) return [3 /*break*/, 2];
                        _d = args.username;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.generateUniqueUsername(constant_1.ENV.DEFAULT_USER.NAME)];
                    case 3:
                        _d = _e.sent();
                        _e.label = 4;
                    case 4:
                        _c.username = _d;
                        user.password = bcrypt.hashSync(args === null || args === void 0 ? void 0 : args.password, constant_1.ENV.JWT.SALT_ROUNDS);
                        user.status = status_enum_1.UserStatusEnum.ACTIVE;
                        user.registrationType = user_enums_1.RegisterationTypeEnum.GOOGLE;
                        // Set phone number if provided in Google response
                        if (args.phoneNumber) {
                            user.phoneNumber = args.phoneNumber;
                        }
                        // For new Google users: email=true, phone verification depends on whether phone is provided
                        user.userVerifications = { email: true, phoneNumber: !!args.phoneNumber };
                        return [4 /*yield*/, this.userRepo.insert(user)];
                    case 5:
                        _e.sent();
                        this.logger.log("[GoogleLogin] New user registered successfully. Username: " + user.username + ". Email: true, Phone: " + !!args.phoneNumber, this.googleLogin.name);
                        return [3 /*break*/, 8];
                    case 6:
                        if (!(user.status === status_enum_1.UserStatusEnum.VERIFICATION_PENDING || user.userVerifications.email === false)) return [3 /*break*/, 8];
                        // For existing users with pending verification, activate them
                        // Only set email verification to true if they are Google users
                        user.status = status_enum_1.UserStatusEnum.ACTIVE;
                        // Update phone number if provided in Google response
                        if (args.phoneNumber) {
                            user.phoneNumber = args.phoneNumber;
                        }
                        phoneVerificationStatus = args.phoneNumber ? true : ((_b = (_a = user.userVerifications) === null || _a === void 0 ? void 0 : _a.phoneNumber) !== null && _b !== void 0 ? _b : false);
                        user.userVerifications = { email: true, phoneNumber: phoneVerificationStatus };
                        return [4 /*yield*/, this.userRepo.update({ id: user.id }, {
                                status: user.status,
                                phoneNumber: user.phoneNumber,
                                userVerifications: user.userVerifications
                            })];
                    case 7:
                        _e.sent();
                        this.logger.log("[GoogleLogin] Existing user with pending verification was successfully activated: " + user.username, this.googleLogin.name);
                        _e.label = 8;
                    case 8:
                        url = this.getSocialMediaLoginRedirectUrl(user);
                        _e.label = 9;
                    case 9:
                        this.logger.log("[GoogleLogin] Redirecting to URL: " + url, this.googleLogin.name);
                        return [2 /*return*/, url];
                    case 10:
                        error_4 = _e.sent();
                        this.sharedService.sendError(error_4, this.googleLogin.name);
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Generates a redirect URL after successful social media login.
     *
     * It creates a JWT token based on the user's login payload and appends it,
     * along with the user payload, to the redirect URL as query parameters.
     *
     * @param user - The authenticated user entity.
     * @returns A redirect URL containing status, token, and user payload.
     */
    UserAccountService.prototype.getSocialMediaLoginRedirectUrl = function (user) {
        try {
            this.logger.log("[RedirectURL] Generating redirect URL for user: " + user.username, this.getSocialMediaLoginRedirectUrl.name);
            // Generate the login payload
            var payload = this.getLoginPayload(user);
            this.logger.log("[RedirectURL] Original payload registrationType: " + payload.registrationType, this.getSocialMediaLoginRedirectUrl.name);
            // Override registrationType to GOOGLE in JWT payload for Google login, regardless of database value
            payload.registrationType = user_enums_1.RegisterationTypeEnum.GOOGLE;
            this.logger.log("[RedirectURL] Modified payload registrationType: " + payload.registrationType, this.getSocialMediaLoginRedirectUrl.name);
            var token = this.jwtService.sign(payload);
            // Return final redirect URL with query params
            return constant_1.ENV.FE_REDIRECT_PAGES.SOCIAL_MEDIA_REDIRECT_URL + "?status=200&token=" + token + "&user=" + JSON.stringify(payload);
        }
        catch (error) {
            this.sharedService.sendError(error, this.getSocialMediaLoginRedirectUrl.name);
        }
    };
    /**
     * Constructs the payload object for user login.
     *
     * This payload is used for generating JWT tokens and for including
     * minimal user info in the login redirect process.
     *
     * @param user - The authenticated user entity.
     * @returns A simplified user object with login details.
     */
    UserAccountService.prototype.getLoginPayload = function (user) {
        return {
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            registrationType: user.registrationType,
            userType: user.userType,
            login: true
        };
    };
    /**
     * Set initial password for users registered via social or invited users
     * @param args Password data
     * @param user Authenticated user
     * @returns Success response
     */
    UserAccountService.prototype.setPassword = function (args, user) {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.logger.log("Setting password for user: " + user.id);
                        // Check if user already has a custom password set
                        if ((user.registrationType === user_enums_1.RegisterationTypeEnum.EMAIL || user.registrationType === user_enums_1.RegisterationTypeEnum.PHONE) && user.password !== constant_1.ENV.DEFAULT_USER.PASSWORD) {
                            this.logger.warn("Password already set for user: " + user.id);
                            this.exceptionService.sendForbiddenException(response_messages_enum_1.RESPONSE_MESSAGES.PASSWORD_ALREADY_SET);
                        }
                        // Validate password match
                        if (args.password !== args.confirmPassword) {
                            this.logger.warn('Password and confirm password do not match');
                            this.exceptionService.sendBadRequestException(response_messages_enum_1.RESPONSE_MESSAGES.PASSWORD_NOT_MATCHED);
                        }
                        // Hash and update password
                        user.password = bcrypt.hashSync(args.password, constant_1.ENV.JWT.SALT_ROUNDS);
                        user.registrationType = user_enums_1.RegisterationTypeEnum.EMAIL;
                        user.status = status_enum_1.UserStatusEnum.ACTIVE;
                        return [4 /*yield*/, this.userRepo.update({ id: user.id }, user)];
                    case 1:
                        _a.sent();
                        this.logger.log("Password set successfully for user: " + user.id);
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.UserPasswordUpdated, null)];
                    case 2:
                        error_5 = _a.sent();
                        this.sharedService.sendError(error_5, this.setPassword.name);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Initiate forgot password process
     * @param args Email or phone for password recovery
     * @returns Success response
     */
    UserAccountService.prototype.forgotPassword = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var whereClause, user, msg_1, msg, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        this.logger.log("Forgot password request for: " + args.email);
                        whereClause = args.email ? { email: args.email } : { phoneNumber: args.phoneNumber };
                        return [4 /*yield*/, this.getUserOrThrowException(whereClause)];
                    case 1:
                        user = _a.sent();
                        // Check user account status
                        if (user.status !== status_enum_1.UserStatusEnum.ACTIVE) {
                            msg_1 = user.status === status_enum_1.UserStatusEnum.VERIFICATION_PENDING ? response_messages_enum_1.RESPONSE_MESSAGES.UserVerificationPending : response_messages_enum_1.RESPONSE_MESSAGES.USER_BLOCKED;
                            this.logger.warn("User status check failed: " + msg_1 + " for user: " + user.id);
                            this.exceptionService.sendForbiddenException(msg_1);
                        }
                        return [4 /*yield*/, this.sendForgotPasswordCode(args)];
                    case 2:
                        msg = _a.sent();
                        return [2 /*return*/, this.sharedService.sendResponse(msg, null)];
                    case 3:
                        error_6 = _a.sent();
                        this.sharedService.sendError(error_6, this.forgotPassword.name);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Reset user password using token or code
     * @param args Reset password data with token
     * @returns Success response
     */
    UserAccountService.prototype.userResetPassword = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var user, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        this.logger.log('Processing password reset request');
                        user = null;
                        if (!args.email) return [3 /*break*/, 3];
                        // Verify the email verification code
                        return [4 /*yield*/, this.verifyAccountCode("resetPassword" + args.email, args.code)];
                    case 1:
                        // Verify the email verification code
                        _a.sent();
                        this.logger.debug('Email verification code to reset password validated successfully', this.userResetPassword.name);
                        return [4 /*yield*/, this.getUserOrThrowException({ email: args.email })];
                    case 2:
                        // Retrieve user by email
                        user = (_a.sent());
                        this.logger.debug("User found with email to reset password: " + user.id, this.userResetPassword.name);
                        return [3 /*break*/, 7];
                    case 3:
                        if (!args.phoneNumber) return [3 /*break*/, 6];
                        // Verify the phone verification code (Fixed: was using args.email instead of args.phoneNumber)
                        return [4 /*yield*/, this.verifyAccountCode("resetPassword" + args.phoneNumber, args.code)];
                    case 4:
                        // Verify the phone verification code (Fixed: was using args.email instead of args.phoneNumber)
                        _a.sent();
                        this.logger.debug('Phone code validated to reset password successfully', this.userResetPassword.name);
                        return [4 /*yield*/, this.getUserOrThrowException({ phoneNumber: args.phoneNumber })];
                    case 5:
                        // Retrieve user by phone number
                        user = (_a.sent());
                        this.logger.debug("User found with phone number to reset password: " + user.id, this.userResetPassword.name);
                        return [3 /*break*/, 7];
                    case 6:
                        this.logger.error('No email or phone number provided for reset password', this.userResetPassword.name);
                        this.exceptionService.sendBadRequestException(response_messages_enum_1.RESPONSE_MESSAGES.EMAIL_OR_PHONE_NUMBER_REQUIRED);
                        _a.label = 7;
                    case 7:
                        if (args.password !== args.confirmPassword) {
                            this.logger.warn('Password and confirm password do not match');
                            this.exceptionService.sendBadRequestException(response_messages_enum_1.RESPONSE_MESSAGES.PASSWORD_NOT_MATCHED);
                        }
                        user.password = bcrypt.hashSync(args.password, constant_1.ENV.JWT.SALT_ROUNDS);
                        return [4 /*yield*/, this.userRepo.update({ id: user.id }, { password: user.password })];
                    case 8:
                        _a.sent();
                        this.logger.log("Password reset successful for user: " + user.id);
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.UserPasswordReset, null)];
                    case 9:
                        error_7 = _a.sent();
                        this.sharedService.jwtExceptionDetector(error_7);
                        this.sharedService.sendError(error_7, this.userResetPassword.name);
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Change user password (requires old password verification)
     * @param args Change password data
     * @param user Authenticated user
     * @returns Success response
     */
    UserAccountService.prototype.changePassword = function (args, user) {
        return __awaiter(this, void 0, void 0, function () {
            var error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.logger.log("Change password request for user: " + user.id);
                        // Validate user registration type
                        if (user.registrationType !== user_enums_1.RegisterationTypeEnum.EMAIL && user.registrationType !== user_enums_1.RegisterationTypeEnum.PHONE) {
                            this.logger.warn("Invalid registration type for password change: " + user.registrationType);
                            this.exceptionService.sendForbiddenException(response_messages_enum_1.RESPONSE_MESSAGES.RegisteredNotWithThisMethod);
                        }
                        // Check if new password is same as old password
                        if (args.oldPassword === args.password) {
                            this.exceptionService.sendBadRequestException(response_messages_enum_1.RESPONSE_MESSAGES.OLD_AND_NEW_PASSWORD_SHOULD_NOT_SAME);
                        }
                        // Verify old password
                        if (!bcrypt.compareSync(args.oldPassword, user.password)) {
                            this.logger.warn('Old password verification failed');
                            this.exceptionService.sendForbiddenException(response_messages_enum_1.RESPONSE_MESSAGES.INVALID_PASSWORD);
                        }
                        // Check if password and confirm password match
                        if (args.password !== args.confirmPassword) {
                            this.logger.warn('Password and confirm password do not match');
                            this.exceptionService.sendBadRequestException(response_messages_enum_1.RESPONSE_MESSAGES.PASSWORD_NOT_MATCHED);
                        }
                        // Hash and update the new password
                        user.password = bcrypt.hashSync(args.password, constant_1.ENV.JWT.SALT_ROUNDS);
                        return [4 /*yield*/, this.userRepo.update({ id: user.id }, { password: user.password })];
                    case 1:
                        _a.sent();
                        this.logger.log("Password changed successfully for user: " + user.id);
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.UserPasswordUpdated, null)];
                    case 2:
                        error_8 = _a.sent();
                        this.sharedService.sendError(error_8, this.changePassword.name);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Resend verification email or SMS
     * @param args User identification data
     * @returns Success response
     */
    UserAccountService.prototype.resendEmailOrSms = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var whereClause, user, msg, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        this.logger.log("Resend verification request for: " + (args.email || args.phoneNumber));
                        whereClause = args.email ? { email: args.email } : { phoneNumber: args.phoneNumber };
                        return [4 /*yield*/, this.getUserOrThrowException(whereClause)];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, this.sendAccountVerificationCode(args, user)];
                    case 2:
                        msg = _a.sent();
                        return [2 /*return*/, this.sharedService.sendResponse(msg, null)];
                    case 3:
                        error_9 = _a.sent();
                        this.sharedService.sendError(error_9, this.resendEmailOrSms.name);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Verifies user account using email or phone number verification code
     * Updates user verification status and activates the account upon successful verification
     *
     * @param args - Account verification data containing email/phone and verification code
     * @returns Promise<ApiSuccessResponse<null>> - Success response with verification confirmation
     * @throws ForbiddenException - When verification code is expired or invalid
     * @throws NotAcceptableException - When email/phone is already verified
     * @throws NotFoundException - When user is not found
     */
    UserAccountService.prototype.accountVerification = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var user, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 10, , 11]);
                        // Log the start of account verification process
                        this.logger.log('Processing account verification request', this.accountVerification.name);
                        this.logger.debug("Verification attempt for email: " + args.email, this.accountVerification.name);
                        user = null;
                        if (!args.email) return [3 /*break*/, 3];
                        this.logger.log('Starting email verification process', this.accountVerification.name);
                        // Verify the email verification code
                        return [4 /*yield*/, this.verifyAccountCode("verify" + args.email, args.code)];
                    case 1:
                        // Verify the email verification code
                        _a.sent();
                        this.logger.debug('Email verification code validated successfully', this.accountVerification.name);
                        return [4 /*yield*/, this.getUserOrThrowException({ email: args.email })];
                    case 2:
                        // Retrieve user by email
                        user = (_a.sent());
                        this.logger.debug("User found for email verification: " + user.id, this.accountVerification.name);
                        // Check if email is already verified
                        if (user.userVerifications.email) {
                            this.logger.warn("Email verification attempted for already verified user: " + user.id, this.accountVerification.name);
                            this.exceptionService.sendNotAcceptableException(response_messages_enum_1.RESPONSE_MESSAGES.EMAIL_ALREADY_VERIFIED);
                        }
                        // Mark email as verified
                        user.userVerifications.email = true;
                        this.logger.log("Email marked as verified for user: " + user.id, this.accountVerification.name);
                        return [3 /*break*/, 7];
                    case 3:
                        if (!args.phoneNumber) return [3 /*break*/, 6];
                        this.logger.log('Starting phone number verification process', this.accountVerification.name);
                        return [4 /*yield*/, this.verifyAccountCode("verify" + args.phoneNumber, args.code)];
                    case 4:
                        _a.sent();
                        this.logger.debug('Phone verification code validated successfully', this.accountVerification.name);
                        return [4 /*yield*/, this.getUserOrThrowException({ phoneNumber: args.phoneNumber })];
                    case 5:
                        // Retrieve user by phone number
                        user = (_a.sent());
                        this.logger.debug("User found for phone verification: " + user.id, this.accountVerification.name);
                        // Check if phone number is already verified
                        if (user.userVerifications.phoneNumber) {
                            this.logger.warn("Phone verification attempted for already verified user: " + user.id, this.accountVerification.name);
                            this.exceptionService.sendNotAcceptableException(response_messages_enum_1.RESPONSE_MESSAGES.USER_PHONE_ALREADY_EXIST);
                        }
                        // Mark phone number as verified
                        user.userVerifications.phoneNumber = true;
                        this.logger.log("Phone number marked as verified for user: " + user.id, this.accountVerification.name);
                        return [3 /*break*/, 7];
                    case 6:
                        this.logger.error('No email or phone number provided for verification', this.accountVerification.name);
                        this.exceptionService.sendBadRequestException(response_messages_enum_1.RESPONSE_MESSAGES.EMAIL_ALREADY_VERIFIED);
                        _a.label = 7;
                    case 7:
                        if (user.status === status_enum_1.UserStatusEnum.BLOCKED)
                            this.exceptionService.sendUnprocessableEntityException(response_messages_enum_1.RESPONSE_MESSAGES.USER_BLOCKED);
                        // Update user status and verification flags in database
                        user.status = status_enum_1.UserStatusEnum.ACTIVE;
                        // Perform database update
                        return [4 /*yield*/, this.userRepo.update({ id: user.id }, {
                                status: user.status,
                                userVerifications: user.userVerifications
                            })];
                    case 8:
                        // Perform database update
                        _a.sent();
                        this.logger.log("User verified successfully: " + user.id, this.accountVerification.name);
                        this.logger.debug("User verification status updated: " + JSON.stringify(user === null || user === void 0 ? void 0 : user.userVerifications), this.accountVerification.name);
                        // Return success response with JWT token
                        this.logger.log('Account verification completed successfully with JWT token', this.accountVerification.name);
                        return [4 /*yield*/, this.generateJwtAndSendResponse(user, true)]; // returning true as it's for verification
                    case 9: return [2 /*return*/, _a.sent()]; // returning true as it's for verification
                    case 10:
                        error_10 = _a.sent();
                        this.sharedService.sendError(error_10, this.accountVerification.name);
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check if user already exists with given email or phone
     * Only verified users should be treated as unique
     * @param email User email
     * @param phoneNumber User phone number
     * @returns User entity if exists with compatible registration type
     */
    UserAccountService.prototype.checkUserExistance = function (email, phoneNumber, username) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var user, error_11;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        this.logger.debug("Checking user existence: " + (email || 'N/A') + ", " + (phoneNumber || 'N/A'));
                        return [4 /*yield*/, this.userRepo.findOne({ where: [{ email: email }, { phoneNumber: phoneNumber }, { username: username }] })];
                    case 1:
                        user = _c.sent();
                        if (user) {
                            // For email/phone uniqueness, only enforce if the user is verified
                            if (user.email === email && ((_a = user.userVerifications) === null || _a === void 0 ? void 0 : _a.email) === true) {
                                this.logger.warn("Verified email already exists: " + email);
                                this.exceptionService.sendConflictException(response_messages_enum_1.RESPONSE_MESSAGES.EMAIL_ALREADY_VERIFIED);
                            }
                            if (user.phoneNumber === phoneNumber && ((_b = user.userVerifications) === null || _b === void 0 ? void 0 : _b.phoneNumber) === true) {
                                this.logger.warn("Verified phone number already exists: " + phoneNumber);
                                this.exceptionService.sendConflictException(response_messages_enum_1.RESPONSE_MESSAGES.USER_PHONE_ALREADY_EXIST);
                            }
                            // Check username uniqueness (always enforced)
                            if (user.username === username) {
                                this.logger.warn("Username already exists: " + username);
                                this.exceptionService.sendConflictException(response_messages_enum_1.RESPONSE_MESSAGES.UsernameAlreadyExist);
                            }
                            // Check if user is blocked - blocked users cannot register again
                            if (user.status === status_enum_1.UserStatusEnum.BLOCKED) {
                                this.logger.warn("Blocked user attempted to register again: " + user.id);
                                this.exceptionService.sendUnprocessableEntityException(response_messages_enum_1.RESPONSE_MESSAGES.USER_BLOCKED);
                            }
                            // If user exists but is not verified, allow reuse (return the user for update)
                            this.logger.log("Found unverified user, allowing reuse: " + user.id);
                        }
                        return [2 /*return*/, user];
                    case 2:
                        error_11 = _c.sent();
                        this.sharedService.sendError(error_11, this.checkUserExistance.name);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieves a user based on the provided criteria.
     * Throws an error if the user does not exist.
     *
     * @param whereClause - Conditions to find the user
     * @returns The found User entity
     * @throws NotFoundException if user is not found
     */
    UserAccountService.prototype.getUserOrThrowException = function (whereClause) {
        return __awaiter(this, void 0, void 0, function () {
            var user, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.userRepo.findOne({ where: whereClause })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            this.exceptionService.sendNotFoundException(response_messages_enum_1.RESPONSE_MESSAGES.USER_NOT_FOUND);
                        }
                        return [2 /*return*/, user];
                    case 2:
                        error_12 = _a.sent();
                        this.sharedService.sendError(error_12, this.getUserOrThrowException.name);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserAccountService.prototype.verifyAccountCode = function (key, verificationCode) {
        return __awaiter(this, void 0, void 0, function () {
            var verificationData, code, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.accountVerificationCache.get(key)];
                    case 1:
                        verificationData = _a.sent();
                        if (!verificationData)
                            this.exceptionService.sendGoneException(response_messages_enum_1.RESPONSE_MESSAGES.CODE_EXPIRED);
                        code = verificationData.code;
                        if (verificationCode !== code)
                            this.exceptionService.sendNotAcceptableException(response_messages_enum_1.RESPONSE_MESSAGES.INVALID_CODE);
                        return [4 /*yield*/, this.accountVerificationCache.del(key)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, code];
                    case 3:
                        error_13 = _a.sent();
                        this.sharedService.sendError(error_13, this.verifyAccountCode.name);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Calculate remaining time for verification code cooldown
     * @param verificationData The verification data containing expiredAt timestamp
     * @returns Remaining time in milliseconds
     */
    UserAccountService.prototype.calculateRemainingTime = function (verificationData) {
        var currentTime = Date.now();
        var remainingTime = verificationData.expiredAt - currentTime;
        this.logger.debug("Verification cooldown check:", {
            currentTime: currentTime,
            expiredAt: verificationData.expiredAt,
            remainingTime: remainingTime
        });
        return Math.max(0, remainingTime); // Return 0 if cooldown has expired
    };
    /**
     * Format remaining time into a user-friendly message
     * @param remainingTimeMs Remaining time in milliseconds
     * @returns Formatted message string
     */
    UserAccountService.prototype.formatRemainingTimeMessage = function (remainingTimeMs) {
        var remainingDate = new Date(remainingTimeMs);
        var minutes = remainingDate.getUTCMinutes();
        var seconds = remainingDate.getUTCSeconds();
        var parts = [];
        if (minutes > 0) {
            parts.push(minutes + " minutes");
        }
        if (seconds > 0) {
            parts.push(seconds + " seconds");
        }
        return "Please wait " + parts.join(' and ') + " to resend again";
    };
    // Update the sendAccountVerificationCode method
    /**
     * Creates verification cache data with generated code and expiration timestamp
     * @returns VerificationCacheData object with code and expiredAt
     */
    UserAccountService.prototype.createVerificationCacheData = function () {
        var code = randomString.generate({ length: 6, charset: 'numeric' });
        return {
            code: '123456',
            // code, // Uncomment this when ready to use dynamic codes
            expiredAt: Date.now() + 300000
        };
    };
    /**
     * Manages verification code generation, storage, and cooldown checking
     * @param key - The cache key (e.g., 'verify{email}', 'resetPassword{phone}')
     * @returns The generated verification code
     * @throws UnprocessableEntityException if cooldown period is still active
     */
    UserAccountService.prototype.verifyAndSetCacheData = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var existingVerification, remainingTime, verificationData, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.accountVerificationCache.get(key)];
                    case 1:
                        existingVerification = _a.sent();
                        if (existingVerification) {
                            remainingTime = this.calculateRemainingTime(existingVerification);
                            if (remainingTime > 0) {
                                this.exceptionService.sendTooManyRequestsException(this.formatRemainingTimeMessage(remainingTime));
                            }
                        }
                        verificationData = this.createVerificationCacheData();
                        // Store in cache with 5 minutes TTL
                        return [4 /*yield*/, this.accountVerificationCache.set(key, verificationData, 300000)]; // 5 * 60 * 1000 = 300000 seconds in MILLISECONDS (1000ms = 1s)
                    case 2:
                        // Store in cache with 5 minutes TTL
                        _a.sent(); // 5 * 60 * 1000 = 300000 seconds in MILLISECONDS (1000ms = 1s)
                        this.logger.debug("Verification code stored in cache with key: " + key);
                        return [2 /*return*/, verificationData.code];
                    case 3:
                        error_14 = _a.sent();
                        this.sharedService.sendError(error_14, this.verifyAndSetCacheData.name);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserAccountService.prototype.sendAccountVerificationCode = function (args, user) {
        return __awaiter(this, void 0, void 0, function () {
            var msg, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        msg = void 0;
                        this.logger.debug("Verification code generated for user : " + args.email);
                        if (!args.email) return [3 /*break*/, 2];
                        if (user.userVerifications.email) {
                            this.logger.warn("User email already verified: " + user.id);
                            this.exceptionService.sendNotAcceptableException(response_messages_enum_1.RESPONSE_MESSAGES.EMAIL_ALREADY_VERIFIED);
                        }
                        // Use consolidated cache management
                        return [4 /*yield*/, this.verifyAndSetCacheData("verify" + args.email)
                            // send an email to user for account verification
                            // TODO: Will send email verification code dynamically after settting up sendgrid templates
                            // const isVerificationSent = await Mailer.sendEmailVerificationCode(args.email, code, 5) // code expiry time is 5 minute
                            // if (!isVerificationSent) {
                            // 	this.exceptionService.sendInternalServerErrorException(RESPONSE_MESSAGES.VerificationCodeFailed)
                            // }
                        ];
                    case 1:
                        // Use consolidated cache management
                        _a.sent();
                        // send an email to user for account verification
                        // TODO: Will send email verification code dynamically after settting up sendgrid templates
                        // const isVerificationSent = await Mailer.sendEmailVerificationCode(args.email, code, 5) // code expiry time is 5 minute
                        // if (!isVerificationSent) {
                        // 	this.exceptionService.sendInternalServerErrorException(RESPONSE_MESSAGES.VerificationCodeFailed)
                        // }
                        msg = response_messages_enum_1.RESPONSE_MESSAGES.EmailVerificationCodeSent;
                        return [3 /*break*/, 4];
                    case 2:
                        // Currently using a default verification code '123456' for all phone numbers.
                        if (user.userVerifications.phoneNumber) {
                            this.logger.warn("User phone number already verified: " + user.id);
                            this.exceptionService.sendNotAcceptableException(response_messages_enum_1.RESPONSE_MESSAGES.UserPhoneNumAlreadyVerified);
                        }
                        // Use consolidated cache management
                        return [4 /*yield*/, this.verifyAndSetCacheData("verify" + args.phoneNumber)];
                    case 3:
                        // Use consolidated cache management
                        _a.sent();
                        msg = response_messages_enum_1.RESPONSE_MESSAGES.PhoneVerificationCodeSent;
                        _a.label = 4;
                    case 4: return [2 /*return*/, msg];
                    case 5:
                        error_15 = _a.sent();
                        this.sharedService.sendError(error_15, this.sendAccountVerificationCode.name);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    UserAccountService.prototype.sendForgotPasswordCode = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var msg, error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        msg = void 0;
                        this.logger.debug("Verification code generated for user : " + args.email);
                        if (!args.email) return [3 /*break*/, 2];
                        // Use consolidated cache management
                        return [4 /*yield*/, this.verifyAndSetCacheData("resetPassword" + args.email)
                            // send an email to user for account verification
                            // TODO: Will send email verification code dynamically after settting up sendgrid templates
                            // const iscodeSent = await Mailer.sendForgotPasswordCode(args.email, code, 5) // code expiry time is 5 minute
                            // if (!iscodeSent) {
                            // 	this.exceptionService.sendInternalServerErrorException(RESPONSE_MESSAGES.EmailResendFailed)
                            // }
                        ];
                    case 1:
                        // Use consolidated cache management
                        _a.sent();
                        // send an email to user for account verification
                        // TODO: Will send email verification code dynamically after settting up sendgrid templates
                        // const iscodeSent = await Mailer.sendForgotPasswordCode(args.email, code, 5) // code expiry time is 5 minute
                        // if (!iscodeSent) {
                        // 	this.exceptionService.sendInternalServerErrorException(RESPONSE_MESSAGES.EmailResendFailed)
                        // }
                        msg = response_messages_enum_1.RESPONSE_MESSAGES.EmailResetCodeSent;
                        return [3 /*break*/, 4];
                    case 2: 
                    // Use consolidated cache management
                    return [4 /*yield*/, this.verifyAndSetCacheData("resetPassword" + args.phoneNumber)];
                    case 3:
                        // Use consolidated cache management
                        _a.sent();
                        msg = response_messages_enum_1.RESPONSE_MESSAGES.PhoneResetCodeSent;
                        _a.label = 4;
                    case 4: return [2 /*return*/, msg];
                    case 5:
                        error_16 = _a.sent();
                        this.sharedService.sendError(error_16, this.sendForgotPasswordCode.name);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Common function to generate JWT token, prepare tasker data, get wishlist and send response
     * @param user - The authenticated user entity
     * @param defaultMessage - Default success message to use
     * @param taskerMessage - Message to use if user is a tasker (optional)
     * @returns Complete login response with JWT token, user/tasker data, and wishlist
     */
    UserAccountService.prototype.generateJwtAndSendResponse = function (user, isForVerification) {
        if (isForVerification === void 0) { isForVerification = false; }
        return __awaiter(this, void 0, void 0, function () {
            var jwt, msg, userWishlist, error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        jwt = this.jwtService.sign(this.getLoginPayload(user));
                        msg = isForVerification ? response_messages_enum_1.RESPONSE_MESSAGES.EMAIL_VERIFIED : response_messages_enum_1.RESPONSE_MESSAGES.LOGGED_IN;
                        return [4 /*yield*/, this.userWishlistService.getUserWishlistByUserId(user.id)
                            // Return complete response
                        ];
                    case 1:
                        userWishlist = _a.sent();
                        // Return complete response
                        return [2 /*return*/, this.sharedService.sendResponse(msg, {
                                jwt: jwt,
                                user: user,
                                userWishlist: userWishlist
                            })];
                    case 2:
                        error_17 = _a.sent();
                        this.sharedService.sendError(error_17, this.generateJwtAndSendResponse.name);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    var UserAccountService_1;
    UserAccountService = UserAccountService_1 = __decorate([
        common_1.Injectable(),
        __param(0, common_1.Inject(cache_manager_1.CACHE_MANAGER)),
        __param(1, typeorm_1.InjectRepository(user_entity_1.User))
    ], UserAccountService);
    return UserAccountService;
}());
exports.UserAccountService = UserAccountService;
