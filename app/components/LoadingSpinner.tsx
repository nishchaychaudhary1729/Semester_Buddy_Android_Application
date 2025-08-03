import { Loader2 } from 'lucide-react'

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-primary-500 mx-auto" />
          <div className="absolute inset-0 h-12 w-12 rounded-full border-2 border-primary-200 mx-auto"></div>
        </div>
        <h2 className="mt-4 text-lg font-semibold text-gray-700">Loading 10cg</h2>
        <p className="mt-2 text-sm text-gray-500">Preparing your study environment...</p>
      </div>
    </div>
  )
}