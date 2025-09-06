import { Suspense } from 'react'
import { ConnectionStatus } from './ConnectionStatus'

const ConnectionStatusSkeleton = () => (
  <div className="fixed top-4 right-4 z-50 bg-gray-300 dark:bg-gray-700 px-4 py-2 rounded-lg shadow-lg animate-pulse">
    <div className="h-4 w-24 bg-gray-400 dark:bg-gray-600 rounded"></div>
  </div>
)

export default function ConnectionStatusSuspense() {
  return (
    <Suspense fallback={<ConnectionStatusSkeleton />}>
      <ConnectionStatus />
    </Suspense>
  )
}
