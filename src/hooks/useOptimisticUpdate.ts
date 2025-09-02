import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface OptimisticUpdateOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  onSettled?: () => void
}

interface OptimisticUpdateState {
  isOptimistic: boolean
  isError: boolean
  error: Error | null
}

export function useOptimisticUpdate<T = unknown>(
  options: OptimisticUpdateOptions<T> = {}
) {
  const [state, setState] = useState<OptimisticUpdateState>({
    isOptimistic: false,
    isError: false,
    error: null,
  })
  const router = useRouter()

  const executeOptimisticUpdate = useCallback(
    async (
      optimisticAction: () => void,
      apiCall: () => Promise<T>,
      rollbackAction: () => void
    ) => {
      // Execute optimistic update immediately
      optimisticAction()
      setState((prev) => ({
        ...prev,
        isOptimistic: true,
        isError: false,
        error: null,
      }))

      try {
        const result = await apiCall()

        // Success: keep the optimistic update
        setState((prev) => ({ ...prev, isOptimistic: false }))
        options.onSuccess?.(result)

        // Refresh the page to get updated data
        router.refresh()
      } catch (error) {
        // Error: rollback the optimistic update
        rollbackAction()
        const errorObj =
          error instanceof Error ? error : new Error('Unknown error')

        setState((prev) => ({
          ...prev,
          isOptimistic: false,
          isError: true,
          error: errorObj,
        }))

        options.onError?.(errorObj)
        console.error('Optimistic update failed:', error)
      } finally {
        options.onSettled?.()
      }
    },
    [router, options]
  )

  return {
    executeOptimisticUpdate,
    isOptimistic: state.isOptimistic,
    isError: state.isError,
    error: state.error,
  }
}
