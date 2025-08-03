'use client'

import { useAuth } from './providers/AuthProvider'
import LoginScreen from './components/LoginScreen'
import Dashboard from './components/Dashboard'
import LoadingSpinner from './components/LoadingSpinner'

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <LoginScreen />
  }

  return <Dashboard />
}