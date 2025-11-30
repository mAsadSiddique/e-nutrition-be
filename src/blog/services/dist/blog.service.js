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
var response_messages_enum_1 = require("../../utils/enums/response-messages.enum");
var utils_1 = require("../../utils/utils");
var category_entities_enum_1 = require("../../utils/enums/category-entities.enum");
var BlogService = /** @class */ (function () {
    function BlogService(blogRepo, userCategoryRepo, categoryRepo, exceptionService, sharedService, categoryService) {
        this.blogRepo = blogRepo;
        this.userCategoryRepo = userCategoryRepo;
        this.categoryRepo = categoryRepo;
        this.exceptionService = exceptionService;
        this.sharedService = sharedService;
        this.categoryService = categoryService;
    }
    BlogService.prototype.createBlog = function (args, adminId, featuredImage, images, videos) {
        return __awaiter(this, void 0, void 0, function () {
            var category, slug, existingBlog, featuredImageKey, imageKeys, uploadPromises, videoKeys, uploadPromises, blog, savedBlog, blogWithRelations, blogResponse, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 12, , 13]);
                        return [4 /*yield*/, this.categoryService.getCategoryById(args.categoryId, category_entities_enum_1.CategoryEntitiesEnum.CATEGORY)];
                    case 1:
                        category = _a.sent();
                        if (!category) {
                            this.exceptionService.sendNotFoundException(response_messages_enum_1.RESPONSE_MESSAGES.CATEGORY_NOT_FOUND);
                        }
                        slug = args.slug || utils_1.generateSlug(args.title);
                        return [4 /*yield*/, this.blogRepo.findOne({ where: { slug: slug } })];
                    case 2:
                        existingBlog = _a.sent();
                        if (existingBlog) {
                            slug = slug + "-" + Date.now();
                        }
                        featuredImageKey = null;
                        if (!featuredImage) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.sharedService.uploadFileToS3Bucket(featuredImage)];
                    case 3:
                        featuredImageKey = _a.sent();
                        _a.label = 4;
                    case 4:
                        imageKeys = [];
                        if (!(images && images.length > 0)) return [3 /*break*/, 6];
                        uploadPromises = images.map(function (image) { return _this.sharedService.uploadFileToS3Bucket(image); });
                        return [4 /*yield*/, Promise.all(uploadPromises)];
                    case 5:
                        imageKeys = _a.sent();
                        _a.label = 6;
                    case 6:
                        videoKeys = [];
                        if (!(videos && videos.length > 0)) return [3 /*break*/, 8];
                        uploadPromises = videos.map(function (video) { return _this.sharedService.uploadFileToS3Bucket(video); });
                        return [4 /*yield*/, Promise.all(uploadPromises)];
                    case 7:
                        videoKeys = _a.sent();
                        _a.label = 8;
                    case 8:
                        // Validate category is required for publishing
                        if (args.status === blog_entity_1.BlogStatus.PUBLISHED && !args.categoryId) {
                            this.exceptionService.sendNotAcceptableException(response_messages_enum_1.RESPONSE_MESSAGES.CATEGORY_REQUIRED_FOR_BLOG);
                        }
                        blog = new blog_entity_1.Blog({
                            title: args.title,
                            content: args.content,
                            excerpt: args.excerpt || args.content.substring(0, 200),
                            categoryId: args.categoryId,
                            adminId: adminId,
                            status: args.status || blog_entity_1.BlogStatus.DRAFT,
                            slug: slug,
                            featuredImageKey: featuredImageKey,
                            imageKeys: imageKeys.length > 0 ? imageKeys : null,
                            videoKeys: videoKeys.length > 0 ? videoKeys : null,
                            publishedAt: args.status === blog_entity_1.BlogStatus.PUBLISHED ? new Date() : null
                        });
                        return [4 /*yield*/, this.blogRepo.save(blog)];
                    case 9:
                        savedBlog = _a.sent();
                        return [4 /*yield*/, this.blogRepo.findOne({
                                where: { id: savedBlog.id },
                                relations: ['category', 'admin']
                            })
                            // Generate URLs for media
                        ];
                    case 10:
                        blogWithRelations = _a.sent();
                        return [4 /*yield*/, this.enrichBlogWithMediaUrls(blogWithRelations)];
                    case 11:
                        blogResponse = _a.sent();
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.BLOG_CREATED, blogResponse)];
                    case 12:
                        error_1 = _a.sent();
                        this.sharedService.sendError(error_1, this.createBlog.name);
                        return [3 /*break*/, 13];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    BlogService.prototype.updateBlog = function (args, adminId, featuredImage, images, videos) {
        return __awaiter(this, void 0, void 0, function () {
            var blog, category, existingBlog, existingBlog, _a, deletePromises, uploadPromises, _b, deletePromises, uploadPromises, _c, updatedBlog, blogWithRelations, blogResponse, error_2;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 23, , 24]);
                        return [4 /*yield*/, this.blogRepo.findOne({ where: { id: args.id } })];
                    case 1:
                        blog = _d.sent();
                        if (!blog) {
                            this.exceptionService.sendNotFoundException(response_messages_enum_1.RESPONSE_MESSAGES.BLOG_NOT_FOUND);
                        }
                        // Check if admin owns this blog
                        if (blog.adminId !== adminId) {
                            this.exceptionService.sendForbiddenException('You are not authorized to update this blog');
                        }
                        if (!args.categoryId) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.categoryService.getCategoryById(args.categoryId, category_entities_enum_1.CategoryEntitiesEnum.CATEGORY)];
                    case 2:
                        category = _d.sent();
                        if (!category) {
                            this.exceptionService.sendNotFoundException(response_messages_enum_1.RESPONSE_MESSAGES.CATEGORY_NOT_FOUND);
                        }
                        blog.categoryId = args.categoryId;
                        _d.label = 3;
                    case 3:
                        // Validate category is required for publishing
                        if (args.status === blog_entity_1.BlogStatus.PUBLISHED && !blog.categoryId) {
                            this.exceptionService.sendNotAcceptableException(response_messages_enum_1.RESPONSE_MESSAGES.CATEGORY_REQUIRED_FOR_BLOG);
                        }
                        if (!args.title) return [3 /*break*/, 5];
                        blog.title = args.title;
                        if (!!args.slug) return [3 /*break*/, 5];
                        blog.slug = utils_1.generateSlug(args.title);
                        return [4 /*yield*/, this.blogRepo.findOne({ where: { slug: blog.slug } })];
                    case 4:
                        existingBlog = _d.sent();
                        if (existingBlog && existingBlog.id !== blog.id) {
                            blog.slug = blog.slug + "-" + Date.now();
                        }
                        _d.label = 5;
                    case 5:
                        if (!args.slug) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.blogRepo.findOne({ where: { slug: args.slug } })];
                    case 6:
                        existingBlog = _d.sent();
                        if (existingBlog && existingBlog.id !== blog.id) {
                            this.exceptionService.sendConflictException(response_messages_enum_1.RESPONSE_MESSAGES.BLOG_SLUG_ALREADY_EXIST);
                        }
                        blog.slug = args.slug;
                        _d.label = 7;
                    case 7:
                        if (args.content)
                            blog.content = args.content;
                        if (args.excerpt)
                            blog.excerpt = args.excerpt;
                        if (args.status) {
                            blog.status = args.status;
                            if (args.status === blog_entity_1.BlogStatus.PUBLISHED && !blog.publishedAt) {
                                blog.publishedAt = new Date();
                            }
                        }
                        if (!featuredImage) return [3 /*break*/, 11];
                        if (!blog.featuredImageKey) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.sharedService.deleteFileFromS3Bucket(blog.featuredImageKey)];
                    case 8:
                        _d.sent();
                        _d.label = 9;
                    case 9:
                        _a = blog;
                        return [4 /*yield*/, this.sharedService.uploadFileToS3Bucket(featuredImage)];
                    case 10:
                        _a.featuredImageKey = _d.sent();
                        _d.label = 11;
                    case 11:
                        if (!(images && images.length > 0)) return [3 /*break*/, 15];
                        if (!(blog.imageKeys && blog.imageKeys.length > 0)) return [3 /*break*/, 13];
                        deletePromises = blog.imageKeys.map(function (key) { return _this.sharedService.deleteFileFromS3Bucket(key); });
                        return [4 /*yield*/, Promise.all(deletePromises)];
                    case 12:
                        _d.sent();
                        _d.label = 13;
                    case 13:
                        uploadPromises = images.map(function (image) { return _this.sharedService.uploadFileToS3Bucket(image); });
                        _b = blog;
                        return [4 /*yield*/, Promise.all(uploadPromises)];
                    case 14:
                        _b.imageKeys = _d.sent();
                        _d.label = 15;
                    case 15:
                        if (!(videos && videos.length > 0)) return [3 /*break*/, 19];
                        if (!(blog.videoKeys && blog.videoKeys.length > 0)) return [3 /*break*/, 17];
                        deletePromises = blog.videoKeys.map(function (key) { return _this.sharedService.deleteFileFromS3Bucket(key); });
                        return [4 /*yield*/, Promise.all(deletePromises)];
                    case 16:
                        _d.sent();
                        _d.label = 17;
                    case 17:
                        uploadPromises = videos.map(function (video) { return _this.sharedService.uploadFileToS3Bucket(video); });
                        _c = blog;
                        return [4 /*yield*/, Promise.all(uploadPromises)];
                    case 18:
                        _c.videoKeys = _d.sent();
                        _d.label = 19;
                    case 19: return [4 /*yield*/, this.blogRepo.save(blog)];
                    case 20:
                        updatedBlog = _d.sent();
                        return [4 /*yield*/, this.blogRepo.findOne({
                                where: { id: updatedBlog.id },
                                relations: ['category', 'admin']
                            })];
                    case 21:
                        blogWithRelations = _d.sent();
                        return [4 /*yield*/, this.enrichBlogWithMediaUrls(blogWithRelations)];
                    case 22:
                        blogResponse = _d.sent();
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.BLOG_UPDATED, blogResponse)];
                    case 23:
                        error_2 = _d.sent();
                        this.sharedService.sendError(error_2, this.updateBlog.name);
                        return [3 /*break*/, 24];
                    case 24: return [2 /*return*/];
                }
            });
        });
    };
    BlogService.prototype.deleteBlog = function (id, adminId) {
        return __awaiter(this, void 0, void 0, function () {
            var blog, deletePromises_1, error_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.blogRepo.findOne({ where: { id: id } })];
                    case 1:
                        blog = _a.sent();
                        if (!blog) {
                            this.exceptionService.sendNotFoundException(response_messages_enum_1.RESPONSE_MESSAGES.BLOG_NOT_FOUND);
                        }
                        // Check if admin owns this blog
                        if (blog.adminId !== adminId) {
                            this.exceptionService.sendForbiddenException('You are not authorized to delete this blog');
                        }
                        deletePromises_1 = [];
                        if (blog.featuredImageKey) {
                            deletePromises_1.push(this.sharedService.deleteFileFromS3Bucket(blog.featuredImageKey));
                        }
                        if (blog.imageKeys && blog.imageKeys.length > 0) {
                            blog.imageKeys.forEach(function (key) {
                                deletePromises_1.push(_this.sharedService.deleteFileFromS3Bucket(key));
                            });
                        }
                        if (blog.videoKeys && blog.videoKeys.length > 0) {
                            blog.videoKeys.forEach(function (key) {
                                deletePromises_1.push(_this.sharedService.deleteFileFromS3Bucket(key));
                            });
                        }
                        return [4 /*yield*/, Promise.all(deletePromises_1)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.blogRepo.remove(blog)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.BLOG_DELETED)];
                    case 4:
                        error_3 = _a.sent();
                        this.sharedService.sendError(error_3, this.deleteBlog.name);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    BlogService.prototype.getBlogById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var blog, blogResponse, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.blogRepo.findOne({
                                where: { id: id },
                                relations: ['category', 'admin']
                            })];
                    case 1:
                        blog = _a.sent();
                        if (!blog) {
                            this.exceptionService.sendNotFoundException(response_messages_enum_1.RESPONSE_MESSAGES.BLOG_NOT_FOUND);
                        }
                        // Increment view count
                        blog.viewsCount = (blog.viewsCount || 0) + 1;
                        return [4 /*yield*/, this.blogRepo.save(blog)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.enrichBlogWithMediaUrls(blog)];
                    case 3:
                        blogResponse = _a.sent();
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.SUCCESS, blogResponse)];
                    case 4:
                        error_4 = _a.sent();
                        this.sharedService.sendError(error_4, this.getBlogById.name);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    BlogService.prototype.listBlogs = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, page, _b, limit, categoryId, status, search, id, skip, blog, blogResponse, _c, queryBuilder, _d, blogs, total, enrichedBlogs, error_5;
            var _this = this;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 8, , 9]);
                        _a = args.page, page = _a === void 0 ? 1 : _a, _b = args.limit, limit = _b === void 0 ? 10 : _b, categoryId = args.categoryId, status = args.status, search = args.search, id = args.id;
                        skip = (page - 1) * limit;
                        if (!id) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.blogRepo.findOne({
                                where: { id: id },
                                relations: ['category', 'admin']
                            })];
                    case 1:
                        blog = _e.sent();
                        if (!blog) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.enrichBlogWithMediaUrls(blog)];
                    case 2:
                        _c = _e.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _c = null;
                        _e.label = 4;
                    case 4:
                        blogResponse = _c;
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.BLOG_LISTING, {
                                blogs: blogResponse ? [blogResponse] : [],
                                total: blogResponse ? 1 : 0,
                                page: page,
                                limit: limit
                            })];
                    case 5:
                        queryBuilder = this.blogRepo.createQueryBuilder('blog')
                            .leftJoinAndSelect('blog.category', 'category')
                            .leftJoinAndSelect('blog.admin', 'admin');
                        if (categoryId) {
                            queryBuilder.where('blog.categoryId = :categoryId', { categoryId: categoryId });
                        }
                        if (status) {
                            queryBuilder.andWhere('blog.status = :status', { status: status });
                        }
                        if (search) {
                            queryBuilder.andWhere('(blog.title LIKE :search OR blog.content LIKE :search OR blog.excerpt LIKE :search)', { search: "%" + search + "%" });
                        }
                        queryBuilder
                            .orderBy('blog.createdAt', 'DESC')
                            .skip(skip)
                            .take(limit);
                        return [4 /*yield*/, queryBuilder.getManyAndCount()
                            // Enrich blogs with media URLs
                        ];
                    case 6:
                        _d = _e.sent(), blogs = _d[0], total = _d[1];
                        return [4 /*yield*/, Promise.all(blogs.map(function (blog) { return _this.enrichBlogWithMediaUrls(blog); }))];
                    case 7:
                        enrichedBlogs = _e.sent();
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.BLOG_LISTING, {
                                blogs: enrichedBlogs,
                                total: total,
                                page: page,
                                limit: limit,
                                totalPages: Math.ceil(total / limit)
                            })];
                    case 8:
                        error_5 = _e.sent();
                        this.sharedService.sendError(error_5, this.listBlogs.name);
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    BlogService.prototype.publishBlog = function (id, adminId) {
        return __awaiter(this, void 0, void 0, function () {
            var blog, updatedBlog, blogWithRelations, blogResponse, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.blogRepo.findOne({ where: { id: id } })];
                    case 1:
                        blog = _a.sent();
                        if (!blog) {
                            this.exceptionService.sendNotFoundException(response_messages_enum_1.RESPONSE_MESSAGES.BLOG_NOT_FOUND);
                        }
                        // Check if admin owns this blog
                        if (blog.adminId !== adminId) {
                            this.exceptionService.sendForbiddenException('You are not authorized to publish this blog');
                        }
                        if (!blog.categoryId) {
                            this.exceptionService.sendNotAcceptableException(response_messages_enum_1.RESPONSE_MESSAGES.CATEGORY_REQUIRED_FOR_BLOG);
                        }
                        blog.status = blog_entity_1.BlogStatus.PUBLISHED;
                        if (!blog.publishedAt) {
                            blog.publishedAt = new Date();
                        }
                        return [4 /*yield*/, this.blogRepo.save(blog)];
                    case 2:
                        updatedBlog = _a.sent();
                        return [4 /*yield*/, this.blogRepo.findOne({
                                where: { id: updatedBlog.id },
                                relations: ['category', 'admin']
                            })];
                    case 3:
                        blogWithRelations = _a.sent();
                        return [4 /*yield*/, this.enrichBlogWithMediaUrls(blogWithRelations)];
                    case 4:
                        blogResponse = _a.sent();
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.BLOG_PUBLISHED, blogResponse)];
                    case 5:
                        error_6 = _a.sent();
                        this.sharedService.sendError(error_6, this.publishBlog.name);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    BlogService.prototype.selectCategories = function (args, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var uniqueCategoryIds, categories, userCategories, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        uniqueCategoryIds = __spreadArrays(new Set(args.categoryIds));
                        return [4 /*yield*/, this.categoryRepo.find({
                                where: { id: typeorm_2.In(uniqueCategoryIds) }
                            })];
                    case 1:
                        categories = _a.sent();
                        if (categories.length !== uniqueCategoryIds.length) {
                            this.exceptionService.sendNotFoundException(response_messages_enum_1.RESPONSE_MESSAGES.CATEGORY_NOT_FOUND);
                        }
                        // Delete existing user categories
                        return [4 /*yield*/, this.userCategoryRepo["delete"]({ userId: userId })
                            // Insert new user categories
                        ];
                    case 2:
                        // Delete existing user categories
                        _a.sent();
                        userCategories = uniqueCategoryIds.map(function (categoryId) { return ({
                            userId: userId,
                            categoryId: categoryId
                        }); });
                        return [4 /*yield*/, this.userCategoryRepo.save(userCategories)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.CATEGORIES_SELECTED, { categoryIds: uniqueCategoryIds })];
                    case 4:
                        error_7 = _a.sent();
                        this.sharedService.sendError(error_7, this.selectCategories.name);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    BlogService.prototype.getUserSelectedCategories = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var userCategories, categories, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.userCategoryRepo.find({
                                where: { userId: userId },
                                relations: ['category']
                            })];
                    case 1:
                        userCategories = _a.sent();
                        categories = userCategories.map(function (uc) { return ({
                            id: uc.category.id,
                            name: uc.category.name,
                            parentId: uc.category.parentId
                        }); });
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.USER_CATEGORIES_LISTING, { categories: categories })];
                    case 2:
                        error_8 = _a.sent();
                        this.sharedService.sendError(error_8, this.getUserSelectedCategories.name);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    BlogService.prototype.getUserBlogs = function (userId, page, limit, categoryId) {
        if (page === void 0) { page = 1; }
        if (limit === void 0) { limit = 10; }
        return __awaiter(this, void 0, void 0, function () {
            var skip, userCategories, userCategoryIds, queryBuilder, _a, blogs, total, enrichedBlogs, error_9;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        skip = (page - 1) * limit;
                        return [4 /*yield*/, this.userCategoryRepo.find({
                                where: { userId: userId },
                                select: ['categoryId']
                            })];
                    case 1:
                        userCategories = _b.sent();
                        if (userCategories.length === 0) {
                            return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.BLOG_LISTING, {
                                    blogs: [],
                                    total: 0,
                                    page: page,
                                    limit: limit,
                                    totalPages: 0
                                })];
                        }
                        userCategoryIds = userCategories.map(function (uc) { return uc.categoryId; });
                        queryBuilder = this.blogRepo.createQueryBuilder('blog')
                            .leftJoinAndSelect('blog.category', 'category')
                            .leftJoinAndSelect('blog.admin', 'admin')
                            .where('blog.status = :status', { status: blog_entity_1.BlogStatus.PUBLISHED })
                            .andWhere('blog.categoryId IN (:...categoryIds)', { categoryIds: userCategoryIds });
                        if (categoryId) {
                            queryBuilder.andWhere('blog.categoryId = :categoryId', { categoryId: categoryId });
                        }
                        queryBuilder
                            .orderBy('blog.publishedAt', 'DESC')
                            .skip(skip)
                            .take(limit);
                        return [4 /*yield*/, queryBuilder.getManyAndCount()
                            // Enrich blogs with media URLs
                        ];
                    case 2:
                        _a = _b.sent(), blogs = _a[0], total = _a[1];
                        return [4 /*yield*/, Promise.all(blogs.map(function (blog) { return _this.enrichBlogWithMediaUrls(blog); }))];
                    case 3:
                        enrichedBlogs = _b.sent();
                        return [2 /*return*/, this.sharedService.sendResponse(response_messages_enum_1.RESPONSE_MESSAGES.BLOG_LISTING, {
                                blogs: enrichedBlogs,
                                total: total,
                                page: page,
                                limit: limit,
                                totalPages: Math.ceil(total / limit)
                            })];
                    case 4:
                        error_9 = _b.sent();
                        this.sharedService.sendError(error_9, this.getUserBlogs.name);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    BlogService.prototype.enrichBlogWithMediaUrls = function (blog) {
        return __awaiter(this, void 0, void 0, function () {
            var blogResponse, _a, imageUrlPromises, _b, videoUrlPromises, _c;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        blogResponse = __assign({}, blog);
                        if (!blog.featuredImageKey) return [3 /*break*/, 2];
                        _a = blogResponse;
                        return [4 /*yield*/, this.sharedService.getFileFromS3Bucket(blog.featuredImageKey)];
                    case 1:
                        _a.featuredImageUrl = _d.sent();
                        _d.label = 2;
                    case 2:
                        if (!(blog.imageKeys && blog.imageKeys.length > 0)) return [3 /*break*/, 4];
                        imageUrlPromises = blog.imageKeys.map(function (key) { return _this.sharedService.getFileFromS3Bucket(key); });
                        _b = blogResponse;
                        return [4 /*yield*/, Promise.all(imageUrlPromises)];
                    case 3:
                        _b.imageUrls = _d.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        blogResponse.imageUrls = [];
                        _d.label = 5;
                    case 5:
                        if (!(blog.videoKeys && blog.videoKeys.length > 0)) return [3 /*break*/, 7];
                        videoUrlPromises = blog.videoKeys.map(function (key) { return _this.sharedService.getFileFromS3Bucket(key); });
                        _c = blogResponse;
                        return [4 /*yield*/, Promise.all(videoUrlPromises)];
                    case 6:
                        _c.videoUrls = _d.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        blogResponse.videoUrls = [];
                        _d.label = 8;
                    case 8:
                        // Remove keys from response (only send URLs)
                        delete blogResponse.featuredImageKey;
                        delete blogResponse.imageKeys;
                        delete blogResponse.videoKeys;
                        return [2 /*return*/, blogResponse];
                }
            });
        });
    };
    BlogService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(blog_entity_1.Blog)),
        __param(1, typeorm_1.InjectRepository(user_category_entity_1.UserCategory)),
        __param(2, typeorm_1.InjectRepository(category_entity_1.Category))
    ], BlogService);
    return BlogService;
}());
exports.BlogService = BlogService;
