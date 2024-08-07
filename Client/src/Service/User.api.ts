import {
  AuthChangePassword,
  AuthForgotPassword,
  AuthLoginResponse,
  AuthLogout,
  AuthResponse
} from 'src/Types/Auth.type'
import axiosInstance from 'src/Utils/Axios'

export const UserApi = {
  Register(body: { email: string; password: string; name: string; date_of_birth: Date }) {
    return axiosInstance.post<AuthResponse>('users/register', body)
  },
  Login(body: { email: string; password: string }) {
    return axiosInstance.post<AuthLoginResponse>('users/login', body)
  },
  Logout(body: { refresh_token: string }) {
    return axiosInstance.post<AuthLogout>('users/logout', body)
  },
  ForgotPassword(body: { email: string }) {
    return axiosInstance.post<AuthForgotPassword>('users/forgot-password', body)
  },
  ChangePassword(body: { password: string; old_password: string }) {
    return axiosInstance.post<AuthChangePassword>('users/change-password', body)
  }
}
