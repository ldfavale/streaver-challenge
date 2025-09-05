'use client'

import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { useToast } from '@/providers/ToastProvider'
import { useEffect, useState } from 'react'
import WarningIcon from './icons/WarningIcon'

export const ConnectionStatus = () => {
  const isOnline = useOnlineStatus()
  const { showToast } = useToast()
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && !navigator.onLine) {
      setWasOffline(true)
    }
  }, [])

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true)
    } else if (wasOffline) {
      showToast('Connection restored', 'success')
      setWasOffline(false)
    }
  }, [isOnline, wasOffline, showToast])

  if (isOnline) {
    return null
  }

  return (
    <div
      className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse"
      data-testid="offline-indicator"
    >
      <WarningIcon className="w-4 h-4" />
      <span className="text-sm font-medium">No connection</span>
    </div>
  )
}
