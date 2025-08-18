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
  const { signInWithGithub, loading, user } = useAuth()
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

      await signInWithGithub().catch((err) => {
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
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.866-.013-1.701-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.621.069-.609.069-.609 1.004.071 1.532 1.031 1.532 1.031.892 1.529 2.341 1.088 2.91.833.091-.646.35-1.089.636-1.339-2.22-.253-4.555-1.11-4.555-4.944 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.936.359.309.678.919.678 1.852 0 1.335-.012 2.415-.012 2.743 0 .268.18.58.688.482A10.005 10.005 0 0 0 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                    </svg>
                    <span>Continue with GitHub</span>
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