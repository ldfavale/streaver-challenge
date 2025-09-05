import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConfirmationModal from '../ConfirmationModal'

describe('ConfirmationModal', () => {
  const onConfirmMock = jest.fn()
  const onCloseMock = jest.fn()

  const defaultProps = {
    isOpen: true,
    onClose: onCloseMock,
    onConfirm: onConfirmMock,
    title: 'Test Title',
    message: 'Test message for confirmation.',
    confirmText: 'Yes, Confirm',
    cancelText: 'No, Cancel',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should not render when isOpen is false', () => {
    render(<ConfirmationModal {...defaultProps} isOpen={false} />)
    expect(screen.queryByTestId('confirmation-modal')).not.toBeInTheDocument()
  })

  it('should render with correct title and message when isOpen is true', () => {
    render(<ConfirmationModal {...defaultProps} />)
    expect(screen.getByTestId('confirmation-modal')).toBeVisible()
    expect(screen.getByText('Test Title')).toBeVisible()
    expect(screen.getByText('Test message for confirmation.')).toBeVisible()
  })

  it('should call onConfirm when the confirm button is clicked', async () => {
    const user = userEvent.setup()
    render(<ConfirmationModal {...defaultProps} />)

    const confirmButton = screen.getByTestId('confirm-delete-button')
    await user.click(confirmButton)

    expect(onConfirmMock).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when the cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(<ConfirmationModal {...defaultProps} />)

    const cancelButton = screen.getByTestId('cancel-delete-button')
    await user.click(cancelButton)

    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when the Escape key is pressed', () => {
    render(<ConfirmationModal {...defaultProps} />)

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })

    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })

  it('should render custom button texts', () => {
    render(<ConfirmationModal {...defaultProps} />)
    expect(screen.getByText('Yes, Confirm')).toBeInTheDocument()
    expect(screen.getByText('No, Cancel')).toBeInTheDocument()
  })
})
