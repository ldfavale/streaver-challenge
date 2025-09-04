import { render, screen } from '@testing-library/react'
import { ConnectionStatus } from '../ConnectionStatus'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { useToast } from '@/providers/ToastProvider'

jest.mock('@/hooks/useOnlineStatus')
jest.mock('@/providers/ToastProvider')

const mockedUseOnlineStatus = useOnlineStatus as jest.Mock
const mockedUseToast = useToast as jest.Mock

describe('ConnectionStatus', () => {
  let showToastMock: jest.Mock

  beforeEach(() => {
    showToastMock = jest.fn()
    mockedUseToast.mockReturnValue({ showToast: showToastMock })
    jest.clearAllMocks()
  })

  it('should render nothing when online', () => {
    mockedUseOnlineStatus.mockReturnValue(true)

    render(<ConnectionStatus />)

    expect(screen.queryByText('No connection')).not.toBeInTheDocument()
  })

  it('should render connection status when offline', () => {
    mockedUseOnlineStatus.mockReturnValue(false)

    render(<ConnectionStatus />)

    expect(screen.getByText('No connection')).toBeVisible()
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('should show a toast notification when connection is restored', () => {
    mockedUseOnlineStatus.mockReturnValue(false)
    const { rerender } = render(<ConnectionStatus />)

    mockedUseOnlineStatus.mockReturnValue(true)
    rerender(<ConnectionStatus />)

    expect(showToastMock).toHaveBeenCalledTimes(1)
    expect(showToastMock).toHaveBeenCalledWith('Connection restored', 'success')
  })
})
