import { AuthContext } from './AuthContext'
import { useAuth as useAuthHook } from '../hooks/useAuth'

export const AuthProvider = ({ children }) => {
  const auth = useAuthHook()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}
