'use client'

import { useState } from 'react'
import { useAuth } from '../providers/AuthProvider'
import { useContent } from '../providers/ContentProvider'
import { 
  BookOpen, 
  Brain, 
  FileText, 
  Calendar, 
  Settings, 
  LogOut, 
  User,
  GraduationCap,
  Target,
  Star,
  TrendingUp
} from 'lucide-react'
import { motion } from 'framer-motion'
import NotesManager from './NotesManager'
import LectureManager from './LectureManager'
import NotebookManager from './NotebookManager'
import AssignmentManager from './AssignmentManager'
import AiAssistant from './AiAssistant'

type ActiveSection = 'dashboard' | 'handwritten' | 'lecture' | 'notebooks' | 'assignments' | 'ai'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { counts } = useContent()
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard')

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: GraduationCap },
    { id: 'handwritten', label: 'Handwritten Notes', icon: FileText },
    { id: 'lecture', label: 'Lecture Notes', icon: BookOpen },
    { id: 'notebooks', label: 'Notebooks', icon: BookOpen },
    { id: 'assignments', label: 'Assignments', icon: Calendar },
    { id: 'ai', label: 'AI Assistant', icon: Brain },
  ]

  const statsCards = [
    { title: 'Handwritten Notes', value: counts.notes.toString(), icon: FileText, color: 'bg-blue-500' },
    { title: 'Lecture Notes', value: counts.lectures.toString(), icon: BookOpen, color: 'bg-green-500' },
    { title: 'Notebooks', value: counts.notebooks.toString(), icon: BookOpen, color: 'bg-purple-500' },
    { title: 'Assignments', value: counts.assignments.toString(), icon: Calendar, color: 'bg-yellow-500' },
  ]

  const studyFeatures = [
    {
      title: '📝 Handwritten Notes',
      description: 'Upload and organize your handwritten notes',
      action: () => setActiveSection('handwritten'),
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: '📚 Lecture Notes',
      description: 'Organize lectures and assignments',
      action: () => setActiveSection('lecture'),
      color: 'from-green-500 to-green-600'
    },
    {
      title: '📓 Notebooks',
      description: 'Create and manage your notebooks',
      action: () => setActiveSection('notebooks'),
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: '📋 Assignments',
      description: 'Track assignments and solutions',
      action: () => setActiveSection('assignments'),
      color: 'from-red-500 to-red-600'
    },
    {
      title: '🤖 AI Assistant',
      description: 'Get help with your studies',
      action: () => setActiveSection('ai'),
      color: 'from-indigo-500 to-indigo-600'
    }
  ]

  const renderContent = () => {
    switch (activeSection) {
      case 'handwritten':
        return <NotesManager />
      case 'lecture':
        return <LectureManager />
      case 'notebooks':
        return <NotebookManager />
      case 'assignments':
        return <AssignmentManager />
      case 'ai':
        return <AiAssistant />
      default:
        return (
          <div className="p-8">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome back, {user?.displayName?.split(' ')[0]}! 🎯
              </h1>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              {statsCards.map((stat, index) => (
                <div key={stat.title} className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Study Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Your Study Tool</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studyFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    onClick={feature.action}
                    className="bg-white rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 group"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <span className="text-2xl">{feature.title.split(' ')[0]}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {feature.title.substring(2)}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Motivational Quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white"
            >
              <p className="text-lg font-medium text-center italic">
                💡 "Education is the passport to the future, for tomorrow belongs to those who prepare for it today." - Malcolm X
              </p>
            </motion.div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          {/* User Profile */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              {/* <img
                src={user?.photoURL || '/default-avatar.png'}
                alt={user?.displayName || 'User'}
                className="w-10 h-10 rounded-full"
              /> */}
              <div>
                <h3 className="font-semibold text-gray-800">{user?.displayName}</h3>
                <p className="text-sm text-gray-600">Student</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as ActiveSection)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === item.id
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 mt-auto">
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}