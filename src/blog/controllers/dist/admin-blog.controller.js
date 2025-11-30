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
exports.AdminBlogController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var swagger_1 = require("@nestjs/swagger");
var blog_entity_1 = require("../entities/blog.entity");
var admin_auth_guard_1 = require("../../auth/guard/admin_auth.guard");
var roles_auth_guard_1 = require("../../auth/guard/roles-auth.guard");
var roles_decorator_1 = require("../../auth/decorators/roles.decorator");
var roles_enum_1 = require("../../utils/enums/roles.enum");
var user_decorator_1 = require("../../auth/decorators/user.decorator");
var response_messages_enum_1 = require("../../utils/enums/response-messages.enum");
var multer_1 = require("multer");
var file_upload_util_1 = require("../utils/file-upload.util");
var AdminBlogController = /** @class */ (function () {
    function AdminBlogController(blogService) {
        this.blogService = blogService;
    }
    AdminBlogController.prototype.createBlog = function (args, admin, files) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, featuredImage, images, videos;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = file_upload_util_1.separateFiles(files || []), featuredImage = _a.featuredImage, images = _a.images, videos = _a.videos;
                        // Validate file types
                        if (featuredImage && !featuredImage.originalname.match(/\.(png|jpeg|jpg|gif|PNG|JPEG|JPG|GIF)$/)) {
                            throw new common_1.BadRequestException('Featured image must be an image file (jpg, jpeg, png, gif)');
                        }
                        images.forEach(function (img) {
                            if (!img.originalname.match(/\.(png|jpeg|jpg|gif|PNG|JPEG|JPG|GIF)$/)) {
                                throw new common_1.BadRequestException('All image files must be image format (jpg, jpeg, png, gif)');
                            }
                        });
                        videos.forEach(function (vid) {
                            if (!vid.originalname.match(/\.(mp4|avi|mov|wmv|flv|webm|MP4|AVI|MOV|WMV|FLV|WEBM)$/)) {
                                throw new common_1.BadRequestException('All video files must be video format (mp4, avi, mov, wmv, flv, webm)');
                            }
                        });
                        return [4 /*yield*/, this.blogService.createBlog(args, admin.id, featuredImage, images.length > 0 ? images : undefined, videos.length > 0 ? videos : undefined)];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    AdminBlogController.prototype.updateBlog = function (args, admin, files) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, featuredImage, images, videos;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = file_upload_util_1.separateFiles(files || []), featuredImage = _a.featuredImage, images = _a.images, videos = _a.videos;
                        // Validate file types
                        if (featuredImage && !featuredImage.originalname.match(/\.(png|jpeg|jpg|gif|PNG|JPEG|JPG|GIF)$/)) {
                            throw new common_1.BadRequestException('Featured image must be an image file (jpg, jpeg, png, gif)');
                        }
                        images.forEach(function (img) {
                            if (!img.originalname.match(/\.(png|jpeg|jpg|gif|PNG|JPEG|JPG|GIF)$/)) {
                                throw new common_1.BadRequestException('All image files must be image format (jpg, jpeg, png, gif)');
                            }
                        });
                        videos.forEach(function (vid) {
                            if (!vid.originalname.match(/\.(mp4|avi|mov|wmv|flv|webm|MP4|AVI|MOV|WMV|FLV|WEBM)$/)) {
                                throw new common_1.BadRequestException('All video files must be video format (mp4, avi, mov, wmv, flv, webm)');
                            }
                        });
                        return [4 /*yield*/, this.blogService.updateBlog(args, admin.id, featuredImage, images.length > 0 ? images : undefined, videos.length > 0 ? videos : undefined)];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    AdminBlogController.prototype.deleteBlog = function (_a, admin) {
        var id = _a.id;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.blogService.deleteBlog(id, admin.id)];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    AdminBlogController.prototype.listBlogs = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.blogService.listBlogs(args)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AdminBlogController.prototype.getBlogById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.blogService.getBlogById(id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AdminBlogController.prototype.publishBlog = function (id, admin) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.blogService.publishBlog(id, admin.id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    __decorate([
        swagger_1.ApiCreatedResponse({
            description: response_messages_enum_1.RESPONSE_MESSAGES.BLOG_CREATED,
            type: blog_entity_1.Blog
        }),
        swagger_1.ApiBadRequestResponse({ description: response_messages_enum_1.RESPONSE_MESSAGES.CATEGORY_NOT_FOUND }),
        swagger_1.ApiConsumes('multipart/form-data'),
        swagger_1.ApiBody({
            schema: {
                type: 'object',
                properties: {
                    title: { type: 'string', example: 'How to Build a NestJS Application' },
                    content: { type: 'string', example: 'This is the full content of the blog post...' },
                    excerpt: { type: 'string', example: 'A brief summary of the blog post' },
                    categoryId: { type: 'number', example: 1 },
                    status: { type: 'string', "enum": ['draft', 'published'], example: 'draft' },
                    slug: { type: 'string', example: 'how-to-build-nestjs-application' },
                    featuredImage: { type: 'string', format: 'binary' },
                    images: { type: 'array', items: { type: 'string', format: 'binary' } },
                    videos: { type: 'array', items: { type: 'string', format: 'binary' } }
                },
                required: ['title', 'content', 'categoryId']
            }
        }),
        common_1.UseInterceptors(platform_express_1.AnyFilesInterceptor({
            storage: multer_1.memoryStorage()
        })),
        common_1.Post('/create'),
        __param(0, common_1.Body()),
        __param(1, user_decorator_1.user()),
        __param(2, common_1.UploadedFiles())
    ], AdminBlogController.prototype, "createBlog");
    __decorate([
        swagger_1.ApiCreatedResponse({
            description: response_messages_enum_1.RESPONSE_MESSAGES.BLOG_UPDATED,
            type: blog_entity_1.Blog
        }),
        swagger_1.ApiNotFoundResponse({ description: response_messages_enum_1.RESPONSE_MESSAGES.BLOG_NOT_FOUND }),
        swagger_1.ApiConsumes('multipart/form-data'),
        swagger_1.ApiBody({
            schema: {
                type: 'object',
                properties: {
                    id: { type: 'number', example: 1 },
                    title: { type: 'string', example: 'How to Build a NestJS Application' },
                    content: { type: 'string', example: 'This is the full content of the blog post...' },
                    excerpt: { type: 'string', example: 'A brief summary of the blog post' },
                    categoryId: { type: 'number', example: 1 },
                    status: { type: 'string', "enum": ['draft', 'published'], example: 'draft' },
                    slug: { type: 'string', example: 'how-to-build-nestjs-application' },
                    featuredImage: { type: 'string', format: 'binary' },
                    images: { type: 'array', items: { type: 'string', format: 'binary' } },
                    videos: { type: 'array', items: { type: 'string', format: 'binary' } }
                }
            }
        }),
        common_1.UseInterceptors(platform_express_1.AnyFilesInterceptor({
            storage: multer_1.memoryStorage()
        })),
        common_1.Put('/update'),
        __param(0, common_1.Body()),
        __param(1, user_decorator_1.user()),
        __param(2, common_1.UploadedFiles())
    ], AdminBlogController.prototype, "updateBlog");
    __decorate([
        swagger_1.ApiCreatedResponse({
            description: response_messages_enum_1.RESPONSE_MESSAGES.BLOG_DELETED
        }),
        swagger_1.ApiNotFoundResponse({ description: response_messages_enum_1.RESPONSE_MESSAGES.BLOG_NOT_FOUND }),
        common_1.Delete('/delete'),
        __param(0, common_1.Query()), __param(1, user_decorator_1.user())
    ], AdminBlogController.prototype, "deleteBlog");
    __decorate([
        swagger_1.ApiCreatedResponse({
            description: response_messages_enum_1.RESPONSE_MESSAGES.BLOG_LISTING,
            type: blog_entity_1.Blog
        }),
        common_1.Get('/list'),
        __param(0, common_1.Query())
    ], AdminBlogController.prototype, "listBlogs");
    __decorate([
        swagger_1.ApiCreatedResponse({
            description: response_messages_enum_1.RESPONSE_MESSAGES.SUCCESS,
            type: blog_entity_1.Blog
        }),
        swagger_1.ApiNotFoundResponse({ description: response_messages_enum_1.RESPONSE_MESSAGES.BLOG_NOT_FOUND }),
        common_1.Get('/:id'),
        __param(0, common_1.Param('id', common_1.ParseIntPipe))
    ], AdminBlogController.prototype, "getBlogById");
    __decorate([
        swagger_1.ApiCreatedResponse({
            description: response_messages_enum_1.RESPONSE_MESSAGES.BLOG_PUBLISHED,
            type: blog_entity_1.Blog
        }),
        swagger_1.ApiNotFoundResponse({ description: response_messages_enum_1.RESPONSE_MESSAGES.BLOG_NOT_FOUND }),
        swagger_1.ApiBadRequestResponse({ description: response_messages_enum_1.RESPONSE_MESSAGES.CATEGORY_REQUIRED_FOR_BLOG }),
        common_1.Put('/publish/:id'),
        __param(0, common_1.Param('id', common_1.ParseIntPipe)), __param(1, user_decorator_1.user())
    ], AdminBlogController.prototype, "publishBlog");
    AdminBlogController = __decorate([
        swagger_1.ApiTags('admin-blog'),
        swagger_1.ApiBearerAuth('JWT'),
        common_1.Controller('admin/blog'),
        roles_decorator_1.Role(roles_enum_1.Roles.SUPER, roles_enum_1.Roles.SUB),
        common_1.UseGuards(admin_auth_guard_1.AdminAuthGuard, roles_auth_guard_1.RoleGuard)
    ], AdminBlogController);
    return AdminBlogController;
}());
exports.AdminBlogController = AdminBlogController;
