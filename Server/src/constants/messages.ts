export const userMessages = {
  VALIDATION_ERROR: 'Validation Error',
  EMAIL_EXISTS: 'Email already exists',
  PASSWORDS_NOT_MATCH: 'Passwords do not match',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_STRING: 'Password must be a string',
  CONFIRM_PASSWORD_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_MUST_BE_STRONG:
    'Confirm password must be 6 to 50 characters long and contain at least 1 lowercase, 1 uppercase, 1 number, 1 symbol',
  CONFIRM_PASSWORD_MUST_BE_STRING: 'Confirm password must be a string',
  PASSWORD_MUST_BE_STRONG:
    'Password must must be 6 to 50 characters long and contain at least 1 lowercase, 1 uppercase, 1 number, 1 symbol and be at least 8 characters long',
  REGISTER_SUCCESS: 'User registered successfully',
  LOGIN_SUCCESS: 'User logged in successfully',
  NAME_REQUIRED: 'Name is required',
  NAME_LENGTH: 'Name must be between 1 and 255 characters',
  NAME_MUST_BE_STRING: 'Name must be a string',
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Email is invalid',
  DATE_OF_BIRTH_INVALID: 'Date of birth is ISO 8601 date format',
  USER_NOT_FOUND: 'Email or password is incorrect',
  ACCESS_TOKEN_REQUIRED: 'Access token is required',
  REFRESH_TOKEN_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_INVALID: 'Refresh token is invalid',
  USED_REFRESH_TOKEN_OR_NOT_EXISTS: 'Used refresh token or not exists',
  LOGOUT_SUCCESS: 'User logged out successfully',
  EMAIL_VERIFY_TOKEN_REQUIRED: 'Email verify token is required',
  EMAIL_ALREADY_VERIFIED: 'Email already verified',
  EMAIL_VERIFIED: 'Email verified successfully',
  EMAIL_VERIFY_RESEND_SUCCESS: 'Email verify token resent successfully',
  CHECK_EMAIL_FOR_RESET_PASSWORD: 'Check your email for reset password link',
  FORGOT_PASSWORD_TOKEN_REQUIRED: 'Forgot password token is required',
  VERIFY_FORGOT_PASSWORD_SUCCESS: 'Verify forgot password token successfully',
  RESET_PASSWORD_SUCCESS: 'Reset password successfully',
  GET_PROFILE_SUCCESS: 'Get profile successfully',
  USER_NOT_VERIFIED: 'User not verified',
  UPDATE_PROFILE_SUCCESS: 'Update profile successfully',
  BIO_MUST_BE_STRING: 'Bio must be a string',
  BIO_LENGTH: 'Bio must be between 1 and 160 characters',
  WEBSITE_INVALID: 'Website is invalid',
  LOCATION_MUST_BE_STRING: 'Location must be a string',
  LOCATION_LENGTH: 'Location must be between 1 and 255 characters',
  WEBSITE_MUST_BE_STRING: 'Website must be a string',
  WEBSITE_LENGTH_ERROR: 'Website must be between 1 and 255 characters',
  USER_NAME_MUST_BE_STRING: 'Username must be a string',
  AVATAR_MUST_BE_STRING: 'Avatar must be a string',
  AVATAR_INVALID: 'Avatar is invalid',
  AVATAR_LENGTH: 'Avatar must be between 1 and 400 characters',
  COVER_MUST_BE_STRING: 'Cover must be a string',
  COVER_INVALID: 'Cover is invalid',
  COVER_LENGTH: 'Cover must be between 1 and 400 characters',
  FLLOW_USER_SUCCESS: 'Follow user successfully',
  ID_FLLOW_USER_INVALID: 'Id follow user is invalid',
  ID_FLLOW_USER_REQUIRED: 'Id follow user is required',
  USER_FLLOWER_NOT_FOUND: 'User follower not found',
  USER_FLLOWERED: 'User followed',
  USER_ALREADY_FOLLOWED: 'User already followed',
  UNFOLOWER_SUCCESS: 'Unfollow user successfully',
  USER_NAME_INVALID:
    'Username must be 4-20 characters long and contain only letters, numbers, underscores and periods, not only numbers',
  USER_NAME_EXISTS: 'Username already exists',
  OLD_PASSWORD_NOT_MATCH: 'Old password does not match',
  CHANGE_PASSWORD_SUCCESS: 'Change password successfully',
  NEW_PASSWORD_MUST_BE_DIFFERENT: 'New password must be different from old password',
  UPLOAD_IMAGE_SUCCESS: 'Upload image successfully',
  GET_IMAGE_SUCCESS: 'Get image successfully',
  UPLOAD_VIDEO_SUCCESS: 'Upload video successfully',
  REFRESH_TOKEN_SUCCESS: 'Refresh token successfully',
  UPLOAD_VIDEO_HLS_SUCCESS: 'Upload video hls successfully'
} as const

export const InstagramsMessgaes = {
  INSTAGRAMS_TYPE_INVALID: 'Instagrams type is invalid',
  INSTAGRAMS_AUDIANCE_INVALID: 'Instagrams audiance is invalid',
  PARENT_ID_MUST_BE_INSTAGRAMS_ID: 'Parent id must be instagrams id',
  PARENT_ID_MUST_BE_NULL: 'Parent id must be null',
  CONTENT_MUST_BE_NON_EMPTY_STRING: 'Content must be non empty string',
  CONTENT_MUST_BE_EMPTY_STRING: 'Content must be empty string',
  HASHTAGS_MUST_BE_AN_ARRAY_OF_STRING: 'Hashtags must be an array of string',
  MENTIONS_MUST_BE_AN_ARRAY_OF_USER_ID: 'Mentions must be an array of user id',
  MEDIA_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT: 'Media must be an array of media object',
  CREATE_INSTAGRAM_SUCCESS: 'Create instagram successfully'
} as const

export const BookmarkMessgaes = {
  BOOKMARK_INSTAGRAM_CREATE_SUCCESS: 'Bookmark instagram create successfully'
} as const
