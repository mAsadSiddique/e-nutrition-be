"use strict";
exports.__esModule = true;
exports.convertNumberStringToArray = exports.toBoolean = exports.generateSlug = exports.videoFileFilter = exports.imageFileFilter = exports.fileExtensionFilter = exports.getSesObject = exports.getWasabiS3Object = exports.getS3Object = void 0;
var common_1 = require("@nestjs/common");
var aws_sdk_1 = require("aws-sdk");
var constant_1 = require("src/config/constant");
/**
 * @description returns Bucket S3 object
 * @author Waqar Hussain
 */
exports.getS3Object = function () {
    return new aws_sdk_1.S3({
        accessKeyId: process.env.AWS_ACCESSS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        signatureVersion: 'v4',
        region: process.env.AWS_S3_REGION
    });
};
exports.getWasabiS3Object = function () {
    var credentials = new aws_sdk_1.Credentials(constant_1.ENV.S3_BUCKET.ACCESS_KEY_ID, constant_1.ENV.S3_BUCKET.SECRET_ACCESS_KEY);
    aws_sdk_1.config.credentials = credentials;
    var s3 = new aws_sdk_1.S3({
        endpoint: process.env.WASABI_ENDPOINT
    });
    return s3;
};
/**
 * @description returns Aws Simple Email Service(SES) object
 * @author Waqar Hussain
 */
exports.getSesObject = function () {
    return new aws_sdk_1.SES({
        accessKeyId: process.env.AWS_ACCESSS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        signatureVersion: 'v4',
        region: process.env.AWS_SES_REGION
    });
};
/**
 * This function takes file from multer and validate the allowed file extension
 * used in case of form data
 * @param req
 * @returns boolean
 */
exports.fileExtensionFilter = function (req, file, callback) {
    if (!file.originalname.match(/\.(docx|pdf|txt|png|jpeg|jfif|jpg|html|DOCX|PDF|TXT|PNG|JPEG|JFIF|JPG|HTML)$/)) {
        return callback(new common_1.BadRequestException('only image files like .jpg,jfif,jpeg,png,docx,pdf,txt,html are allowed'), false);
    }
    callback(null, true);
};
exports.imageFileFilter = function (req, file, callback) {
    if (!file.originalname.match(/\.(png|jpeg|jpg|gif|PNG|JPEG|JPG|GIF)$/)) {
        return callback(new common_1.BadRequestException('only image files like .jpg,jpeg,png,gif are allowed'), false);
    }
    callback(undefined, true);
};
exports.videoFileFilter = function (req, file, callback) {
    if (!file.originalname.match(/\.(mp4|avi|mov|wmv|flv|webm|MP4|AVI|MOV|WMV|FLV|WEBM)$/)) {
        return callback(new common_1.BadRequestException('only video files like .mp4,avi,mov,wmv,flv,webm are allowed'), false);
    }
    callback(undefined, true);
};
/**
 * Generate a URL-friendly slug from a string
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug
 */
function generateSlug(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and hyphens with single hyphen
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}
exports.generateSlug = generateSlug;
/**
 * This function takes stringify boolean or number string and convert it to boolean value
 * used in case of form data
 * @param value
 * @returns booelan value or undefined
 */
function toBoolean(value) {
    if (typeof value === 'boolean')
        return value;
    value = value.toLowerCase();
    return value === 'true' || value === '1' ? true : value === 'false' || value === '0' ? false : undefined;
}
exports.toBoolean = toBoolean;
/**
 * This function takes comma separated number string and convert it to array
 * used in case of form data
 * @param value
 * @returns array of string
 */
function convertNumberStringToArray(value) {
    var stringConvertedToAray = value.trim().split(',');
    var isValid = stringConvertedToAray.every(function (value) {
        return Number(value);
    });
    if (!isValid)
        throw new common_1.BadRequestException('should be valid comma separated number string');
    return stringConvertedToAray;
}
exports.convertNumberStringToArray = convertNumberStringToArray;
