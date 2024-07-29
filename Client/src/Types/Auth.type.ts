export type AuthResponse = {
  success: boolean
  message: string
  result: {
    access_token: string
    refresh_token: string
  }
}
export type AuthLogout = {
  success: boolean
  message: string
}
