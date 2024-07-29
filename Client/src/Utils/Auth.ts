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

export const LocalStorageEventTarget = new EventTarget()
export const clearLS = () => {
  localStorage.removeItem('access_token')
  const clearLSEvent = new Event('clearLS')
  LocalStorageEventTarget.dispatchEvent(clearLSEvent)
}
