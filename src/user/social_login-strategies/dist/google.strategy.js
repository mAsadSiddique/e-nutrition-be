"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.GoogleAuthGuard = exports.GoogleStrategy = void 0;
var passport_1 = require("@nestjs/passport");
var passport_google_oauth20_1 = require("passport-google-oauth20");
var common_1 = require("@nestjs/common");
var constant_1 = require("src/config/constant");
var GoogleStrategy = /** @class */ (function (_super) {
    __extends(GoogleStrategy, _super);
    function GoogleStrategy(sharedService) {
        var _this = _super.call(this, {
            clientID: constant_1.ENV.GOOGLE_LOGIN.CLIENT_ID,
            clientSecret: constant_1.ENV.GOOGLE_LOGIN.SECRET,
            callbackURL: constant_1.ENV.GOOGLE_LOGIN.REDIRECT_URL,
            scope: ['email', 'profile']
        }) || this;
        _this.sharedService = sharedService;
        return _this;
    }
    GoogleStrategy.prototype.validate = function (accessToken, refreshToken, profile, done) {
        var _a, _b;
        return __awaiter(this, void 0, Promise, function () {
            var id, name, emails, photos, phoneNumbers, user;
            return __generator(this, function (_c) {
                try {
                    console.log("Google profile: " + JSON.stringify(profile));
                    id = profile.id, name = profile.name, emails = profile.emails, photos = profile.photos, phoneNumbers = profile.phoneNumbers;
                    user = {
                        password: id,
                        email: emails[0].value,
                        firstName: name.givenName,
                        lastName: name.familyName,
                        username: (_b = (_a = (name.givenName + id)) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.replace(/\s+/g, ''),
                        phoneNumber: phoneNumbers && phoneNumbers.length > 0 ? phoneNumbers[0].value : undefined,
                        profileImage: { key: id, url: photos[0].value }
                    };
                    done(null, user);
                }
                catch (error) {
                    this.sharedService.sendError(error, this.validate.name);
                }
                return [2 /*return*/];
            });
        });
    };
    GoogleStrategy = __decorate([
        common_1.Injectable()
    ], GoogleStrategy);
    return GoogleStrategy;
}(passport_1.PassportStrategy(passport_google_oauth20_1.Strategy, 'google')));
exports.GoogleStrategy = GoogleStrategy;
var GoogleAuthGuard = /** @class */ (function (_super) {
    __extends(GoogleAuthGuard, _super);
    function GoogleAuthGuard() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GoogleAuthGuard.prototype.canActivate = function (context) {
        return _super.prototype.canActivate.call(this, context);
    };
    GoogleAuthGuard.prototype.handleRequest = function (err, user, info, context, status) {
        var _a;
        var req = context.switchToHttp().getRequest();
        if (((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.error) === 'access_denied') {
            // Do not throw; let controller handle redirect for cancel case
            return null;
        }
        if (err || !user) {
            // Fall back to default behavior (throw unauthorized)
            if (err)
                throw err;
            throw new common_1.UnauthorizedException((info === null || info === void 0 ? void 0 : info.message) || 'Unauthorized');
        }
        return user;
    };
    GoogleAuthGuard = __decorate([
        common_1.Injectable()
    ], GoogleAuthGuard);
    return GoogleAuthGuard;
}(passport_1.AuthGuard('google')));
exports.GoogleAuthGuard = GoogleAuthGuard;
