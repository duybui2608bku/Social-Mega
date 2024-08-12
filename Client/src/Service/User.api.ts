import { pathUser } from 'src/constants/path'
import {
  AuthChangePassword,
  AuthForgotPassword,
  AuthLoginResponse,
  AuthLogout,
  AuthRegisterResponse
} from 'src/Types/Auth.type'
import { UserInforConversationType } from 'src/Types/Conversations.type'
import axiosInstance from 'src/Utils/Axios'

export const UserApi = {
  Register(body: { email: string; password: string; name: string; date_of_birth: Date }) {
    return axiosInstance.post<AuthRegisterResponse>(pathUser.register, body)
  },
  Login(body: { email: string; password: string }) {
    return axiosInstance.post<AuthLoginResponse>(pathUser.login, body)
  },
  Logout(body: { refresh_token: string }) {
    return axiosInstance.post<AuthLogout>(pathUser.logout, body)
  },
  ForgotPassword(body: { email: string }) {
    return axiosInstance.post<AuthForgotPassword>(pathUser.forgotPassword, body)
  },
  ChangePassword(body: { password: string; old_password: string }) {
    return axiosInstance.post<AuthChangePassword>(pathUser.ChangePassword, body)
  },
  GetInforConversations() {
    return axiosInstance.get<UserInforConversationType>(pathUser.getInforConversations)
  }
}
