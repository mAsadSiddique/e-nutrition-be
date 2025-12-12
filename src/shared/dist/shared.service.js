"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.SharedService = void 0;
var common_1 = require("@nestjs/common");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var utils_1 = require("../utils/utils");
var crypto = require("crypto");
var sharp_1 = require("sharp");
var constant_1 = require("src/config/constant");
var response_messages_enum_1 = require("src/utils/enums/response-messages.enum");
/**
 * JWT error message mapping
 */
var JWT_ERRORS = {
    'invalid token': response_messages_enum_1.RESPONSE_MESSAGES.JWT_INVALID,
    'jwt malformed': response_messages_enum_1.RESPONSE_MESSAGES.JWT_INVALID,
    'jwt expired': response_messages_enum_1.RESPONSE_MESSAGES.JWT_EXPIRED,
    'invalid signature': response_messages_enum_1.RESPONSE_MESSAGES.INVALID_SIGNATURE
};
/**
 * Image compression constants
 */
var IMAGE_CONSTANTS = {
    COMPRESSION_THRESHOLD: 25600,
    MAX_HEIGHT: 1200,
    MAX_WIDTH: 900,
    JPEG_QUALITY: 60
};
var SharedService = /** @class */ (function () {
    function SharedService(exceptionService) {
        this.exceptionService = exceptionService;
        this.logger = new common_1.Logger(SharedService_1.name);
        this.s3 = utils_1.getWasabiS3Object();
    }
    SharedService_1 = SharedService;
    /**
     * @description send response to client
     * @param message
     * @param data
     * @author Waqar Hussain
     */
    SharedService.prototype.sendResponse = function (message, data) {
        if (data === void 0) { data = {}; }
        return { message: message, data: data, status: 200 };
    };
    /**
     * @description send error to client
     * @param error
     * @param funName
     * @author Waqar Hussain
     */
    SharedService.prototype.sendError = function (error, funName) {
        this.logger.error(error.message, error, funName);
        if (!error.response) {
            this.exceptionService.sendInternalServerErrorException(response_messages_enum_1.RESPONSE_MESSAGES.SERVER_TEMPORY_DOWN);
        }
        throw error;
    };
    /**
     * @description print error in logs
     * @param error
     * @param funName
     * @author Waqar Hussain
     */
    SharedService.prototype.printError = function (error, funName) {
        this.logger.error(error.message, error, funName);
    };
    /**
     * @description find difference between two date in days
     * if difference is less than 1 day it will be zero
     * @param date1
     * @param date2
     * @author Waqar Hussain
     */
    SharedService.prototype.dateDiffInDays = function (date1, date2) {
        return __awaiter(this, void 0, Promise, function () {
            var MS_PER_DAY, utc1, utc2;
            return __generator(this, function (_a) {
                try {
                    MS_PER_DAY = 1000 * 60 * 60 * 24;
                    utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate(), date1.getHours(), date1.getMinutes(), date1.getSeconds());
                    utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate(), date2.getHours(), date2.getMinutes(), date2.getSeconds());
                    return [2 /*return*/, Math.floor((utc2 - utc1) / MS_PER_DAY)];
                }
                catch (error) {
                    this.sendError(error, this.dateDiffInDays.name);
                    return [2 /*return*/, 0];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * @description find difference between two date in minutes
     * @param date1
     * @param date2
     * @author Waqar Hussain
     */
    SharedService.prototype.dateDiffInMins = function (date1, date2) {
        try {
            var diff = (date1.getTime() - date2.getTime()) / 1000;
            diff /= 60;
            return Math.abs(Math.round(diff));
        }
        catch (error) {
            this.sendError(error, this.dateDiffInMins.name);
        }
    };
    /**
     * @description verify password and confirm password are same
     * @param password
     * @param confirmPassword
     * @author Waqar Hussain
     */
    SharedService.prototype.passwordsVerificatoin = function (password, confirmPassword) {
        try {
            if (password !== confirmPassword) {
                this.exceptionService.sendNotAcceptableException(response_messages_enum_1.RESPONSE_MESSAGES.PASSWORD_NOT_MATCHED);
            }
            return true;
        }
        catch (error) {
            this.sendError(error, this.passwordsVerificatoin.name);
        }
    };
    /**
     * @description return hashed password
     * @param password
     * @author Waqar Hussain
     */
    SharedService.prototype.hashedPassword = function (password) {
        try {
            return bcrypt.hashSync(password, constant_1.ENV.JWT.SALT_ROUNDS);
        }
        catch (error) {
            this.sendError(error, this.hashedPassword.name);
        }
    };
    /**
     * @description verify password are same or not
     * @param password
     * @param secondPassword
     * @author Waqar Hussain
     */
    SharedService.prototype.passwordVerification = function (password, secondPassword) {
        try {
            var isPasswordMatched = bcrypt.compareSync(password, secondPassword);
            if (!isPasswordMatched) {
                this.exceptionService.sendForbiddenException(response_messages_enum_1.RESPONSE_MESSAGES.INVALID_CREDENTIALS);
            }
            return true;
        }
        catch (error) {
            this.sendError(error, this.passwordVerification.name);
        }
    };
    /**
     * @description verify password are same or not
     * @param password
     * @param secondPassword
     * @author Waqar Hussain
     */
    SharedService.prototype.isValidPassword = function (defaultPassword, hashedPassword) {
        try {
            return bcrypt.compareSync(defaultPassword, hashedPassword);
        }
        catch (error) {
            this.sendError(error, this.isValidPassword.name);
        }
    };
    /**
     * @description returns jwt
     * @param payload
     * @author Waqar Hussain
     */
    SharedService.prototype.generateJwt = function (payload) {
        try {
            return jwt.sign(payload, constant_1.ENV.JWT.SECRET, { expiresIn: constant_1.ENV.JWT.EXPIRES_IN });
        }
        catch (error) {
            this.sendError(error, this.generateJwt.name);
        }
    };
    /**
     * @description returns unique id of 16 digit
     * @author Waqar Hussain
     */
    SharedService.prototype.getUniqueId = function () {
        try {
            return crypto.randomBytes(4 * 2).toString('hex');
        }
        catch (error) {
            this.sendError(error, this.getUniqueId.name);
        }
    };
    /**
     * @description verify time delay between to two dates in minutes
     * and validate it to be more than 5
     * @param oldDate
     * @param currentDate
     * @author Waqar Hussain
     */
    SharedService.prototype.timeDelayVerification = function (oldDate, currentDate) {
        try {
            var timeDiff = this.dateDiffInMins(oldDate, currentDate);
            if (timeDiff && timeDiff < 5) {
                this.exceptionService.sendNotAcceptableException(response_messages_enum_1.RESPONSE_MESSAGES.WAIT_TO_RESEND_AGAIN);
            }
            return true;
        }
        catch (error) {
            this.sendError(error, this.timeDelayVerification.name);
        }
    };
    /**
     * @description upload single file to bucket and returns key
     * @param file
     * @author Waqar Hussain
     */
    SharedService.prototype.uploadFileToS3Bucket = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var key, bucketName, params, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        key = Date.now() + file.originalname;
                        bucketName = constant_1.ENV.S3_BUCKET.NAME;
                        params = {
                            Body: file.buffer,
                            Bucket: bucketName,
                            Key: key
                        };
                        return [4 /*yield*/, this.s3.putObject(params).promise()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, key];
                    case 2:
                        error_1 = _a.sent();
                        this.sendError(error_1, this.uploadFileToS3Bucket.name);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SharedService.prototype.getFileFromS3Bucket = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var params, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        params = {
                            Bucket: constant_1.ENV.S3_BUCKET.NAME,
                            Key: key,
                            Expires: 604800
                        };
                        return [4 /*yield*/, Promise.resolve(this.s3.getSignedUrl('getObject', params))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_2 = _a.sent();
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @description upload multiple file to bucket and returns array of keys
     * @param files
     * @author Waqar Hussain
     */
    SharedService.prototype.uploadFilesToS3Bucket = function (files) {
        return __awaiter(this, void 0, void 0, function () {
            var requests, keys, bucketName, _i, _a, _b, objKey, file, key, param, error_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        requests = [];
                        keys = {};
                        bucketName = constant_1.ENV.S3_BUCKET.NAME;
                        for (_i = 0, _a = Object.entries(files); _i < _a.length; _i++) {
                            _b = _a[_i], objKey = _b[0], file = _b[1];
                            key = Date.now() + file[0].originalname;
                            keys[objKey] = key;
                            param = {
                                Body: file[0].buffer,
                                Bucket: bucketName,
                                Key: key
                            };
                            requests.push(this.s3.putObject(param).promise());
                        }
                        return [4 /*yield*/, Promise.all(requests)];
                    case 1:
                        _c.sent();
                        return [2 /*return*/, keys];
                    case 2:
                        error_3 = _c.sent();
                        this.sendError(error_3, this.uploadFilesToS3Bucket.name);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SharedService.prototype.findAndRemoveImage = function (images, imageUrls, imagesToBeRemoved) {
        return __awaiter(this, void 0, void 0, function () {
            var params, bucketName, _loop_1, _i, _a, _b, keyInDb, value;
            return __generator(this, function (_c) {
                try {
                    params = [];
                    bucketName = constant_1.ENV.S3_BUCKET.NAME;
                    if (images) {
                        _loop_1 = function (keyInDb, value) {
                            var isKeyFound = imagesToBeRemoved.findIndex(function (key) { return key === keyInDb; });
                            if (isKeyFound !== -1) {
                                var param = {
                                    Bucket: bucketName,
                                    Key: value
                                };
                                params.push(param);
                                delete images[keyInDb];
                                delete imageUrls[keyInDb];
                            }
                        };
                        for (_i = 0, _a = Object.entries(images); _i < _a.length; _i++) {
                            _b = _a[_i], keyInDb = _b[0], value = _b[1];
                            _loop_1(keyInDb, value);
                        }
                    }
                    return [2 /*return*/, { images: images, imageUrls: imageUrls, params: params }];
                }
                catch (error) {
                    throw error;
                }
                return [2 /*return*/];
            });
        });
    };
    SharedService.prototype.deleteFilesFromS3Bucket = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var request, _i, params_1, param, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        request = [];
                        for (_i = 0, params_1 = params; _i < params_1.length; _i++) {
                            param = params_1[_i];
                            request.push(this.s3.deleteObject(param).promise());
                        }
                        return [4 /*yield*/, Promise.all(request)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        error_4 = _a.sent();
                        this.exceptionService.sendNotFoundException(response_messages_enum_1.RESPONSE_MESSAGES.IMAGE_NOT_FOUND);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @description upload multiple previewable file to bucket with file type and returns array of objects
     * @param files
     * @author Waqar Hussain
     */
    SharedService.prototype.uploadFilesWithMimeTypeToBucket = function (files) {
        return __awaiter(this, void 0, void 0, function () {
            var requests, keys, keysWithMimeTypes, bucketName, _i, files_1, file, keyHolder, key, param, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        requests = [];
                        keys = [];
                        keysWithMimeTypes = [];
                        bucketName = constant_1.ENV.S3_BUCKET.NAME;
                        for (_i = 0, files_1 = files; _i < files_1.length; _i++) {
                            file = files_1[_i];
                            keyHolder = {
                                name: file.originalname
                            };
                            key = Date.now() + file.originalname;
                            param = {
                                Body: file.buffer,
                                Bucket: bucketName,
                                Key: key
                            };
                            requests.push(this.s3.putObject(param).promise());
                            keys.push(key);
                            keyHolder[file.mimetype] = key;
                            keysWithMimeTypes.push(keyHolder);
                        }
                        return [4 /*yield*/, Promise.all(requests)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, keysWithMimeTypes];
                    case 2:
                        error_5 = _a.sent();
                        this.sendError(error_5, this.uploadFilesWithMimeTypeToBucket.name);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @description fetch file from bucket
     * @param key
     * @author Waqar Hussain
     */
    SharedService.prototype.getFileFromBucket = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var bucketName, params, error_6, signedUrl, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        bucketName = constant_1.ENV.S3_BUCKET.NAME;
                        params = {
                            Bucket: bucketName,
                            Key: key
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.s3.headObject(params).promise()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_6 = _a.sent();
                        console.log(error_6);
                        this.exceptionService.sendNotFoundException(response_messages_enum_1.RESPONSE_MESSAGES.IMAGE_NOT_FOUND);
                        return [3 /*break*/, 4];
                    case 4:
                        signedUrl = this.s3.getSignedUrl('getObject', params);
                        return [2 /*return*/, signedUrl];
                    case 5:
                        error_7 = _a.sent();
                        this.sendError(error_7, this.getFileFromBucket.name);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @description fetch multiple files from bucket
     * @param keys
     * @author Waqar Hussain
     */
    SharedService.prototype.getFilesFromS3Bucket = function (keysWithValue) {
        return __awaiter(this, void 0, void 0, function () {
            var requests, urlsToBeReturn, bucketName, counter, _i, _a, _b, key, value, param, urls, _c, _d, _e, key, value, error_8;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 2, , 3]);
                        requests = [];
                        urlsToBeReturn = {};
                        bucketName = constant_1.ENV.S3_BUCKET.NAME;
                        counter = 0;
                        for (_i = 0, _a = Object.entries(keysWithValue); _i < _a.length; _i++) {
                            _b = _a[_i], key = _b[0], value = _b[1];
                            param = {
                                Bucket: bucketName,
                                Key: value,
                                Expires: 604800
                            };
                            requests.push(this.s3.getSignedUrl('getObject', param));
                        }
                        return [4 /*yield*/, Promise.all(requests)];
                    case 1:
                        urls = _f.sent();
                        for (_c = 0, _d = Object.entries(keysWithValue); _c < _d.length; _c++) {
                            _e = _d[_c], key = _e[0], value = _e[1];
                            urlsToBeReturn[key] = urls[counter];
                            counter++;
                        }
                        return [2 /*return*/, urlsToBeReturn];
                    case 2:
                        error_8 = _f.sent();
                        this.exceptionService.sendNotFoundException(response_messages_enum_1.RESPONSE_MESSAGES.IMAGE_NOT_FOUND);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @description fetch multiple previewable files from bucket returns original name and url
     * @param keys
     * @author Waqar Hussain
     */
    SharedService.prototype.getMultipleFileWithMimeTypeByKeys = function (keys) {
        return __awaiter(this, void 0, void 0, function () {
            var requests, docNames, bucketName, _i, keys_1, keyObj, _a, _b, name, _c, key, value, param, _d, error_9;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        requests = [];
                        docNames = [];
                        bucketName = constant_1.ENV.S3_BUCKET.NAME;
                        for (_i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                            keyObj = keys_1[_i];
                            _a = Object.entries(keyObj), _b = _a[0], name = _b[1], _c = _a[1], key = _c[0], value = _c[1];
                            param = {
                                Bucket: bucketName,
                                Key: value,
                                ResponseContentType: key,
                                ResponseContentDisposition: 'inline'
                            };
                            requests.push(this.s3.getSignedUrl('getObject', param));
                            docNames.push(name);
                        }
                        _d = {};
                        return [4 /*yield*/, Promise.all(requests)];
                    case 1: return [2 /*return*/, (_d.urls = _e.sent(), _d.docNames = docNames, _d)];
                    case 2:
                        error_9 = _e.sent();
                        console.log(error_9);
                        this.exceptionService.sendNotFoundException(response_messages_enum_1.RESPONSE_MESSAGES.IMAGE_NOT_FOUND);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @description delete file from bucket
     * @param key
     * @author Waqar Hussain
     */
    SharedService.prototype.deleteFileFromS3Bucket = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var bucketName, params, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        bucketName = constant_1.ENV.S3_BUCKET.NAME;
                        params = {
                            Bucket: bucketName,
                            Key: key
                        };
                        return [4 /*yield*/, this.s3.deleteObject(params).promise()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_10 = _a.sent();
                        this.exceptionService.sendNotFoundException(response_messages_enum_1.RESPONSE_MESSAGES.IMAGE_NOT_FOUND);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SharedService.prototype.bcryptCompareVerificatoin = function (password, userInput) {
        try {
            var isPasswordMatched = bcrypt.compareSync(password, userInput);
            if (!isPasswordMatched) {
                this.exceptionService.sendNotAcceptableException(response_messages_enum_1.RESPONSE_MESSAGES.INVALID_CREDENTIALS);
            }
            return true;
        }
        catch (error) {
            throw error;
        }
    };
    SharedService.prototype.getJwt = function (payload) {
        try {
            return jwt.sign(payload, constant_1.ENV.JWT.SECRET, { expiresIn: constant_1.ENV.JWT.EXPIRES_IN });
        }
        catch (error) {
            throw error;
        }
    };
    SharedService.prototype.getDecodedToken = function (token, requestedRoute) {
        try {
            return jwt.verify(token, constant_1.ENV.JWT.SECRET);
        }
        catch (error) {
            if (error.message === 'jwt expired' &&
                (requestedRoute === process.env.ADMIN_LOGOUT_ROUTE || requestedRoute === process.env.USER_LOGOUT_ROUTE)) {
                return jwt.decode(token);
            }
            else {
                this.exceptionDetector(error);
                this.sendError(error, this.getDecodedToken.name);
            }
        }
    };
    SharedService.prototype.exceptionDetector = function (error) {
        console.error(error);
        if (error.message === 'invalid token' || error.message === 'jwt malformed')
            this.exceptionService.sendUnauthorizedException(response_messages_enum_1.RESPONSE_MESSAGES.JWT_INVALID);
        if (error.message === 'jwt expired')
            this.exceptionService.sendUnauthorizedException(response_messages_enum_1.RESPONSE_MESSAGES.JWT_EXPIRED);
        if (error.message === 'invalid signature')
            this.exceptionService.sendUnauthorizedException(response_messages_enum_1.RESPONSE_MESSAGES.INVALID_SIGNATURE);
        if (error.response) {
            this.exceptionService.sendUnauthorizedException(error.message);
        }
    };
    // appendDateFilterQuery(args: any, query: any) {
    // 	try {
    // 		if (args.fromDate && args.toDate) {
    // 			if (args.fromDate > args.toDate) {
    // 				this.exceptionService.sendUnprocessableEntityException(RESPONSE_MESSAGES.FROM_DATE_MUST_BE_GREATER_THAN_TO_DATE)
    // 			}
    // 			query['createdAt'] = {
    // 				$gte: new Date(args.fromDate),
    // 				$lte: new Date(new Date(args.toDate).setDate(new Date(args.toDate).getDate() + 1))
    // 			}
    // 		} else if (args.fromDate) {
    // 			query['createdAt'] = { $gte: new Date(args.fromDate) }
    // 		} else if (args.toDate) {
    // 			query['createdAt'] = { $lte: new Date(new Date(args.toDate).setDate(new Date(args.toDate).getDate() + 1)) }
    // 		}
    // 	} catch (error) {
    // 		this.sendError(error, this.appendDateFilterQuery.name)
    // 	}
    // }
    // appendDateFilterCondition(args, whereClause: ObjectType) {
    // 	try {
    // 		if (args.fromDate && args.toDate) {
    // 			if (args.fromDate > args.toDate) {
    // 				this.exceptionService.sendUnprocessableEntityException(RESPONSE_MESSAGES.FROM_DATE_MUST_BE_GREATER_THAN_TO_DATE)
    // 			}
    // 			whereClause['createdAt'] = {
    // 				$gte: new Date(args.fromDate),
    // 				$lte: new Date(new Date(args.toDate).setDate(new Date(args.toDate).getDate() + 1))
    // 			}
    // 		} else if (args.fromDate) {
    // 			whereClause['createdAt'] = { $gte: new Date(args.fromDate) }
    // 		} else if (args.toDate) {
    // 			whereClause['createdAt'] = { $lte: new Date(new Date(args.toDate).setDate(new Date(args.toDate).getDate() + 1)) }
    // 		}
    // 	} catch (error) {
    // 		this.sendError(error, this.appendDateFilterCondition.name)
    // 	}
    // }
    /**
     * Detects and handles JWT-related exceptions
     *
     * Maps common JWT error messages to appropriate exception responses
     *
     * @param error - The error object from JWT operations
     */
    SharedService.prototype.jwtExceptionDetector = function (error) {
        this.logger.debug("JWT error detected: " + error.message);
        // Handle known JWT errors
        var errorMessage = error.message;
        if (JWT_ERRORS[errorMessage]) {
            this.logger.warn("Handling known JWT error: " + errorMessage);
            this.exceptionService.sendUnauthorizedException(JWT_ERRORS[errorMessage]);
        }
        // Handle response errors
        if (error.response && !(error === null || error === void 0 ? void 0 : error.status)) {
            this.logger.warn("JWT response error: " + errorMessage);
            this.exceptionService.sendUnauthorizedException(errorMessage);
        }
    };
    /**
 * Generates a random alphanumeric string of the given length using
 * cryptographically secure random bytes.
 *
 * Note: Uniqueness is not guaranteed. For unique values, add a check (e.g., DB or memory).
 *
 * @param length - Length of the string to generate.
 * @returns A random alphanumeric string.
 */
    SharedService.prototype.generateRandomString = function (length) {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var result = '';
        // Generate random bytes and map them to the chars array
        var bytes = crypto.randomBytes(length);
        for (var i = 0; i < length; i++) {
            var index = bytes[i] % chars.length;
            result += chars[index];
        }
        return result;
    };
    SharedService.prototype.uploadMultipleFileToS3Bucket = function (mediaFiles, dims, isCompressable) {
        if (isCompressable === void 0) { isCompressable = true; }
        return __awaiter(this, void 0, void 0, function () {
            var requests, keys, _i, _a, _b, objKey, files, _c, files_2, file, mimetype, key, compressedData, _d, param, error_11;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 12, , 13]);
                        requests = [];
                        keys = {};
                        _i = 0, _a = Object.entries(mediaFiles);
                        _e.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 10];
                        _b = _a[_i], objKey = _b[0], files = _b[1];
                        _c = 0, files_2 = files;
                        _e.label = 2;
                    case 2:
                        if (!(_c < files_2.length)) return [3 /*break*/, 9];
                        file = files_2[_c];
                        mimetype = file.mimetype.split('/')[0];
                        key = objKey + "__" + (Date.now() + file.originalname).replace(/\s+/g, '');
                        keys[key] = objKey;
                        compressedData = void 0;
                        if (!['video', 'videos', 'audio'].includes(mimetype)) return [3 /*break*/, 3];
                        // TODO: will implement video compression logic
                        compressedData = file.buffer;
                        return [3 /*break*/, 7];
                    case 3:
                        if (!isCompressable) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.compressImageData(file.buffer, dims && dims[objKey])];
                    case 4:
                        _d = _e.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        _d = file.buffer;
                        _e.label = 6;
                    case 6:
                        compressedData = _d;
                        _e.label = 7;
                    case 7:
                        if (!compressedData)
                            return [3 /*break*/, 8];
                        param = {
                            Body: compressedData,
                            Bucket: constant_1.ENV.S3_BUCKET.NAME,
                            Key: key
                        };
                        requests.push(this.s3.putObject(param).promise());
                        _e.label = 8;
                    case 8:
                        _c++;
                        return [3 /*break*/, 2];
                    case 9:
                        _i++;
                        return [3 /*break*/, 1];
                    case 10: return [4 /*yield*/, Promise.all(requests)];
                    case 11:
                        _e.sent();
                        return [2 /*return*/, keys];
                    case 12:
                        error_11 = _e.sent();
                        throw error_11;
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    SharedService.prototype.getMultipleFilesFromS3Bucket = function (keysWithValue) {
        return __awaiter(this, void 0, Promise, function () {
            var requests, urlsToBeReturn, _i, _a, _b, key, value, param, urls, counter, _c, _d, key, error_12;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        requests = [];
                        urlsToBeReturn = {};
                        // Create signed URL requests for each file key
                        for (_i = 0, _a = Object.entries(keysWithValue); _i < _a.length; _i++) {
                            _b = _a[_i], key = _b[0], value = _b[1];
                            param = {
                                Bucket: constant_1.ENV.S3_BUCKET.NAME,
                                Key: key,
                                Expires: 604800
                            };
                            requests.push(Promise.resolve(this.s3.getSignedUrl('getObject', param))); // Wrap in Promise for consistency
                        }
                        return [4 /*yield*/, Promise.all(requests)
                            // Map signed URLs back to their original keys
                        ];
                    case 1:
                        urls = _e.sent();
                        counter = 0;
                        for (_c = 0, _d = Object.keys(keysWithValue); _c < _d.length; _c++) {
                            key = _d[_c];
                            urlsToBeReturn[key] = urls[counter];
                            counter++;
                        }
                        return [2 /*return*/, urlsToBeReturn];
                    case 2:
                        error_12 = _e.sent();
                        this.exceptionService.sendNotFoundException(response_messages_enum_1.RESPONSE_MESSAGES.IMAGE_NOT_FOUND);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Compresses an image buffer with optional dimension constraints
     *
     * Uses the sharp library to resize and compress images above the threshold size
     *
     * @param data - Image buffer
     * @param dim - Optional dimension constraints (width and height)
     * @returns Promise resolving to the compressed image buffer
     */
    SharedService.prototype.compressImageData = function (data, dim) {
        return __awaiter(this, void 0, Promise, function () {
            var startSize, compressed, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startSize = data.length;
                        this.logger.debug("Compressing image, original size: " + startSize + " bytes");
                        // Return original if below threshold and no dimensions provided
                        if (startSize <= IMAGE_CONSTANTS.COMPRESSION_THRESHOLD && (!dim || !dim.height || !dim.width)) {
                            this.logger.debug('Image below compression threshold, returning original');
                            return [2 /*return*/, data];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        if (!(dim && dim.height && dim.width)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.resizeAndCompressImage(data, dim.width, dim.height)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [4 /*yield*/, sharp_1["default"](data).jpeg({ quality: IMAGE_CONSTANTS.JPEG_QUALITY }).withMetadata().toBuffer()];
                    case 4:
                        compressed = _a.sent();
                        this.logger.debug("Image compressed from " + startSize + " to " + compressed.length + " bytes");
                        return [2 /*return*/, compressed];
                    case 5:
                        error_13 = _a.sent();
                        this.logger.error("Image compression failed: " + error_13);
                        // Return original data if compression fails
                        return [2 /*return*/, data];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Resizes and compresses an image based on target dimensions
     *
     * Maintains aspect ratio while fitting within maximum dimensions
     *
     * @param data - Image buffer
     * @param width - Original width
     * @param height - Original height
     * @returns Promise resolving to the resized and compressed image
     */
    SharedService.prototype.resizeAndCompressImage = function (data, width, height) {
        return __awaiter(this, void 0, Promise, function () {
            var MAX_HEIGHT, MAX_WIDTH, JPEG_QUALITY, newWidth, newHeight, aspectRatio, maxAspectRatio, ratio, ratio, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        MAX_HEIGHT = IMAGE_CONSTANTS.MAX_HEIGHT, MAX_WIDTH = IMAGE_CONSTANTS.MAX_WIDTH, JPEG_QUALITY = IMAGE_CONSTANTS.JPEG_QUALITY;
                        newWidth = width;
                        newHeight = height;
                        aspectRatio = width / height;
                        maxAspectRatio = MAX_WIDTH / MAX_HEIGHT;
                        if (height > MAX_HEIGHT || width > MAX_WIDTH) {
                            if (aspectRatio < maxAspectRatio) {
                                ratio = MAX_HEIGHT / height;
                                newWidth = Math.round(ratio * width);
                                newHeight = MAX_HEIGHT;
                            }
                            else {
                                ratio = MAX_WIDTH / width;
                                newHeight = Math.round(ratio * height);
                                newWidth = MAX_WIDTH;
                            }
                        }
                        this.logger.debug("Resizing image from " + width + "x" + height + " to " + newWidth + "x" + newHeight);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, sharp_1["default"](data).jpeg({ quality: JPEG_QUALITY }).resize(newWidth, newHeight, { fit: 'outside' }).withMetadata().toBuffer()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_14 = _a.sent();
                        this.logger.error("Image resize failed: " + error_14);
                        throw error_14;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    var SharedService_1;
    SharedService = SharedService_1 = __decorate([
        common_1.Injectable()
    ], SharedService);
    return SharedService;
}());
exports.SharedService = SharedService;
