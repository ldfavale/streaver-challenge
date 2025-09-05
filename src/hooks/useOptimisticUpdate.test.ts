import { renderHook, act } from '@testing-library/react'
import { useOptimisticUpdate } from './useOptimisticUpdate'
import { useOnlineStatus } from './useOnlineStatus'
import { useRouter } from 'next/navigation'

jest.mock('./useOnlineStatus')
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

const mockedUseOnlineStatus = useOnlineStatus as jest.Mock
const mockedUseRouter = useRouter as jest.Mock

describe('useOptimisticUpdate', () => {
  let mockRouterRefresh: jest.Mock

  beforeEach(() => {
    mockRouterRefresh = jest.fn()
    mockedUseRouter.mockReturnValue({ refresh: mockRouterRefresh })
    mockedUseOnlineStatus.mockReturnValue(true)
    jest.clearAllMocks()
  })

  it('should handle a successful optimistic update', async () => {
    const optimisticAction = jest.fn()
    const apiCall = jest.fn().mockResolvedValue('Success')
    const rollbackAction = jest.fn()
    const onSuccess = jest.fn()
    const onError = jest.fn()

    const { result } = renderHook(() =>
      useOptimisticUpdate({ onSuccess, onError })
    )

    await act(async () => {
      await result.current.executeOptimisticUpdate(
        optimisticAction,
        apiCall,
        rollbackAction
      )
    })

    expect(optimisticAction).toHaveBeenCalledTimes(1)
    expect(apiCall).toHaveBeenCalledTimes(1)
    expect(result.current.isOptimistic).toBe(false)
    expect(onSuccess).toHaveBeenCalledWith('Success')
    expect(mockRouterRefresh).toHaveBeenCalledTimes(1)
    expect(rollbackAction).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
    expect(result.current.isError).toBe(false)
  })

  it('should handle a failed optimistic update and rollback', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    const optimisticAction = jest.fn()
    const apiError = new Error('API Failed')
    const apiCall = jest.fn().mockRejectedValue(apiError)
    const rollbackAction = jest.fn()
    const onSuccess = jest.fn()
    const onError = jest.fn()

    const { result } = renderHook(() =>
      useOptimisticUpdate({ onSuccess, onError })
    )

    await act(async () => {
      await result.current.executeOptimisticUpdate(
        optimisticAction,
        apiCall,
        rollbackAction
      )
    })

    expect(optimisticAction).toHaveBeenCalledTimes(1)
    expect(apiCall).toHaveBeenCalledTimes(1)
    expect(rollbackAction).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(apiError)
    expect(result.current.isError).toBe(true)
    expect(result.current.error).toBe(apiError)
    expect(result.current.isOptimistic).toBe(false)
    expect(onSuccess).not.toHaveBeenCalled()
    expect(mockRouterRefresh).not.toHaveBeenCalled()

    consoleErrorSpy.mockRestore()
  })

  it('should not perform update when offline', async () => {
    mockedUseOnlineStatus.mockReturnValue(false)

    const optimisticAction = jest.fn()
    const apiCall = jest.fn()
    const rollbackAction = jest.fn()
    const onOffline = jest.fn()

    const { result } = renderHook(() => useOptimisticUpdate({ onOffline }))

    await act(async () => {
      await result.current.executeOptimisticUpdate(
        optimisticAction,
        apiCall,
        rollbackAction
      )
    })

    expect(onOffline).toHaveBeenCalledTimes(1)
    expect(optimisticAction).not.toHaveBeenCalled()
    expect(apiCall).not.toHaveBeenCalled()
    expect(result.current.isOffline).toBe(true)
  })
})
