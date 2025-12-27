"use strict";
exports.__esModule = true;
exports.RESPONSE_MESSAGES = void 0;
var RESPONSE_MESSAGES;
(function (RESPONSE_MESSAGES) {
    // user
    RESPONSE_MESSAGES["USER_EMAIL_UNVERIFIED"] = "login to your account please verify your account. we have sent a verification link to your registered email";
    RESPONSE_MESSAGES["USER_REGISTERED"] = "user registered successfully. please check your email to verify your account";
    RESPONSE_MESSAGES["USER_REGISTERED_SUCCESSFULLY"] = "you are registered successfully. please go for signin to continue";
    RESPONSE_MESSAGES["USER_REGISTERED_WITH_ASAAN"] = "user registered successfully. please login to continue";
    RESPONSE_MESSAGES["USER_REGISTRATION_FAILED"] = "user registration failed. please try again later";
    RESPONSE_MESSAGES["USER_REGISTERED_EMAIL_VERIFICATION_FAILED"] = "User registered successfully but email verification failed";
    RESPONSE_MESSAGES["USER_EMAIL_ALREADY_EXIST"] = "user already registered with this email";
    RESPONSE_MESSAGES["USER_PHONE_ALREADY_EXIST"] = "user already registered with this phone number ";
    RESPONSE_MESSAGES["USER_NOT_FOUND"] = "user not found";
    RESPONSE_MESSAGES["USER_BLOCKED"] = "you are blocked kindly contact to the support";
    RESPONSE_MESSAGES["INVALID_USER_ID"] = "Invalid user id";
    RESPONSE_MESSAGES["USER_STATUS_ALREADY_SET"] = "user status already set";
    RESPONSE_MESSAGES["USER_STATUS_UPDATED"] = "user status updated successfully";
    RESPONSE_MESSAGES["USER_BLOCKED_SUCCESSFULLY"] = "user blocked successfully";
    RESPONSE_MESSAGES["USER_UNBLOCKED_SUCCESSFULLY"] = "user unblocked successfully";
    RESPONSE_MESSAGES["USER_LISTING"] = "users listed below";
    RESPONSE_MESSAGES["REGISTERED_WITH_OTHER_METHOD"] = "you are not registered with email and password, please try with other method or signup";
    RESPONSE_MESSAGES["SOCIAL_MEDIA_LOGIN_FAIL"] = "social media login failed";
    RESPONSE_MESSAGES["UserVerificationPending"] = "Please verify your account to continue. We have sent a verification code to your registered contact information.";
    RESPONSE_MESSAGES["UsernameAlreadyExist"] = "This username is already linked to an existing account";
    RESPONSE_MESSAGES["RegisteredNotWithThisMethod"] = "You are not registered with email/phone and password, please try alternate method or signup";
    RESPONSE_MESSAGES["UserPasswordReset"] = "User password reset successfully";
    RESPONSE_MESSAGES["UserAlreadyExist"] = "User already exist";
    // Admin
    RESPONSE_MESSAGES["ADMIN_REGISTERED"] = "admin registered successfully";
    RESPONSE_MESSAGES["ADMIN_ALREADY_EXIST"] = "admin already registered with this email";
    RESPONSE_MESSAGES["ADMIN_NOT_FOUND"] = "admin not found";
    RESPONSE_MESSAGES["ADMIN_BLOCKED"] = "admin blocked successfully";
    RESPONSE_MESSAGES["ADMIN_UNBLOCKED"] = "admin unblocked successfully";
    RESPONSE_MESSAGES["ADMIN_REGISTERED_A_USER"] = "Admin registered a user successfully";
    RESPONSE_MESSAGES["ADMIN_EMAIL_ALREADY_VERIFIED"] = "Admin email already verified";
    RESPONSE_MESSAGES["EMAIL_VERIFICATION_CODE_SENT"] = "Verification code sent successfully. Please check your email to verify your account.";
    RESPONSE_MESSAGES["EMAIL_RESEND_CODE"] = "Reset password code sent to your email, please check your inbox";
    RESPONSE_MESSAGES["PHONE_NUMBER_NOT_SUPPORTED"] = "Phone number is not supported yet";
    RESPONSE_MESSAGES["ADMIN_LISTING"] = "Admins listing";
    RESPONSE_MESSAGES["ADMIN_ROLE_UPDATED"] = "Admin role updated successfully";
    // Password
    RESPONSE_MESSAGES["PASSWORD_NOT_MATCHED"] = "password and confirm password must matched";
    RESPONSE_MESSAGES["INVALID_CREDENTIALS"] = "invalid Credentials";
    RESPONSE_MESSAGES["INVALID_PASSWORD"] = "invalid password";
    RESPONSE_MESSAGES["FORGOT_PASSWORD_REQUEST"] = "we have sent you an email. Please check your inbox to reset your password";
    RESPONSE_MESSAGES["PASS_CHANGED_SUCCESSFULLY"] = "your password is changed successfully";
    RESPONSE_MESSAGES["PASSWORD_ALREADY_SET"] = "password is already set";
    RESPONSE_MESSAGES["PASSWORD_SET"] = "password set successfully";
    RESPONSE_MESSAGES["PASS_CANT_SAME"] = "new and old password can't be same ";
    RESPONSE_MESSAGES["CANT_CHANGE_PASSWORD"] = "you are advised to go for set password";
    RESPONSE_MESSAGES["OLD_AND_NEW_PASSWORD_SHOULD_NOT_SAME"] = "New and old password can't be same ";
    RESPONSE_MESSAGES["INVALID_OLD_PASSWORD"] = "Invalid old password";
    RESPONSE_MESSAGES["UserPasswordUpdated"] = "User password updated successfully";
    // CANT_CHANGE_PASSWORD = `you can't change password until your are registered with email and password`,
    // Self
    RESPONSE_MESSAGES["SELF_BLOCKING_NOT_ALLOWED"] = "self blocking not allowed";
    RESPONSE_MESSAGES["SELF_TRANSFERING_NOT_ALLOWED"] = "self ownership transfering not allowed";
    RESPONSE_MESSAGES["SELF_DELETING_NOT_ALLOWED"] = "self deletion is not allowed.";
    RESPONSE_MESSAGES["SELF_UPDATION_NOT_ALLOWED"] = "self updation not allowed";
    RESPONSE_MESSAGES["SELF_ROLE_UPDATION_NOT_ALLOWED"] = "self role updation not allowed";
    RESPONSE_MESSAGES["SELF_LEAVING_NOT_ALLOWED"] = "self leaving is not allowed";
    // Email
    RESPONSE_MESSAGES["EMAIL_ALREADY_VERIFIED"] = "email already verified";
    RESPONSE_MESSAGES["EMAIL_VERIFIED"] = "your email account is verified successfully, please login to continue";
    RESPONSE_MESSAGES["EMAIL_RESEND"] = "email resend successfully";
    RESPONSE_MESSAGES["EMAIL_RESEND_FAILED"] = "email resend failed, please try again";
    RESPONSE_MESSAGES["EMAIL_COULD_NOT_BE_SENT"] = "email sending failed, please try again after 5 minutes";
    RESPONSE_MESSAGES["EmailVerificationCodeSent"] = "Verification code sent successfully. Please check your email to verify your account.";
    RESPONSE_MESSAGES["EmailVerificationPending"] = "Please verify your email address. Check your inbox for the verification code.";
    RESPONSE_MESSAGES["EmailResetCodeSent"] = "Reset password code sent to your email, please check your inbox";
    // Phone Number
    RESPONSE_MESSAGES["PhoneVerificationCodeSent"] = "Verification code sent successfully. Please check your messages to verify your account.";
    RESPONSE_MESSAGES["UserPhoneNumAlreadyVerified"] = "User phone number already verified successfully";
    RESPONSE_MESSAGES["PhoneVerificationPending"] = "Please verify your phone number. Check your messages for the verification code.";
    RESPONSE_MESSAGES["PhoneResetCodeSent"] = "Reset password code sent to your phone, please check your messages";
    // JWt
    RESPONSE_MESSAGES["JWT_EXPIRED"] = "your login session is expired, please login again";
    RESPONSE_MESSAGES["INVALID_SIGNATURE"] = "invalid verification signature";
    RESPONSE_MESSAGES["JWT_INVALID"] = "invalid verification link";
    RESPONSE_MESSAGES["JWT_EXPIRED_OR_INVALID"] = "expired or invalid verification link";
    RESPONSE_MESSAGES["JWT_REQUIRED"] = "verification link is required";
    RESPONSE_MESSAGES["JWT_OR_CODE_REQUIRED"] = "jwtToken or 6 digit code is required";
    // Profile
    RESPONSE_MESSAGES["PROFILE_UPDATED"] = "Profile updated successfully";
    // Address
    RESPONSE_MESSAGES["ADDRESS_ALREADY_EXIST"] = "address already exist";
    RESPONSE_MESSAGES["ADDRESS_NOT_FOUND"] = "address not found";
    RESPONSE_MESSAGES["ADDRESS_UPDATED"] = "address updated successfully";
    RESPONSE_MESSAGES["INVALID_ADDRESS"] = "invalid address";
    // category
    RESPONSE_MESSAGES["CATEGORY_ALREADY_EXIST"] = "category already registered with this name";
    RESPONSE_MESSAGES["CATEGORY_REGISTERED"] = "category registered successfully";
    RESPONSE_MESSAGES["CATEGORY_NOT_FOUND"] = "category not found";
    RESPONSE_MESSAGES["PARENT_CATEGORY_NOT_FOUND"] = "parent category not found";
    RESPONSE_MESSAGES["CATEGORY_UPDATED"] = "category updated successfully";
    RESPONSE_MESSAGES["CATEGORY_DELETED"] = "category deleted successfully";
    RESPONSE_MESSAGES["CATEGORY_HAS_CHILD"] = "category can't deleted until it has subcategory";
    RESPONSE_MESSAGES["CATEGORIES_LISTING"] = "categories are listed below";
    RESPONSE_MESSAGES["CATEGORY_ALREADY_EXIST_WITH_NAME"] = "Category already exist with the same name";
    // images
    RESPONSE_MESSAGES["IMAGE_REQUIRED"] = "atleast one image is required";
    RESPONSE_MESSAGES["IMAGES_LISTING"] = "images are listred below";
    RESPONSE_MESSAGES["IMAGE_FOR_ALL_ADS_REQUIRED"] = "atleast one image is required for every ad";
    RESPONSE_MESSAGES["DIMS_REQUIRED"] = "dims is required for each image";
    RESPONSE_MESSAGES["MEDIA_NOT_FOUND"] = "media not found";
    RESPONSE_MESSAGES["IMAGE_LIMIT_EXCEEDED"] = "You cannot upload more than 5 images at once";
    // Role
    RESPONSE_MESSAGES["ROLE_REQUIRED"] = "actioner role is required for authentication";
    RESPONSE_MESSAGES["ROLE_UNAUTHORIZE"] = "you are not authorize to perform this action";
    RESPONSE_MESSAGES["ROLE_UPDATED"] = "role updated successfully";
    // Generic Error Message
    RESPONSE_MESSAGES["SERVER_TEMPORY_DOWN"] = "server is temporary down. please try again later";
    RESPONSE_MESSAGES["SUCCESS"] = "success";
    RESPONSE_MESSAGES["NOT_FOUND"] = "not Found";
    RESPONSE_MESSAGES["IMAGE_NOT_FOUND"] = "image not Found";
    RESPONSE_MESSAGES["UNAUTHORIZED"] = "unauthorized";
    RESPONSE_MESSAGES["LOGGED_IN"] = "Logged in successfully";
    RESPONSE_MESSAGES["TWO_FA_LOGIN"] = "please send 2fa code for successfull login";
    RESPONSE_MESSAGES["WAIT_TO_RESEND_AGAIN"] = "please wait for 5 minutes to resend again";
    RESPONSE_MESSAGES["DELETED"] = "deleted successfully";
    RESPONSE_MESSAGES["UPDATED"] = "updated successfully";
    RESPONSE_MESSAGES["EMAIL_OR_PHONE_NUMBER_REQUIRED"] = "email or phone number is required";
    RESPONSE_MESSAGES["NOT_A_VALID_NUMBER"] = "not a number";
    RESPONSE_MESSAGES["FROM_DATE_MUST_BE_GREATER_THAN_TO_DATE"] = "From date must be greater than to date";
    // Verifications
    RESPONSE_MESSAGES["CODE_EXPIRED"] = "Your code has expired. Please request a new code to continue.";
    RESPONSE_MESSAGES["INVALID_CODE"] = "The code you entered is invalid. Please check and try again.";
    // Blog
    RESPONSE_MESSAGES["BLOG_CREATED"] = "Blog created successfully";
    RESPONSE_MESSAGES["BLOG_NOT_FOUND"] = "Blog not found";
    RESPONSE_MESSAGES["BLOG_UPDATED"] = "Blog updated successfully";
    RESPONSE_MESSAGES["BLOG_DELETED"] = "Blog deleted successfully";
    RESPONSE_MESSAGES["BLOG_PUBLISHED"] = "Blog published successfully";
    RESPONSE_MESSAGES["BLOG_UNPUBLISHED"] = "Blog unpublished successfully";
    RESPONSE_MESSAGES["BLOG_LISTING"] = "Blogs listed below";
    RESPONSE_MESSAGES["BLOG_SLUG_ALREADY_EXIST"] = "Blog with this slug already exists";
    RESPONSE_MESSAGES["CATEGORY_REQUIRED_FOR_BLOG"] = "At least one category is required before publishing the blog";
    RESPONSE_MESSAGES["BLOG_CANNOT_BE_PUBLISHED_WITHOUT_CATEGORY"] = "Blog cannot be published without selecting at least one category";
    // User Categories
    RESPONSE_MESSAGES["CATEGORIES_SELECTED"] = "Categories selected successfully";
    RESPONSE_MESSAGES["USER_CATEGORIES_UPDATED"] = "User categories updated successfully";
    RESPONSE_MESSAGES["USER_CATEGORIES_LISTING"] = "User selected categories listed below";
    // Wishlist
    RESPONSE_MESSAGES["WISHLIST_UPDATED_SUCCESSFULLY"] = "Wishlist updated successfully";
    RESPONSE_MESSAGES["WISHLIST_NOT_FOUND"] = "Wishlist not found";
})(RESPONSE_MESSAGES = exports.RESPONSE_MESSAGES || (exports.RESPONSE_MESSAGES = {}));
