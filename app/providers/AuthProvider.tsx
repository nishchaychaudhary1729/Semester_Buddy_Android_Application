'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSession, signIn, signOut } from 'next-auth/react'
import { User } from '../types'

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGithub: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGithub: async () => {},
  logout: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const user: User | null = session?.user ? (session.user as User) : null;
  const loading = status === 'loading'

  const signInWithGithub = async () => {
    try {
      await signIn('github')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An error occurred during sign in')
      }
    }
  }

  const logout = async () => {
    try {
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An error occurred during sign out')
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGithub, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)