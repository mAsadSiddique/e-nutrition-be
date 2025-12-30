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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.BlogService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var typeorm_2 = require("typeorm");
var blog_entity_1 = require("../entities/blog.entity");
var user_category_entity_1 = require("../entities/user-category.entity");
var category_entity_1 = require("../../category/entites/category.entity");
var user_blog_listing_dto_1 = require("../dtos/user-blog-listing.dto");
var response_messages_enum_1 = require("../../utils/enums/response-messages.enum");
var utils_1 = require("../../utils/utils");
var BlogService = /** @class */ (function () {
    function BlogService(blogRepo, userCategoryRepo, categoryRepo, exceptionService, sharedService, categoryService, userWishlistService) {
        this.blogRepo = blogRepo;
        this.userCategoryRepo = userCategoryRepo;
        this.categoryRepo = categoryRepo;
        this.exceptionService = exceptionService;
        this.sharedService = sharedService;
        this.categoryService = categoryService;
        this.userWishlistService = userWishlistService;
        this.logger = new common_1.Logger(BlogService_1.name);
    }
    BlogService_1 = BlogService;
    BlogService.prototype.createBlog = function (args, adminId, files) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var uniqueCategoryIds_1, categories, slug, existingBlog, blog, keys, _b, _c, error_1;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 7, , 8]);
                        uniqueCategoryIds_1 = __spreadArrays(new Set(args.categoryIds));
                        return [4 /*yield*/, this.categoryRepo.find({
                                where: { id: typeorm_2.In(uniqueCategoryIds_1) }
                            })];
                    case 1:
                        categories = _d.sent();
                        if (categories.length !== uniqueCategoryIds_1.length) {
                            this.exceptionService.sendNotFoundException(response_messages_enum_1.RESPONSE_MESSAGES.CATEGORY_NOT_FOUND);
                        }
                        // Validate category requirement for publishing
                        if (args.status === blog_entity_1.BlogStatus.PUBLISHED && (!args.categoryIds || args.categoryIds.length === 0)) {
                            if (!(categories === null || categories === void 0 ? void 0 : categories.length))
                                this.exceptionService.sendNotFoundException("Invalid category ids: " + uniqueCategoryIds_1);
                            categories.map(function (category) {
                                if (!uniqueCategoryIds_1.includes(category.id)) {
                                    _this.exceptionService.sendNotFoundException("Invalid category id: " + category.id);
                                }
                            });
                        }
                        slug = args.slug || utils_1.generateSlug(args.title);
                        return [4 /*yield*/, this.blogRepo.findOne({ where: { slug: slug } })];
                    case 2:
                        existingBlog = _d.sent();
                        if (existingBlog) {
                            slug = slug + "-" + Date.now();
                        }
                        blog = new blog_entity_1.Blog({
                            title: args.title,
                            content: args.content,
                            excerpt: args.excerpt || this.extractExcerpt(args.content),
                            adminId: adminId,
                            status: args.status || blog_entity_1.BlogStatus.DRAFT,
                            slug: slug,
                            seoTitle: args.seoTitle || args.title,
                            seoDescription: args.seoDescription || args.excerpt || this.extractExcerpt(args.content),
                            tags: args.tags || [],
                            publishedAt: args.status === blog_entity_1.BlogStatus.PUBLISHED ? new Date() : null,
                            categories: (categories === null || categories === void 0 ? void 0 : categories.map(function (category) { return category.id; })) || null
                        });
                        if (!((_a = Object.entries(files)) === null || _a === void 0 ? void 0 : _a.length)) return [3 /*break*/, 5];
                        blog.media = {};
                        return [4 /*yield*/, this.sharedService.uploadMultipleFileToS3Bucket(files, args.dims)];
                    case 3:
                        keys = _d.sent();
                        _b = blog;
                        _c = {};
                        return [4 /*yield*/, this.sharedService.getMultipleFilesFromS3Bucket(keys)];
                    case 4:
                        _b.media = (_c.images = _d.sent(), _c);
                        blog.mediaExpiredAt = new Date().setDate(new Date().getDate() + 6);
                        _d.label = 5;
                    case 5: return [4 /*yield*/, this.blogRepo.insert(blog)
                        // const blogResponse = await this.enrichBlogWithMediaUrls(blog)
                    ];
                    case 6:
                        _d.sent();
                        // const blogResponse = await this.enrichBlogWithMediaUrls(blog)
                        blog.categories = categories;
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.BLOG_CREATED, { blog: blog })];
                    case 7:
                        error_1 = _d.sent();
                        this.sharedService.sendError(error_1, this.createBlog.name);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    BlogService.prototype.updateBlog = function (args, adminId, files) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
        return __awaiter(this, void 0, void 0, function () {
            var blog_1, uniqueCategoryIds_2, categories, newStatus, categoryIds, existingBlog, existingBlog, bucketKeysToDelete_1, contentImagesKeys_1, fileKeys, mediaImagesKeys_1, keys, keyValues, error_2;
            var _this = this;
            return __generator(this, function (_v) {
                switch (_v.label) {
                    case 0:
                        _v.trys.push([0, 17, , 18]);
                        return [4 /*yield*/, this.blogRepo.findOne({
                                where: { id: args.id },
                                relations: { adminId: true }
                            })];
                    case 1:
                        blog_1 = _v.sent();
                        if (!blog_1) {
                            this.exceptionService.sendNotFoundException(response_messages_enum_1.RESPONSE_MESSAGES.BLOG_NOT_FOUND);
                        }
                        // Check if admin owns this blog
                        if (((_a = blog_1.adminId) === null || _a === void 0 ? void 0 : _a.id) !== adminId) {
                            this.exceptionService.sendForbiddenException('You are not authorized to update this blog');
                        }
                        if (!((_b = args.categoryIds) === null || _b === void 0 ? void 0 : _b.length)) return [3 /*break*/, 3];
                        uniqueCategoryIds_2 = __spreadArrays(new Set(args.categoryIds));
                        return [4 /*yield*/, this.categoryRepo.find({
                                where: { id: typeorm_2.In(uniqueCategoryIds_2) }
                            })];
                    case 2:
                        categories = _v.sent();
                        if (categories.length !== uniqueCategoryIds_2.length) {
                            if (!(categories === null || categories === void 0 ? void 0 : categories.length))
                                this.exceptionService.sendNotFoundException("Invalid category ids: " + uniqueCategoryIds_2);
                            categories.map(function (category) {
                                if (!uniqueCategoryIds_2.includes(category.id)) {
                                    _this.exceptionService.sendNotFoundException("Invalid category id: " + category.id);
                                }
                            });
                        }
                        blog_1.categories = categories.map(function (category) { return category.id; });
                        _v.label = 3;
                    case 3:
                        newStatus = args.status || blog_1.status;
                        if (newStatus === blog_entity_1.BlogStatus.PUBLISHED) {
                            categoryIds = args.categoryIds || blog_1.categories || [];
                            if (categoryIds.length === 0) {
                                this.exceptionService.sendNotAcceptableException(response_messages_enum_1.RESPONSE_MESSAGES.CATEGORY_REQUIRED_FOR_BLOG);
                            }
                        }
                        if (!args.title) return [3 /*break*/, 5];
                        blog_1.title = args.title;
                        if (!!args.slug) return [3 /*break*/, 5];
                        blog_1.slug = utils_1.generateSlug(args.title);
                        return [4 /*yield*/, this.blogRepo.findOne({ where: { slug: blog_1.slug } })];
                    case 4:
                        existingBlog = _v.sent();
                        if (existingBlog && existingBlog.id !== blog_1.id) {
                            blog_1.slug = blog_1.slug + "-" + Date.now();
                        }
                        _v.label = 5;
                    case 5:
                        if (!args.slug) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.blogRepo.findOne({ where: { slug: args.slug } })];
                    case 6:
                        existingBlog = _v.sent();
                        if (existingBlog && existingBlog.id !== blog_1.id) {
                            this.exceptionService.sendConflictException(response_messages_enum_1.RESPONSE_MESSAGES.BLOG_SLUG_ALREADY_EXIST);
                        }
                        blog_1.slug = args.slug;
                        _v.label = 7;
                    case 7:
                        if (args.content) {
                            blog_1.content = args.content;
                        }
                        if (args.excerpt)
                            blog_1.excerpt = args.excerpt;
                        if (args.seoTitle)
                            blog_1.seoTitle = args.seoTitle;
                        if (args.seoDescription)
                            blog_1.seoDescription = args.seoDescription;
                        if (args.tags)
                            blog_1.tags = args.tags;
                        if (args.status) {
                            blog_1.status = args.status;
                            if (args.status === blog_entity_1.BlogStatus.PUBLISHED && !blog_1.publishedAt) {
                                blog_1.publishedAt = new Date();
                                blog_1.unpublishedAt = null;
                            }
                            else if (args.status === blog_entity_1.BlogStatus.UNPUBLISHED) {
                                blog_1.unpublishedAt = new Date();
                            }
                            else if (args.status === blog_entity_1.BlogStatus.DRAFT) {
                                blog_1.unpublishedAt = null;
                            }
                        }
                        if (!args.mediaToBeRemoved) return [3 /*break*/, 11];
                        bucketKeysToDelete_1 = [];
                        // Remove images if specified
                        if (((_c = args.mediaToBeRemoved.imageKeys) === null || _c === void 0 ? void 0 : _c.length) && Object.entries(((_d = blog_1.media) === null || _d === void 0 ? void 0 : _d.images) || {}).length) {
                            contentImagesKeys_1 = {};
                            (_f = Object.keys(((_e = blog_1.media) === null || _e === void 0 ? void 0 : _e.images) || {})) === null || _f === void 0 ? void 0 : _f.map(function (key) {
                                contentImagesKeys_1[key.split('_')[0]] = key;
                            });
                            args.mediaToBeRemoved.imageKeys.forEach(function (key) {
                                var _a, _b, _c, _d, _e, _f;
                                if (contentImagesKeys_1 === null || contentImagesKeys_1 === void 0 ? void 0 : contentImagesKeys_1[key]) {
                                    bucketKeysToDelete_1.push(contentImagesKeys_1 === null || contentImagesKeys_1 === void 0 ? void 0 : contentImagesKeys_1[key]);
                                    (_b = (_a = blog_1.media) === null || _a === void 0 ? void 0 : _a.images) === null || _b === void 0 ? true : delete _b[contentImagesKeys_1 === null || contentImagesKeys_1 === void 0 ? void 0 : contentImagesKeys_1[key]];
                                    _this.logger.log("Removed image key \"" + key + "\" from blog " + args.id, _this.updateBlog.name);
                                }
                                if ((_d = (_c = blog_1.media) === null || _c === void 0 ? void 0 : _c.images) === null || _d === void 0 ? void 0 : _d[key]) {
                                    bucketKeysToDelete_1.push(key);
                                    (_f = (_e = blog_1.media) === null || _e === void 0 ? void 0 : _e.images) === null || _f === void 0 ? true : delete _f[key];
                                    _this.logger.log("Removed image key \"" + key + "\" from blog " + args.id, _this.updateBlog.name);
                                }
                            });
                        }
                        if (!bucketKeysToDelete_1.length) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.sharedService.deleteFilesFromS3Bucket(bucketKeysToDelete_1)];
                    case 8:
                        _v.sent();
                        this.logger.log("Deleted " + bucketKeysToDelete_1.length + " files from S3 for blog " + args.id, this.updateBlog.name);
                        return [3 /*break*/, 10];
                    case 9:
                        this.exceptionService.sendBadRequestException(response_messages_enum_1.RESPONSE_MESSAGES.MEDIA_NOT_FOUND);
                        _v.label = 10;
                    case 10:
                        if (Object.entries(((_g = blog_1.media) === null || _g === void 0 ? void 0 : _g.images) || {}).length === 0) {
                            blog_1.media = null;
                        }
                        _v.label = 11;
                    case 11:
                        if (!((_h = Object.entries(files)) === null || _h === void 0 ? void 0 : _h.length)) return [3 /*break*/, 15];
                        if (!((_j = Object.entries(files)) === null || _j === void 0 ? void 0 : _j.length)) return [3 /*break*/, 14];
                        // Enforce max image limit (5)
                        if (((_k = Object.entries(files)) === null || _k === void 0 ? void 0 : _k.length) + ((_m = Object.entries(((_l = blog_1.media) === null || _l === void 0 ? void 0 : _l.images) || {})) === null || _m === void 0 ? void 0 : _m.length) > 5) {
                            this.logger.error("Image limit exceeded (current: " + ((_p = Object.entries(((_o = blog_1.media) === null || _o === void 0 ? void 0 : _o.images) || {})) === null || _p === void 0 ? void 0 : _p.length) + ", new: " + ((_q = Object.entries(files)) === null || _q === void 0 ? void 0 : _q.length) + ")", this.updateBlog.name);
                            this.exceptionService.sendNotAcceptableException(response_messages_enum_1.RESPONSE_MESSAGES.IMAGE_LIMIT_EXCEEDED);
                        }
                        fileKeys = Object.keys(files);
                        mediaImagesKeys_1 = (_s = Object.keys(((_r = blog_1.media) === null || _r === void 0 ? void 0 : _r.images) || {})) === null || _s === void 0 ? void 0 : _s.map(function (key) { return key.split('_')[0]; });
                        fileKeys.map(function (key) {
                            if (mediaImagesKeys_1.includes(key)) {
                                _this.exceptionService.sendConflictException("Image with key: " + key + " already exists in blog media");
                            }
                        });
                        return [4 /*yield*/, this.sharedService.uploadMultipleFileToS3Bucket(files, args.dims)];
                    case 12:
                        keys = _v.sent();
                        return [4 /*yield*/, this.sharedService.getMultipleFilesFromS3Bucket(keys)];
                    case 13:
                        keyValues = _v.sent();
                        blog_1.media = __assign(__assign({}, blog_1.media), { images: __assign(__assign({}, (_t = blog_1.media) === null || _t === void 0 ? void 0 : _t.images), keyValues) });
                        this.logger.log("Uploaded " + ((_u = Object.entries(files)) === null || _u === void 0 ? void 0 : _u.length) + " new images for task post " + args.id, this.updateBlog.name);
                        _v.label = 14;
                    case 14:
                        if (!blog_1.mediaExpiredAt)
                            blog_1.mediaExpiredAt = new Date().setDate(new Date().getDate() + 6);
                        _v.label = 15;
                    case 15: return [4 /*yield*/, this.blogRepo.update({ id: blog_1.id }, blog_1)];
                    case 16:
                        _v.sent();
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.BLOG_UPDATED, { blog: blog_1 })];
                    case 17:
                        error_2 = _v.sent();
                        this.sharedService.sendError(error_2, this.updateBlog.name);
                        return [3 /*break*/, 18];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    BlogService.prototype.deleteBlog = function (id, adminId) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var blog, bucketKeys, error_3;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.blogRepo.findOne({ where: { id: id }, relations: { adminId: true } })];
                    case 1:
                        blog = _e.sent();
                        if (!blog) {
                            this.exceptionService.sendNotFoundException(response_messages_enum_1.RESPONSE_MESSAGES.BLOG_NOT_FOUND);
                        }
                        // Check if admin owns this blog
                        if (((_a = blog.adminId) === null || _a === void 0 ? void 0 : _a.id) !== adminId) {
                            this.exceptionService.sendForbiddenException('You are not authorized to delete this blog');
                        }
                        if (!Object.entries(((_b = blog === null || blog === void 0 ? void 0 : blog.media) === null || _b === void 0 ? void 0 : _b.images) || {}).length) return [3 /*break*/, 3];
                        bucketKeys = (_d = Object.keys(((_c = blog.media) === null || _c === void 0 ? void 0 : _c.images) || {})) === null || _d === void 0 ? void 0 : _d.map(function (key) { return key; });
                        if (!bucketKeys.length) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.sharedService.deleteFilesFromS3Bucket(bucketKeys)];
                    case 2:
                        _e.sent();
                        _e.label = 3;
                    case 3: return [4 /*yield*/, this.blogRepo["delete"]({ id: blog.id })];
                    case 4:
                        _e.sent();
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.BLOG_DELETED)];
                    case 5:
                        error_3 = _e.sent();
                        this.sharedService.sendError(error_3, this.deleteBlog.name);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    BlogService.prototype.getBlogById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var blog, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.blogRepo.findOne({
                                where: { id: id },
                                relations: { adminId: true, categories: true }
                            })];
                    case 1:
                        blog = _a.sent();
                        if (!blog) {
                            this.exceptionService.sendNotFoundException(response_messages_enum_1.RESPONSE_MESSAGES.BLOG_NOT_FOUND);
                        }
                        // Increment view count
                        blog.viewsCount = (blog.viewsCount || 0) + 1;
                        return [4 /*yield*/, this.blogRepo.update({ id: blog.id }, blog)
                            // const blogResponse = await this.enrichBlogWithMediaUrls(blog)
                        ];
                    case 2:
                        _a.sent();
                        // const blogResponse = await this.enrichBlogWithMediaUrls(blog)
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.SUCCESS, blog)];
                    case 3:
                        error_4 = _a.sent();
                        this.sharedService.sendError(error_4, this.getBlogById.name);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    BlogService.prototype.listBlogs = function (args) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var pageNumber, pageSize, categoryId, status, search, fromDate, toDate, id, tags, skip, queryBuilder, _d, blogs, total, _e, error_5;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 4, , 5]);
                        pageNumber = args.pageNumber, pageSize = args.pageSize, categoryId = args.categoryId, status = args.status, search = args.search, fromDate = args.fromDate, toDate = args.toDate, id = args.id, tags = args.tags;
                        skip = (pageNumber) * pageSize;
                        queryBuilder = this.blogRepo.createQueryBuilder('blog')
                            .leftJoinAndSelect('blog.adminId', 'admin');
                        if (id) {
                            queryBuilder.andWhere('blog.id = :id', { id: id });
                        }
                        if (categoryId) {
                            queryBuilder.andWhere('blog.categories @> :category', { category: JSON.stringify([categoryId]) });
                        }
                        if (status) {
                            queryBuilder.andWhere('blog.status = :status', { status: status });
                        }
                        if (search) {
                            queryBuilder.andWhere('(blog.title LIKE :search OR blog.seoTitle LIKE :search OR blog.excerpt LIKE :search OR blog.seoDescription LIKE :search)', { search: "%" + search + "%" });
                        }
                        if (tags === null || tags === void 0 ? void 0 : tags.length) {
                            queryBuilder.andWhere(tags
                                .map(function (_, index) { return "blog.tags ILIKE :tag" + index; })
                                .join(' OR '), tags.reduce(function (acc, tag, index) {
                                acc["tag" + index] = "%" + tag + "%";
                                return acc;
                            }, {}));
                        }
                        if (fromDate && toDate) {
                            queryBuilder.andWhere('blog.createdAt BETWEEN :fromDate AND :toDate', {
                                fromDate: fromDate,
                                toDate: new Date(new Date(toDate).setHours(23, 59, 59, 999))
                            });
                        }
                        else if (fromDate) {
                            queryBuilder.andWhere('blog.createdAt >= :fromDate', { fromDate: fromDate });
                        }
                        else if (toDate) {
                            queryBuilder.andWhere('blog.createdAt <= :toDate', {
                                toDate: new Date(new Date(toDate).setHours(23, 59, 59, 999))
                            });
                        }
                        queryBuilder
                            .orderBy('blog.createdAt', 'DESC')
                            .skip(skip)
                            .take(pageSize);
                        return [4 /*yield*/, queryBuilder.getManyAndCount()];
                    case 1:
                        _d = _f.sent(), blogs = _d[0], total = _d[1];
                        if (!(args.id && ((_b = (_a = blogs[0]) === null || _a === void 0 ? void 0 : _a.categories) === null || _b === void 0 ? void 0 : _b.length))) return [3 /*break*/, 3];
                        _e = blogs[0];
                        return [4 /*yield*/, this.categoryRepo.findBy({ id: typeorm_2.In((_c = blogs[0]) === null || _c === void 0 ? void 0 : _c.categories) })];
                    case 2:
                        _e.categories = (_f.sent());
                        _f.label = 3;
                    case 3: 
                    // Enrich blogs with media URLs
                    // const enrichedBlogs = await Promise.all(
                    // 	blogs.map(blog => this.enrichBlogWithMediaUrls(blog))
                    // )
                    return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.BLOG_LISTING, { total: total, blogs: blogs })];
                    case 4:
                        error_5 = _f.sent();
                        this.sharedService.sendError(error_5, this.listBlogs.name);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    BlogService.prototype.publishBlog = function (id, adminId) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var blog, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.blogRepo.findOne({
                                where: { id: id },
                                relations: { adminId: true }
                            })];
                    case 1:
                        blog = _b.sent();
                        if (!blog) {
                            this.exceptionService.sendNotFoundException(response_messages_enum_1.RESPONSE_MESSAGES.BLOG_NOT_FOUND);
                        }
                        // Check if admin owns this blog
                        if (((_a = blog.adminId) === null || _a === void 0 ? void 0 : _a.id) !== adminId) {
                            this.exceptionService.sendForbiddenException('You are not authorized to publish this blog');
                        }
                        if (!blog.categories || blog.categories.length === 0) {
                            this.exceptionService.sendNotAcceptableException(response_messages_enum_1.RESPONSE_MESSAGES.CATEGORY_REQUIRED_FOR_BLOG);
                        }
                        blog.status = blog_entity_1.BlogStatus.PUBLISHED;
                        if (!blog.publishedAt) {
                            blog.publishedAt = new Date();
                        }
                        blog.unpublishedAt = null;
                        return [4 /*yield*/, this.blogRepo.update({ id: blog.id }, blog)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.BLOG_PUBLISHED, { blog: blog })];
                    case 3:
                        error_6 = _b.sent();
                        this.sharedService.sendError(error_6, this.publishBlog.name);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    BlogService.prototype.unpublishBlog = function (id, adminId) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var blog, updatedBlog, blogWithRelations, error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.blogRepo.findOne({ where: { id: id }, relations: { adminId: true } })];
                    case 1:
                        blog = _b.sent();
                        if (!blog) {
                            this.exceptionService.sendNotFoundException(response_messages_enum_1.RESPONSE_MESSAGES.BLOG_NOT_FOUND);
                        }
                        // Check if admin owns this blog
                        if (((_a = blog.adminId) === null || _a === void 0 ? void 0 : _a.id) !== adminId) {
                            this.exceptionService.sendForbiddenException('You are not authorized to unpublish this blog');
                        }
                        blog.status = blog_entity_1.BlogStatus.UNPUBLISHED;
                        blog.unpublishedAt = new Date();
                        return [4 /*yield*/, this.blogRepo.save(blog)];
                    case 2:
                        updatedBlog = _b.sent();
                        return [4 /*yield*/, this.blogRepo.findOne({
                                where: { id: updatedBlog.id },
                                relations: ['categories', 'admin']
                            })
                            // const blogResponse = await this.enrichBlogWithMediaUrls(blogWithRelations)
                        ];
                    case 3:
                        blogWithRelations = _b.sent();
                        // const blogResponse = await this.enrichBlogWithMediaUrls(blogWithRelations)
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.BLOG_UNPUBLISHED, { blog: blog })];
                    case 4:
                        error_7 = _b.sent();
                        this.sharedService.sendError(error_7, this.unpublishBlog.name);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    BlogService.prototype.selectCategories = function (args, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var uniqueCategoryIds_3, categories, userCategoriesToUpsert, error_8;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        uniqueCategoryIds_3 = __spreadArrays(new Set(args.categoryIds));
                        return [4 /*yield*/, this.categoryRepo.find({
                                where: { id: typeorm_2.In(uniqueCategoryIds_3) }
                            })];
                    case 1:
                        categories = _a.sent();
                        if (categories.length !== uniqueCategoryIds_3.length) {
                            if (!(categories === null || categories === void 0 ? void 0 : categories.length))
                                this.exceptionService.sendNotFoundException("Invalid category ids: " + uniqueCategoryIds_3);
                            categories.map(function (category) {
                                if (!uniqueCategoryIds_3.includes(category.id)) {
                                    _this.exceptionService.sendNotFoundException("Invalid category id: " + category.id);
                                }
                            });
                        }
                        userCategoriesToUpsert = categories.map(function (category) { return new user_category_entity_1.UserCategory({
                            userId: userId,
                            categoryId: category
                        }); });
                        return [4 /*yield*/, this.userCategoryRepo.upsert(userCategoriesToUpsert, ['userId', 'categoryId'])];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.CATEGORIES_SELECTED, { userCategories: userCategoriesToUpsert })];
                    case 3:
                        error_8 = _a.sent();
                        this.sharedService.sendError(error_8, this.selectCategories.name);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    BlogService.prototype.getUserSelectedCategories = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var userCategories, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.userCategoryRepo.find({
                                where: { userId: { id: userId } },
                                relations: { categoryId: true }
                            })];
                    case 1:
                        userCategories = _a.sent();
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.USER_CATEGORIES_LISTING, { userCategories: userCategories })];
                    case 2:
                        error_9 = _a.sent();
                        this.sharedService.sendError(error_9, this.getUserSelectedCategories.name);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    BlogService.prototype.getUserBlogs = function (args, user) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function () {
            var queryBuilder, _f, blogs, total, _g, error_10;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        _h.trys.push([0, 4, , 5]);
                        queryBuilder = this.blogRepo.createQueryBuilder('blog')
                            .leftJoinAndSelect('blog.adminId', 'admin')
                            .where('blog.status = :status', { status: blog_entity_1.BlogStatus.PUBLISHED });
                        // .andWhere('categories.id IN (:...categoryIds)', { categoryIds: userCategoryIds })
                        // Only add category filter if array is not empty
                        // if (userCategoryIds.length > 0) {
                        // 	queryBuilder.andWhere(`
                        // 	  	EXISTS (
                        // 	  	  SELECT 1
                        // 	  	  FROM jsonb_array_elements(blog.categories) AS c
                        // 	  	  WHERE c::int = ANY(:categoryIds)
                        // 	  	)`,
                        // 		{ categoryIds: userCategoryIds }
                        // 	)
                        // }
                        if (args.id) {
                            queryBuilder.andWhere('blog.id = :id', { id: args.id });
                        }
                        if ((_a = args.categoryIds) === null || _a === void 0 ? void 0 : _a.length) {
                            queryBuilder.andWhere("\n  \t\t\t  \tEXISTS (\n  \t\t\t  \t  SELECT 1 \n  \t\t\t  \t  FROM jsonb_array_elements(blog.categories) AS c\n  \t\t\t  \t  WHERE c::int = ANY(:categoryIds)\n  \t\t\t  \t)", { categoryIds: args.categoryIds });
                        }
                        if (args.search) {
                            queryBuilder.andWhere('(blog.title LIKE :search OR blog.content LIKE :search OR blog.excerpt LIKE :search OR blog.seoTitle LIKE :search)', { search: "%" + args.search + "%" });
                        }
                        if ((_b = args.tags) === null || _b === void 0 ? void 0 : _b.length) {
                            queryBuilder.andWhere("blog.tags LIKE ANY (ARRAY[:...tags])", {
                                tags: args.tags.map(function (tag) { return "%" + tag + "%"; })
                            });
                        }
                        // Apply sorting
                        if (args.sortBy) {
                            queryBuilder.orderBy('blog.publishedAt', args.sortBy === user_blog_listing_dto_1.BlogSortBy.NEW_TO_OLD ? 'DESC' : 'ASC');
                        }
                        queryBuilder
                            .skip(args.pageNumber)
                            .take(args.pageSize);
                        return [4 /*yield*/, queryBuilder.getManyAndCount()];
                    case 1:
                        _f = _h.sent(), blogs = _f[0], total = _f[1];
                        if (!(args.id && ((_d = (_c = blogs[0]) === null || _c === void 0 ? void 0 : _c.categories) === null || _d === void 0 ? void 0 : _d.length))) return [3 /*break*/, 3];
                        _g = blogs[0];
                        return [4 /*yield*/, this.categoryRepo.findBy({ id: typeorm_2.In((_e = blogs[0]) === null || _e === void 0 ? void 0 : _e.categories) })];
                    case 2:
                        _g.categories = (_h.sent());
                        _h.label = 3;
                    case 3: 
                    // Enrich blogs with media URLs
                    // const enrichedBlogs = await Promise.all(
                    // 	blogs.map(blog => this.enrichBlogWithMediaUrls(blog))
                    // )
                    return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.BLOG_LISTING, { total: total, blogs: blogs })];
                    case 4:
                        error_10 = _h.sent();
                        this.sharedService.sendError(error_10, this.getUserBlogs.name);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // private async processHtmlContent(content: string): Promise<string> {
    // 	// Extract base64 images from content and upload them to S3
    // 	const base64ImageRegex = /<img[^>]+src=["']data:image\/([^;]+);base64,([^"']+)["'][^>]*>/gi
    // 	let processedContent = content
    // 	let match
    // 	while ((match = base64ImageRegex.exec(content)) !== null) {
    // 		const imageType = match[1]
    // 		const base64Data = match[2]
    // 		try {
    // 			// Convert base64 to buffer
    // 			const buffer = Buffer.from(base64Data, 'base64')
    // 			// Create a mock file object for upload
    // 			const mockFile: Express.Multer.File = {
    // 				fieldname: 'image',
    // 				originalname: `image-${Date.now()}.${imageType}`,
    // 				encoding: '7bit',
    // 				mimetype: `image/${imageType}`,
    // 				buffer: buffer,
    // 				size: buffer.length,
    // 				destination: '',
    // 				filename: '',
    // 				path: ''
    // 			}
    // 			// Upload to S3
    // 			const key = await this.sharedService.uploadFileToS3Bucket(mockFile)
    // 			const url = await this.sharedService.getFileFromS3Bucket(key)
    // 			// Replace base64 image with S3 URL
    // 			processedContent = processedContent.replace(match[0], `<img src="${url}" alt="" />`)
    // 		} catch (error) {
    // 			// If upload fails, keep the original base64 image
    // 			console.error('Failed to upload base64 image:', error)
    // 		}
    // 	}
    // 	return processedContent
    // }
    BlogService.prototype.extractExcerpt = function (content, maxLength) {
        if (maxLength === void 0) { maxLength = 200; }
        // Remove HTML tags for excerpt
        var textContent = content.replace(/<[^>]*>/g, '').trim();
        if (textContent.length <= maxLength) {
            return textContent;
        }
        return textContent.substring(0, maxLength) + '...';
    };
    // private async enrichBlogWithMediaUrls(blog: Blog) {
    // 	const blogResponse: any = { ...blog }
    // 	// Get featured image URL
    // 	if (blog.featuredImageKey) {
    // 		blogResponse.featuredImageUrl = await this.sharedService.getFileFromS3Bucket(blog.featuredImageKey)
    // 	}
    // 	// Get image URLs
    // 	if (blog.imageKeys && blog.imageKeys.length > 0) {
    // 		const imageUrlPromises = blog.imageKeys.map(key => this.sharedService.getFileFromS3Bucket(key))
    // 		blogResponse.imageUrls = await Promise.all(imageUrlPromises)
    // 	} else {
    // 		blogResponse.imageUrls = []
    // 	}
    // 	// Get video URLs
    // 	if (blog.videoKeys && blog.videoKeys.length > 0) {
    // 		const videoUrlPromises = blog.videoKeys.map(key => this.sharedService.getFileFromS3Bucket(key))
    // 		blogResponse.videoUrls = await Promise.all(videoUrlPromises)
    // 	} else {
    // 		blogResponse.videoUrls = []
    // 	}
    // 	// Remove keys from response (only send URLs)
    // 	delete blogResponse.featuredImageKey
    // 	delete blogResponse.imageKeys
    // 	delete blogResponse.videoKeys
    // 	return blogResponse
    // }
    BlogService.prototype.getUserBlogCategories = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var userCategoriesWishlist, userCategories, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.userCategoryRepo.find({
                                where: { userId: { id: userId } },
                                relations: { categoryId: true }
                            })];
                    case 1:
                        userCategoriesWishlist = _a.sent();
                        userCategories = (userCategoriesWishlist === null || userCategoriesWishlist === void 0 ? void 0 : userCategoriesWishlist.map(function (uc) { return uc.categoryId; })) || [];
                        return [2 /*return*/, userCategories];
                    case 2:
                        error_11 = _a.sent();
                        this.sharedService.sendError(error_11, this.getUserBlogCategories.name);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    BlogService.prototype.userWishlistToggle = function (args, user) {
        return __awaiter(this, void 0, void 0, function () {
            var blog, userWishlist, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.blogRepo.findOne({ where: { id: args.id } })];
                    case 1:
                        blog = _a.sent();
                        if (!blog)
                            this.exceptionService.sendNotFoundException(response_messages_enum_1.RESPONSE_MESSAGES.BLOG_NOT_FOUND);
                        return [4 /*yield*/, this.userWishlistService.userWishlistToggle(args.id, user, 'blog')];
                    case 2:
                        userWishlist = _a.sent();
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.WISHLIST_UPDATED_SUCCESSFULLY, { userWishlist: userWishlist })];
                    case 3:
                        error_12 = _a.sent();
                        this.sharedService.sendError(error_12, this.userWishlistToggle.name);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    var BlogService_1;
    BlogService = BlogService_1 = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(blog_entity_1.Blog)),
        __param(1, typeorm_1.InjectRepository(user_category_entity_1.UserCategory)),
        __param(2, typeorm_1.InjectRepository(category_entity_1.Category))
    ], BlogService);
    return BlogService;
}());
exports.BlogService = BlogService;
