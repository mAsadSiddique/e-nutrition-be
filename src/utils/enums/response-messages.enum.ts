export enum RESPONSE_MESSAGES {

	// user

	USER_EMAIL_UNVERIFIED = 'login to your account please verify your account. we have sent a verification link to your registered email',
	USER_REGISTERED = 'user registered successfully. please check your email to verify your account',
	USER_REGISTERED_SUCCESSFULLY = 'you are registered successfully. please go for signin to continue',
	USER_REGISTERED_WITH_ASAAN = 'user registered successfully. please login to continue',
	USER_REGISTRATION_FAILED = 'user registration failed. please try again later',
	USER_REGISTERED_EMAIL_VERIFICATION_FAILED = 'User registered successfully but email verification failed',
	USER_ALREADY_EXIST = 'user already registered with this email',
	USER_ALREADY_EXIST_WITH_NUMBER = 'user already registered with this phone number ',
	USER_NOT_FOUND = 'user not found',
	USER_BLOCKED = 'you are blocked kindly contact to the support',
	INVALID_USER_ID = 'Invalid user id',
	USER_STATUS_ALREADY_SET = 'user status already set',
	USER_STATUS_UPDATED = 'user status updated successfully',
	USER_BLOCKED_SUCCESSFULLY = 'user blocked successfully',
	USER_UNBLOCKED_SUCCESSFULLY = 'user unblocked successfully',
	USER_LISTING = 'users listed below',
	REGISTERED_WITH_OTHER_METHOD = 'you are not registered with email and password, please try with other method or signup',
	SOCIAL_MEDIA_LOGIN_FAIL = 'social media login failed',

	// Admin
	ADMIN_REGISTERED = 'admin registered successfully',
	ADMIN_ALREADY_EXIST = 'admin already registered with this email',
	ADMIN_NOT_FOUND = 'admin not found',
	ADMIN_BLOCKED = 'admin blocked successfully',
	ADMIN_UNBLOCKED = 'admin unblocked successfully',
	ADMIN_REGISTERED_A_USER = 'Admin registered a user successfully',
	ADMIN_EMAIL_ALREADY_VERIFIED = 'Admin email already verified',
	EMAIL_VERIFICATION_CODE_SENT = 'Verification code sent successfully. Please check your email to verify your account.',
	EMAIL_RESEND_CODE = 'Reset password code sent to your email, please check your inbox',
	PHONE_NUMBER_NOT_SUPPORTED = 'Phone number is not supported yet',	
	ADMIN_LISTING = 'Admins listing',
	ADMIN_ROLE_UPDATED = 'Admin role updated successfully',
	// Password
	PASSWORD_NOT_MATCHED = 'password and confirm password must matched',
	INVALID_CREDENTIALS = 'invalid Credentials',
	INVALID_PASSWORD = 'invalid password',
	FORGOT_PASSWORD_REQUEST = 'we have sent you an email. Please check your inbox to reset your password',
	PASS_CHANGED_SUCCESSFULLY = 'your password is changed successfully',
	PASSWORD_ALREADY_SET = 'password is already set',
	PASSWORD_SET = 'password set successfully',
	PASS_CANT_SAME = `new and old password can't be same `,
	CANT_CHANGE_PASSWORD = `you are advised to go for set password`,
	OLD_AND_NEW_PASSWORD_SHOULD_NOT_SAME = `New and old password can't be same `,
	INVALID_OLD_PASSWORD = 'Invalid old password',
	// CANT_CHANGE_PASSWORD = `you can't change password until your are registered with email and password`,


	// Self
	SELF_BLOCKING_NOT_ALLOWED = 'self blocking not allowed',
	SELF_TRANSFERING_NOT_ALLOWED = 'self ownership transfering not allowed',
	SELF_DELETING_NOT_ALLOWED = 'self deletion is not allowed.',
	SELF_UPDATION_NOT_ALLOWED = 'self updation not allowed',
	SELF_ROLE_UPDATION_NOT_ALLOWED = 'self role updation not allowed',
	SELF_LEAVING_NOT_ALLOWED = 'self leaving is not allowed',

	// Email
	EMAIL_ALREADY_VERIFIED = 'email already verified',
	EMAIL_VERIFIED = 'your email account is verified successfully, please login to continue',
	EMAIL_RESEND = 'email resend successfully',
	EMAIL_RESEND_FAILED = 'email resend failed, please try again',
	EMAIL_COULD_NOT_BE_SENT = 'email sending failed, please try again after 5 minutes',

	// Phone Number
	PHONE_NUMBER_ALREADY_EXIST = 'phone number is already registered with other account',

	// JWt
	JWT_EXPIRED = 'your login session is expired, please login again',
	INVALID_SIGNATURE = 'invalid verification signature',
	JWT_INVALID = 'invalid verification link',
	JWT_EXPIRED_OR_INVALID = 'expired or invalid verification link',
	JWT_REQUIRED = 'verification link is required',
	JWT_OR_CODE_REQUIRED = 'jwtToken or 6 digit code is required',

	// Profile
	PROFILE_UPDATED = 'Profile updated successfully',

	// Address
	ADDRESS_ALREADY_EXIST = 'address already exist',
	ADDRESS_NOT_FOUND = 'address not found',
	ADDRESS_UPDATED = 'address updated successfully',
	INVALID_ADDRESS = 'invalid address',

	// category
	CATEGORY_ALREADY_EXIST = 'category already registered with this name',
	CATEGORY_REGISTERED = 'category registered successfully',
	CATEGORY_NOT_FOUND = 'category not found',
	PARENT_CATEGORY_NOT_FOUND = 'parent category not found',
	CATEGORY_UPDATED = 'category updated successfully',
	CATEGORY_DELETED = 'category deleted successfully',
	CATEGORY_HAS_CHILD = `category can't deleted until it has subcategory`,
	CATEGORIES_LISTING = 'categories are listed below',
	CATEGORY_ALREADY_EXIST_WITH_NAME = 'Category already exist with the same name',

	// images
	IMAGE_REQUIRED = 'atleast one image is required',
	IMAGES_LISTING = 'images are listred below',
	IMAGE_FOR_ALL_ADS_REQUIRED = 'atleast one image is required for every ad',
	DIMS_REQUIRED = 'dims is required for each image',

	// Role
	ROLE_REQUIRED = 'actioner role is required for authentication',
	ROLE_UNAUTHORIZE = 'you are not authorize to perform this action',
	ROLE_UPDATED = 'role updated successfully',

	// Generic Error Message
	SERVER_TEMPORY_DOWN = 'server is temporary down. please try again later',
	SUCCESS = 'success',
	NOT_FOUND = 'not Found',
	IMAGE_NOT_FOUND = 'image not Found',
	UNAUTHORIZED = 'unauthorized',
	LOGGED_IN = 'Logged in successfully',
	TWO_FA_LOGIN = 'please send 2fa code for successfull login',
	WAIT_TO_RESEND_AGAIN = 'please wait for 5 minutes to resend again',
	DELETED = 'deleted successfully',
	UPDATED = 'updated successfully',
	EMAIL_OR_PHONE_NUMBER_REQUIRED = 'email or phone number is required',
	NOT_A_VALID_NUMBER = 'not a number',
	FROM_DATE_MUST_BE_GREATER_THAN_TO_DATE = 'From date must be greater than to date',

	// Verifications
	CODE_EXPIRED = 'Your code has expired. Please request a new code to continue.',
	INVALID_CODE = 'The code you entered is invalid. Please check and try again.',
}
