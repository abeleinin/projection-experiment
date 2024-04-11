import { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChanged, signInAnonymously, signOut } from 'firebase/auth'
import { getAuth } from 'firebase/auth'
import { auth } from '../firebase'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  function anonymouslySignIn() {
    const auth = getAuth()
    return signInAnonymously(auth)
      .then(result => {
        // console.log('Signed in anonymously')
        // console.log(result.user.uid)
        return result.user.uid
      })
      .catch(error => {
        const errorCode = error.code
        const errorMessage = error.message
        console.error(errorCode, errorMessage)
      })
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    anonymouslySignIn
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
