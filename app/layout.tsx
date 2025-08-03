import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Providers from './providers/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '10cg - Your AI Study Companion',
  description: 'Organize your notes, manage assignments, and get AI-powered study assistance with 10cg.',
  keywords: ['education', 'study', 'ai', 'notes', 'pdf', 'student', 'learning'],
  authors: [{ name: '10cg Team' }],
  icons: {
    icon: '/app_logo.png',
    apple: '/app_logo.png',
  },
  openGraph: {
    title: '10cg - Your AI Study Companion',
    description: 'Organize your notes, manage assignments, and get AI-powered study assistance.',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/app_logo.png',
        width: 512,
        height: 512,
        alt: '10cg Logo',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const themeColor = '#0ea5e9'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {children}
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '10px',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}