'use client'

import { useEffect, useState } from 'react'
import ReloadIcon from '@/components/atoms/icons/ReloadIcon'
import WarningIcon from '@/components/atoms/icons/WarningIcon'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    console.error(error)
  }, [error])

  const handleReset = () => {
    setIsRetrying(true)
    reset()
  }

  return (
    <div className="flex flex-col items-center justify-center text-center py-10 bg-yellow-50 dark:bg-gray-900/50 border border-yellow-200 dark:border-yellow-800 rounded-lg shadow-sm mt-8">
      <div className="mb-4">
        <WarningIcon className="w-16 h-16 text-yellow-500" />
      </div>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        Oops, something went wrong
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        An unexpected error occurred while trying to load the posts. You can try
        again.
      </p>
      <button
        onClick={handleReset}
        disabled={isRetrying}
        className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600 flex items-center disabled:opacity-75 disabled:cursor-not-allowed"
      >
        <ReloadIcon
          className={`w-5 h-5 mr-2 ${isRetrying ? 'animate-spin' : ''}`}
          strokeWidth={2}
        />
        {isRetrying ? 'Retrying...' : 'Try again'}
      </button>
    </div>
  )
}
