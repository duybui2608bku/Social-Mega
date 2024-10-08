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
  UPLOAD_VIDEO_HLS_SUCCESS: 'Upload video hls successfully',
  CAN_NOT_FOLLOW_YOURSELF: 'Can not follow yourself',
  REQUEST_FOLLOW_SUCCESS: 'Request follow successfully',
  ALREADY_SEND_REQUEST_FOLLOW: 'Already send request follow',
  ACCEPT_FOLLOW_SUCCESS: 'Accept follow successfully',
  YOU_DONT_HAVE_REQUEST_FOLLOW: 'You dont have request follow',
  CANCLE_FOLLOW_REQUEST_SUCCESS: 'Cancle follow request successfully',
  ADD_INSTAGRAMS_CIRCLE_SUCCESS: 'Add instagrams circle successfully',
  INSTAGRAMS_CIRCLE_MUST_BE_ARRAY: 'Instagrams circle must be an array',
  INSTAGRAMS_CIRCLE_MUST_BE_NON_EMPTY_ARRAY: 'Instagrams circle must be non empty array',
  USER_ALREADY_IN_INSTAGRAMS_CIRCLE: 'User already in instagrams circle',
  USERS_NOT_FOUND: 'Users not found',
  CAN_ADD_YOURSELF_TO_INSTAGRAMS_CIRCLE: 'Can add yourself to instagrams circle',
  DELETE_USER_OUT_OF_INSTAGRAMS_CIRCLE_SUCCESS: 'Delete user out of instagrams circle successfully',
  CANT_DELETE_YOURSELF_OUT_OF_INSTAGRAMS_CIRCLE: 'Cant delete yourself out of instagrams circle',
  USERS_NOT_EXIST_IN_INSTAGRAMS_CIRCLE: 'Users not exist in instagrams circle',
  GET_INFOR_CONVERSATION_SUCCESS: 'Get infore conversation success',
  GROUP_ID_INVALID: 'Group id invalid',
  GROUP_NOT_FOUND: 'Group not found',
  UPLOAD_DOCUMENT_SUCCESS: 'Upload document successfully'
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
  CREATE_INSTAGRAM_SUCCESS: 'Create instagram successfully',
  LIKE_INSTAGRAM_CREATE_SUCCESS: 'Like instagram create successfully',
  UN_LIKE_INSTAGRAM_CREATE_SUCCESS: 'Un like instagram create successfully',
  INSTAGRAMS_NOT_LIKED: 'Instagrams not liked',
  UN_LIKE_INSTAGRAM_SUCCESS: 'Un like instagram successfully',
  INSTAGRAMS_LIKED: 'Instagrams liked',
  INVALID_INSTAGRAMS_ID: 'Invalid instagrams id',
  INSTAGRAMS_ID_NOT_FOUND: 'Instagrams id not found',
  GET_INSTAGRAMS_SUCCESS: 'Get instagrams successfully',
  INSTAGRAMS_NOT_PUBLIC: 'Instagrams not public',
  GET_CHILDRENT_INSTAGRAMS_SUCCESS: 'Get children instagrams successfully',
  LIMIT_MUST_BE_LESS_THAN_100: 'Limit must be less than 100',
  LIMIT_MUST_BE_BIGGER_THAN_0: 'Limit must be bigger than 0',
  PAGE_MUST_BE_BIGGER_THAN_0: 'Page must be bigger than 0',
  GET_NEW_FEED_SUCCESS: 'Get new feed successfully',
  SEARCH_SUCCESS: 'Search successfully'
} as const

export const BookmarkMessgaes = {
  BOOKMARK_INSTAGRAM_CREATE_SUCCESS: 'Bookmark instagram create successfully',
  UN_BOOKMARK_INSTAGRAM_CREATE_SUCCESS: 'Un bookmark instagram create successfully',
  BOOKMARK_INSTAGRAM_NOT_SAVE_OR_NOT_FOUND: 'Bookmark instagram not save or not found'
} as const

export const SearchMessgaes = {
  CONTENT_MUST_BE_STRING: 'Content must be a string',
  PEOPLE_FOLLOW_MUST_BE_0_OR_1: 'People follow must be 0 or 1',
  USER_MUST_BE_STRING: 'User must be a string',
  USER_MUST_NOT_BE_EMPTY_STRING: 'User must not be empty string'
} as const

export const ConversationMessages = {
  GET_CONVERSATION_SUCCESS: 'Get conversation success',
  CREATE_GROUP_CONVERSATION_SUCCESS: 'Create group conversation success',
  MEMBERS_MUST_BE_ARRAY_OF_USER_ID: 'Members must be an array of user id',
  MEMBERS_MUST_BE_ARRAY_STRING_OF_USER_ID: 'Members must be an array string of user id',
  MEMBERS_MUST_BE_EMPTY_STRING: 'Members must be empty string',
  MEMBERS_NOT_FOUND: 'Members not found',
  MEMBERS_ALREADY_IN_GROUP: 'Members already in group',
  GROUP_ID_MUST_BE_STRING: 'Group id must be string',
  GROUP_NOT_FOUND: 'Group not found',
  MEMBERS_NOT_EXIST_IN_GROUP: 'Members not exist in group',
  ADD_MEMBERS_TO_GROUP_CONVERSATION_SUCCESS: 'Add members to group conversation success',
  DELETE_MEMBERS_FROM_GROUP_CONVERSATION_SUCCESS: 'Delete members from group conversation success',
  YOU_NOT_ADMIN_GROUP: 'You not admin group',
  Name_MUST_BE_STRING: 'Name must be a string',
  NAME_IS_NOT_EMPTY: 'Name is not empty',
  MEMBERS_MUST_BE_LARGE_THAN_THREE: 'Members must be large than three',
  MEMBERS_MUST_BE_STRING: 'Members must be a string',
  LEAVE_GROUP_CONVERSATION_SUCCESS: 'Leave group conversation success',
  DELETE_GROUP_CONVERSATION_SUCCESS: 'Delete group conversation success',
  CANT_DELETE_YOURSELF: 'Cant delete yourself',
  GET_CONVERSATION_GROUP_MESSAGES_SUCCESS: 'Get conversation group messages success'
} as const
