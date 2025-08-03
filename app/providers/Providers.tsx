'use client'

import { SessionProvider } from 'next-auth/react'
import { AuthProvider } from './AuthProvider'
import { ContentProvider } from './ContentProvider'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <ContentProvider>
          {children}
        </ContentProvider>
      </AuthProvider>
    </SessionProvider>
  )
} 