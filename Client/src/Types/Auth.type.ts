export type AuthResponse = {
  success: boolean
  message: string
  result: {
    access_token: string
    refresh_token: string
  }
}
