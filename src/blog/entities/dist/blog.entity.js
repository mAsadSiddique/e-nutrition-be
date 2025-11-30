"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Blog = exports.BlogStatus = void 0;
var swagger_1 = require("@nestjs/swagger");
var typeorm_1 = require("typeorm");
var category_entity_1 = require("../../category/entites/category.entity");
var admin_entity_1 = require("../../admin/entities/admin.entity");
var BlogStatus;
(function (BlogStatus) {
    BlogStatus["DRAFT"] = "draft";
    BlogStatus["PUBLISHED"] = "published";
})(BlogStatus = exports.BlogStatus || (exports.BlogStatus = {}));
var Blog = /** @class */ (function () {
    function Blog(obj) {
        if (obj) {
            Object.assign(this, obj);
        }
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], Blog.prototype, "id");
    __decorate([
        swagger_1.ApiProperty({ description: 'Blog title' }),
        typeorm_1.Column({ name: 'title' })
    ], Blog.prototype, "title");
    __decorate([
        swagger_1.ApiProperty({ description: 'Blog content/body' }),
        typeorm_1.Column({ name: 'content', type: 'text' })
    ], Blog.prototype, "content");
    __decorate([
        swagger_1.ApiProperty({ description: 'Blog excerpt/summary' }),
        typeorm_1.Column({ name: 'excerpt', type: 'text', nullable: true })
    ], Blog.prototype, "excerpt");
    __decorate([
        swagger_1.ApiProperty({ description: 'Blog featured image' }),
        typeorm_1.Column({ name: 'featured_image_key', nullable: true })
    ], Blog.prototype, "featuredImageKey");
    __decorate([
        swagger_1.ApiProperty({ description: 'Blog images array (JSON)' }),
        typeorm_1.Column({ name: 'image_keys', type: 'simple-array', nullable: true })
    ], Blog.prototype, "imageKeys");
    __decorate([
        swagger_1.ApiProperty({ description: 'Blog videos array (JSON)' }),
        typeorm_1.Column({ name: 'video_keys', type: 'simple-array', nullable: true })
    ], Blog.prototype, "videoKeys");
    __decorate([
        swagger_1.ApiProperty({ description: 'Blog category ID' }),
        typeorm_1.Column({ name: 'category_id' })
    ], Blog.prototype, "categoryId");
    __decorate([
        typeorm_1.ManyToOne(function () { return category_entity_1.Category; }),
        typeorm_1.JoinColumn({ name: 'category_id' })
    ], Blog.prototype, "category");
    __decorate([
        swagger_1.ApiProperty({ description: 'Admin who created the blog' }),
        typeorm_1.Column({ name: 'admin_id' })
    ], Blog.prototype, "adminId");
    __decorate([
        typeorm_1.ManyToOne(function () { return admin_entity_1.Admin; }),
        typeorm_1.JoinColumn({ name: 'admin_id' })
    ], Blog.prototype, "admin");
    __decorate([
        swagger_1.ApiProperty({ description: 'Blog status (draft/published)' }),
        typeorm_1.Column({ name: 'status', type: 'enum', "enum": BlogStatus, "default": BlogStatus.DRAFT })
    ], Blog.prototype, "status");
    __decorate([
        swagger_1.ApiProperty({ description: 'Blog slug for SEO' }),
        typeorm_1.Column({ name: 'slug', unique: true, nullable: true })
    ], Blog.prototype, "slug");
    __decorate([
        swagger_1.ApiProperty({ description: 'Blog views count' }),
        typeorm_1.Column({ name: 'views_count', "default": 0 })
    ], Blog.prototype, "viewsCount");
    __decorate([
        swagger_1.ApiProperty({ description: 'Blog publish date' }),
        typeorm_1.Column({ name: 'published_at', nullable: true })
    ], Blog.prototype, "publishedAt");
    __decorate([
        typeorm_1.CreateDateColumn({ name: 'created_at' })
    ], Blog.prototype, "createdAt");
    __decorate([
        typeorm_1.UpdateDateColumn({ name: 'updated_at' })
    ], Blog.prototype, "updatedAt");
    Blog = __decorate([
        typeorm_1.Entity('blog')
    ], Blog);
    return Blog;
}());
exports.Blog = Blog;
