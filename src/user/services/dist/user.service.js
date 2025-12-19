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
exports.UserService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var user_entity_1 = require("../entities/user.entity");
var user_enums_1 = require("../enums/user.enums");
var status_enum_1 = require("../enums/status.enum");
var response_messages_enum_1 = require("src/utils/enums/response-messages.enum");
var UserService = /** @class */ (function () {
    function UserService(userRepo, exceptionService, sharedService, userAccountService, jwtService, userWishlistService) {
        this.userRepo = userRepo;
        this.exceptionService = exceptionService;
        this.sharedService = sharedService;
        this.userAccountService = userAccountService;
        this.jwtService = jwtService;
        this.userWishlistService = userWishlistService;
        this.logger = new common_1.Logger(UserService_1.name);
        this.isCronRunning = false;
    }
    UserService_1 = UserService;
    /**
     * Retrieves a user's profile information
     *
     * @param args - User entity with ID for lookup
     * @returns Promise with the user profile data
     */
    UserService.prototype.getUserProfile = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var profile, responseData, _a, _b, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 4, , 5]);
                        this.logger.log("Fetching profile for user ID: " + user.id);
                        return [4 /*yield*/, this.userRepo.findOne({
                                select: {
                                    id: true,
                                    username: true,
                                    email: true,
                                    firstName: true,
                                    lastName: true,
                                    phoneNumber: true,
                                    gender: true,
                                    registrationType: true,
                                    address: true,
                                    dob: { day: true, month: true, year: true },
                                    profileImage: { url: true },
                                    isNotificationEnabled: true,
                                    userType: true,
                                    userVerifications: true
                                },
                                where: { id: user.id }
                            })];
                    case 1:
                        profile = _c.sent();
                        this.logger.debug("Successfully retrieved profile for user ID: " + user.id);
                        responseData = { profile: profile };
                        if (!![user_enums_1.RegisterationTypeEnum.EMAIL, user_enums_1.RegisterationTypeEnum.PHONE].includes(user.registrationType)) return [3 /*break*/, 3];
                        _a = responseData;
                        _b = 'userWishlist';
                        return [4 /*yield*/, this.userWishlistService.getUserWishlistByUserId(user.id)];
                    case 2:
                        _a[_b] = _c.sent();
                        _c.label = 3;
                    case 3: return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.SUCCESS, responseData)];
                    case 4:
                        error_1 = _c.sent();
                        this.sharedService.sendError(error_1, this.getUserProfile.name);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Updates a user's profile information including optional profile image
     *
     * @param editProfDto - DTO containing profile update data
     * @param file - Optional file upload for profile image
     * @param user - Current user entity
     * @returns Promise with updated user profile data
     */
    UserService.prototype.editProfile = function (args, user, queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            var msg, existingUser, existingUser, username, _a, profile, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 14, , 15]);
                        this.logger.log("Updating profile for user ID: " + user.id);
                        msg = '';
                        if (!(args.email && args.email !== user.email)) return [3 /*break*/, 3];
                        this.logger.debug("Validating email uniqueness: " + args.email);
                        return [4 /*yield*/, this.userRepo.findOne({ where: { email: args.email } })];
                    case 1:
                        existingUser = _b.sent();
                        if (existingUser) {
                            // Always enforce uniqueness - email must be unique regardless of verification status
                            this.logger.warn("Email already exists: " + args.email + " for user: " + existingUser.id);
                            this.exceptionService.sendConflictException(response_messages_enum_1.RESPONSE_MESSAGES.USER_EMAIL_ALREADY_EXIST);
                        }
                        // Only update email and send verification if it's actually changing
                        user.userVerifications.email = false;
                        return [4 /*yield*/, this.userAccountService.sendAccountVerificationCode({ email: args.email }, user)];
                    case 2:
                        msg = (_b.sent());
                        _b.label = 3;
                    case 3:
                        if (!(args.phoneNumber && args.phoneNumber !== user.phoneNumber)) return [3 /*break*/, 6];
                        this.logger.debug("Validating phone number uniqueness: " + args.phoneNumber);
                        return [4 /*yield*/, this.userRepo.findOne({ where: { phoneNumber: args.phoneNumber } })];
                    case 4:
                        existingUser = _b.sent();
                        if (existingUser) {
                            // Always enforce uniqueness - phone must be unique regardless of verification status
                            this.logger.warn("Phone number already exists: " + args.phoneNumber + " for user: " + existingUser.id);
                            this.exceptionService.sendConflictException(response_messages_enum_1.RESPONSE_MESSAGES.USER_PHONE_ALREADY_EXIST);
                        }
                        // Only update phone and send verification if it's actually changing
                        user.userVerifications.phoneNumber = false;
                        return [4 /*yield*/, this.userAccountService.sendAccountVerificationCode({ phoneNumber: args.phoneNumber }, user)];
                    case 5:
                        msg = (_b.sent());
                        _b.label = 6;
                    case 6:
                        if (!(args.username && args.username !== user.username)) return [3 /*break*/, 8];
                        this.logger.debug("Validating username uniqueness: " + args.phoneNumber);
                        return [4 /*yield*/, this.userRepo.findOne({ where: { username: args.username } })];
                    case 7:
                        username = _b.sent();
                        if (username) {
                            this.exceptionService.sendConflictException(response_messages_enum_1.RESPONSE_MESSAGES.UsernameAlreadyExist);
                        }
                        _b.label = 8;
                    case 8:
                        // Process location information (city and town)
                        // if (args.townId) {
                        // 	this.logger.debug(`Processing town ID: ${args.townId}`)
                        // 	const town = await this.locService.fetchTownWithCityInfo(args.townId)
                        // 	if (town) {
                        // 		args.cityId = town?.cityId.id
                        // 	}
                        // } else if (args.cityId) {
                        // 	this.logger.debug(`Processing City ID: ${args.cityId}`)
                        // 	const city = await this.locService.getCityById(args.cityId)
                        // 	args.townId = null as any
                        // 	if (!city) {
                        // 		this.exceptionService.sendBadRequestException(RESPONSE_MESSAGES.InvalidCitySlug)
                        // 	}
                        // }
                        // Process profile image if provided
                        // if (file) {
                        // 	if (file.userProfileImage) {
                        // 		this.logger.debug('Processing profile image upload')
                        // 		user.profileImage.key = await this.sharedService.uploadFileToS3Bucket(file.userProfileImage[0])
                        // 		user.profileImage.url = await this.sharedService.getFileFromS3Bucket(user.profileImage.key, true)
                        // 		user.profileImage.expiredAt = new Date().setDate(new Date().getDate() + PROFILE_IMAGE_EXPIRY_DAYS)
                        // 		this.logger.debug(`Profile image uploaded with key: ${user.profileImage.key}`)
                        // 	}
                        // }
                        // use base64 for cropped image
                        // if (args.profileImage) {
                        // 	const bufferConversion = Buffer.from(args.profileImage.fileBase64, 'base64') // Convert base64 to binary
                        // 	const profileImage = {
                        // 		originalname: args.profileImage.fileName,
                        // 		buffer: bufferConversion,
                        // 	}
                        // 	if (user.profileImage?.key) {
                        // 		await this.sharedService.deleteFileFromS3Bucket(user.profileImage.key)
                        // 	}
                        // 	user.profileImage = user.profileImage ? user.profileImage : ({} as ProfileImageType)
                        // 	user.profileImage.key = await this.sharedService.uploadFileToS3Bucket(profileImage as Express.Multer.File) as string
                        // 	user.profileImage.url = await this.sharedService.getFileFromS3Bucket(user.profileImage.key)
                        // 	user.imageExpiredAt = new Date().setDate(new Date().getDate() + 6)
                        // }
                        delete args.profileImage;
                        this.logger.debug("Applying profile updates for user ID: " + user.id);
                        Object.assign(user, args);
                        if (!queryRunner) return [3 /*break*/, 10];
                        return [4 /*yield*/, queryRunner.manager.update(user_entity_1.User, { id: user.id }, user)];
                    case 9:
                        _a = _b.sent();
                        return [3 /*break*/, 12];
                    case 10: return [4 /*yield*/, this.userRepo.update({ id: user.id }, user)];
                    case 11:
                        _a = _b.sent();
                        _b.label = 12;
                    case 12:
                        _a;
                        this.logger.log("Profile successfully updated for user ID: " + user.id);
                        return [4 /*yield*/, this.getUserProfile(user)];
                    case 13:
                        profile = _b.sent();
                        if (args.username && profile)
                            profile.data['jwt'] = this.jwtService.sign(this.userAccountService.getLoginPayload(user));
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.PROFILE_UPDATED + ((msg === null || msg === void 0 ? void 0 : msg.length) ? " and " + msg : ''), profile === null || profile === void 0 ? void 0 : profile.data)];
                    case 14:
                        error_2 = _b.sent();
                        this.sharedService.sendError(error_2, this.editProfile.name);
                        return [3 /*break*/, 15];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Cron job that runs every day at midnight to refresh expired profile image URLs.
     * It checks for users whose `imageExpiredAt` is within the next 6 hours and
     * updates their `profileImage.url` by fetching a fresh signed URL from S3.
     * The `imageExpiredAt` is also extended by 6 days.
     */
    // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    // async refreshProfileImagesUrls() {
    // 	try {
    // 		if (!this.isCronRunning) {
    // 			this.isCronRunning = true
    // 			this.logger.log(`Cron job starting to refresh profile image URL at ${new Date().toISOString()}`, this.refreshProfileImagesUrls.name)
    // 			let users: User[]
    // 			const fetchingLimit = 50
    // 			let counter = 0
    // 			do {
    // 				const expiredUserProfile: User[] = []
    // 				const timeAfterSixHours = Date.now() + 6 * 60 * 60 * 1000 // 6 hours from now
    // 				// Fetch a batch of users with expiring profile image URLs
    // 				users = await this.userRepo.find({
    // 					where: {
    // 						imageExpiredAt: LessThan(timeAfterSixHours),
    // 						profileImage: Not(IsNull()),
    // 					},
    // 					select: {id: true, imageExpiredAt: true, profileImage: true as {}},
    // 					take: fetchingLimit,
    // 					order: {id: 'ASC'},
    // 				})
    // 				for (const user of users) {
    // 					try {
    // 						// Fetch updated signed URL for user's profile image from S3
    // 						user.profileImage.url = await this.sharedService.getFileFromS3Bucket(user.profileImage.key)
    // 						// Extend expiration date by 6 days
    // 						user.imageExpiredAt = new Date().setDate(new Date().getDate() + 6)
    // 						expiredUserProfile.push(user)
    // 					} catch (error) {
    // 						this.logger.error(`Failed to update user profile image for user ${user.id}: ${error?.['message']}`, this.refreshProfileImagesUrls.name)
    // 					}
    // 				}
    // 				counter++
    // 				if (expiredUserProfile.length) {
    // 					await this.userRepo.save(expiredUserProfile)
    // 					this.logger.log(`Successfully updated ${expiredUserProfile.length} user profile images in batch ${counter}`, this.refreshProfileImagesUrls.name)
    // 				}
    // 			} while (users.length === fetchingLimit)
    // 			this.isCronRunning = false
    // 			this.logger.log(`Cron Finished refreshing profile image URLs after ${counter} batches.`)
    // 		}
    // 	} catch (error) {
    // 		this.isCronRunning = false
    // 		this.sharedService.sendError(error, this.refreshProfileImagesUrls.name)
    // 	}
    // }
    /**
     * Promotes a user to the "Tasker" role by updating their userType.
     *
     * @param user - The user entity to be promoted.
     * @returns A promise that resolves when the operation is complete.
     */
    UserService.prototype.promoteUserToTasker = function (user, queryRunner) {
        return __awaiter(this, void 0, Promise, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.logger.log("Attempting to promote user to tasker: " + user.id, this.promoteUserToTasker.name);
                        return [4 /*yield*/, queryRunner.manager.update(user_entity_1.User, { id: user.id }, { userType: user_enums_1.UserTypeEnum.TASKER })];
                    case 1:
                        _a.sent();
                        this.logger.log("User promoted to tasker successfully: " + user.id, this.promoteUserToTasker.name);
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        this.sharedService.sendError(error_3, this.promoteUserToTasker.name);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Fetches a user from the database by their username.
     *
     * @param username - The username of the user to find.
     * @returns A User entity if found, or null if not found or an error occurs.
     */
    UserService.prototype.getUserByUsername = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.userRepo.findOneBy({ username: username })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_4 = _a.sent();
                        this.sharedService.sendError(error_4, this.getUserByUsername.name);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.getUserByUsernameWithLocation = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.userRepo.findOne({
                                select: {
                                    id: true,
                                    username: true,
                                    email: true,
                                    firstName: true,
                                    lastName: true,
                                    phoneNumber: true,
                                    gender: true,
                                    registrationType: true,
                                    address: true,
                                    dob: { day: true, month: true, year: true },
                                    profileImage: { url: true },
                                    isNotificationEnabled: true,
                                    userType: true,
                                    userVerifications: true
                                },
                                where: { username: username }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_5 = _a.sent();
                        this.sharedService.sendError(error_5, this.getUserByUsername.name);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.checkUserAvailability = function (args) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var user, isEmailVerified, isPhoneVerified, field, error_6;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 5, , 6]);
                        user = null;
                        if (!args.email) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.userRepo.findOneBy({ email: args.email })];
                    case 1:
                        user = _c.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.userRepo.findOneBy({ phoneNumber: args.phoneNumber })];
                    case 3:
                        user = _c.sent();
                        _c.label = 4;
                    case 4:
                        if (user) {
                            isEmailVerified = args.email && ((_a = user.userVerifications) === null || _a === void 0 ? void 0 : _a.email) === true;
                            isPhoneVerified = args.phoneNumber && ((_b = user.userVerifications) === null || _b === void 0 ? void 0 : _b.phoneNumber) === true;
                            if (isEmailVerified || isPhoneVerified) {
                                field = args.email ? "email: " + args.email : "phoneNumber: " + args.phoneNumber;
                                this.exceptionService.sendConflictException(response_messages_enum_1.RESPONSE_MESSAGES.UserAlreadyExist + " with this verified " + field);
                            }
                            // Check if user is blocked - blocked users cannot register again
                            if (user.status === status_enum_1.UserStatusEnum.BLOCKED) {
                                this.logger.warn("Blocked user attempted to check availability: " + user.id);
                                this.exceptionService.sendUnprocessableEntityException(response_messages_enum_1.RESPONSE_MESSAGES.USER_BLOCKED);
                            }
                            // If user exists but is not verified, allow reuse
                            this.logger.log("Found unverified user, allowing reuse: " + user.id);
                        }
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.SUCCESS, true)];
                    case 5:
                        error_6 = _c.sent();
                        this.sharedService.sendError(error_6, this.checkUserAvailability.name);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    var UserService_1;
    UserService = UserService_1 = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(user_entity_1.User))
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
