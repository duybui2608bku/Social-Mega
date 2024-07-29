import { AuthResponse } from 'src/Types/Auth.type'
import axiosInstance from 'src/Utils/Axios'

export const UserApi = {
  Register(body: { email: string; password: string; name: string; date_of_birth: Date }) {
    return axiosInstance.post<AuthResponse>('users/register', body)
  },
  Login(body: { email: string; password: string }) {
    return axiosInstance.post<AuthResponse>('users/login', body)
  }
}
