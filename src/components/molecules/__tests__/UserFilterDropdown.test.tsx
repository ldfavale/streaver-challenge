import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UserFilterDropdown from '../UserFilterDropdown'
import { useRouter, useSearchParams } from 'next/navigation'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}))

const mockedUseRouter = useRouter as jest.Mock
const mockedUseSearchParams = useSearchParams as jest.Mock

describe('UserFilterDropdown', () => {
  const mockUsers = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ]
  let mockRouterPush: jest.Mock

  beforeEach(() => {
    mockRouterPush = jest.fn()
    mockedUseRouter.mockReturnValue({ push: mockRouterPush })
    mockedUseSearchParams.mockReturnValue(new URLSearchParams())
    jest.clearAllMocks()
  })

  it('should open the dropdown and filter by a user', async () => {
    const user = userEvent.setup()
    render(<UserFilterDropdown users={mockUsers} />)

    const dropdownButton = screen.getByRole('button', {
      name: /select author to filter/i,
    })
    await user.click(dropdownButton)

    const userOption = await screen.findByRole('option', { name: /bob/i })
    await user.click(userOption)

    expect(mockRouterPush).toHaveBeenCalledTimes(1)
    expect(mockRouterPush).toHaveBeenCalledWith('/posts?userId=2')
  })

  it('should clear the filter when the clear button is clicked', async () => {
    const user = userEvent.setup()
    mockedUseSearchParams.mockReturnValue(new URLSearchParams('userId=1'))
    render(<UserFilterDropdown users={mockUsers} selectedUserId="1" />)

    expect(screen.getByText(/alice/i)).toBeInTheDocument()

    const clearButton = screen.getByRole('button', { name: /clear filter/i })
    await user.click(clearButton)

    expect(mockRouterPush).toHaveBeenCalledTimes(1)
    expect(mockRouterPush).toHaveBeenCalledWith('/posts?')
  })
})
