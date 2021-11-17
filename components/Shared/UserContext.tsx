import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState
} from 'react'
import { TokenUser } from '../../middleware/jwt'

export const defaultUser: TokenUser = {
  username: '',
  _id: ''
}

export const UserContext = createContext<{
  currentUser: TokenUser
  setCurrentUser: Dispatch<SetStateAction<TokenUser>> | null
}>({ currentUser: defaultUser, setCurrentUser: null })

export const UserContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(defaultUser)

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  return context
}
