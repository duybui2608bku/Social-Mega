import { UserType } from 'src/Types/User.type'

export const saveAccessTokenToLS = (access_token: string) => {
  return localStorage.setItem('access_token', access_token)
}

export const saveRefreshTokenToLS = (refresh_token: string) => {
  return localStorage.setItem('refresh_token', refresh_token)
}

export const getAccessTokenFormLS = () => {
  return localStorage.getItem('access_token') || ''
}

export const getRefreshTokenFormLS = () => {
  return localStorage.getItem('refresh_token') || ''
}

export const setProfileFromLS = (profile: UserType) => {
  return localStorage.setItem('profile', JSON.stringify(profile))
}

export const getProfileFromLS = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}

export const setTimeDisconnectToLS = (receiverId: string, disconnectTime: string) => {
  localStorage.setItem(`disconnectTime_${receiverId}`, disconnectTime)
}

export const getTimeDisconnect = (receiverId: string) => {
  return localStorage.getItem(`disconnectTime_${receiverId}`)
}

export const LocalStorageEventTarget = new EventTarget()
export const clearLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('profile')
  const clearLSEvent = new Event('clearLS')
  LocalStorageEventTarget.dispatchEvent(clearLSEvent)
}
