'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../providers/AuthProvider'
import { 
  BookOpen, 
  Brain, 
  FileText, 
  Calendar, 
  Settings, 
  LogOut, 
  User,
  Sparkles,
  AlertCircle
} from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import toast from 'react-hot-toast'

export default function LoginScreen() {
  const { signInWithGoogle, loading, user } = useAuth()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset state when component mounts or user changes
  useEffect(() => {
    if (!user) {
      setIsSigningIn(false)
      setError(null)
    }
  }, [user])

  const resetLoginState = () => {
    setIsSigningIn(false)
    setError(null)
  }

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true)
      setError(null)

      await signInWithGoogle().catch((err) => {
        // Immediately reset state for popup closure
        if (err.code === 'auth/popup-closed-by-user' || 
            err.code === 'auth/cancelled-popup-request') {
          resetLoginState()
          setError('Sign in was cancelled. Please try again')
          toast.error('Sign in was cancelled. Please try again')
          return Promise.reject(err)
        }
        return Promise.reject(err)
      });

    } catch (err: any) {
      console.error('Sign in error:', err)
      
      // Handle NextAuth.js errors
      setError('An error occurred during sign in. Please try again')
      toast.error('An error occurred during sign in. Please try again')
      resetLoginState()
    }
  }

  const features = [
    {
      icon: BookOpen,
      title: "Handwritten Notes",
      description: "Upload and organize your PDFs"
    },
    {
      icon: BookOpen,
      title: "Lecture Notes",
      description: "Organize lectures"
    },
    {
      icon: Sparkles,
      title: "Notebooks",
      description: "Upload and organize your notebooks"
    },
    {
      icon: Sparkles,
      title: "Assignments and Solutions",
      description: "Upload and get AI-generated solutions to your assignments"
    },
    {
      icon: Brain,
      title: "AI Assistant",
      description: "Get intelligent help with your studies"
    }
  ]

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-8">
      <div className="max-w-7xl w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Features */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center mb-8">
              
                <Image
                  src="/app_logo.png"
                  alt="10cg Logo"
                  width={56}
                  height={56}
                  className="w-14 h-14 drop-shadow-md"
                />
              
              <h1 className="text-4xl font-bold text-gray-800 ml-4">10cg</h1>
            </div>
            <p className="text-xl text-gray-600 mb-10">
              Your AI-powered study companion for academic success
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="flex items-start space-x-4 p-4 rounded-lg hover:bg-white/50 transition-colors"
                >
                  <feature.icon className="h-8 w-8 text-primary-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 text-base">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right side - Login Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg mx-auto">
              <div className="text-center mb-8">
                <div className="flex justify-center items-center mb-6">
                  <Image
                    src="/app_logo.png"
                    alt="10cg Logo"
                    width={48}
                    height={48}
                    className="w-12 h-12 drop-shadow-md"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Welcome Back!
                </h3>
                <p className="text-gray-600 text-base">
                  Sign in to continue your learning journey
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-600">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <button
                onClick={handleSignIn}
                disabled={loading || isSigningIn}
                className="w-full bg-white border-2 border-gray-200 rounded-xl px-8 py-4 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 text-lg"
              >
                {isSigningIn ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <>
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              <div className="mt-6 text-center text-sm text-gray-500">
                <p>By continuing, you agree to our</p>
                <div className="flex items-center justify-center space-x-3 mt-2">
                  <a href="#" className="text-primary-500 hover:underline">Terms</a>
                  <span>•</span>
                  <a href="#" className="text-primary-500 hover:underline">Privacy</a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}