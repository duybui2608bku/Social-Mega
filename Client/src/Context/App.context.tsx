import { createContext, useState } from 'react'
import { getAccessTokenFormLS } from 'src/Utils/Auth'
import { UserType } from 'src/Types/User.type'

interface AppContext {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  //   Token: UserType | null
  //   setToken: React.Dispatch<React.SetStateAction<UserType | null>>
  reset: () => void
}

const initialAppContext: AppContext = {
  isAuthenticated: Boolean(getAccessTokenFormLS()),
  setIsAuthenticated: () => null,
  //   Token: getAccessTokenFormLS() ? JSON.parse(getAccessTokenFormLS()) : null,
  //   setToken: () => null,
  reset: () => null
}

export const AppContext = createContext<AppContext>(initialAppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAppContext.isAuthenticated)
  //   const [Token, setToken] = useState(initialAppContext.Token)
  const reset = () => {
    setIsAuthenticated(false)
    // setToken(null)
  }
  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        // Token,
        // setToken,
        reset
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
