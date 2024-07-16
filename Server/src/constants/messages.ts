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
  USER_NOT_FOUND: 'Email or password is incorrect'
} as const
