'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type User = {
  id: number
  name: string | null
}

interface UserFilterDropdownProps {
  users: User[]
  selectedUserId?: string | null
}

const UserFilterDropdown: React.FC<UserFilterDropdownProps> = ({
  users,
  selectedUserId,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  const selectedUser = users.find(
    (user) => user.id.toString() === selectedUserId
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setFocusedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault()
        setIsOpen(!isOpen)
        break
      case 'Escape':
        setIsOpen(false)
        setFocusedIndex(-1)
        break
      case 'ArrowDown':
        event.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setFocusedIndex(0)
        } else {
          setFocusedIndex((prev) => (prev < users.length - 1 ? prev + 1 : 0))
        }
        break
      case 'ArrowUp':
        event.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setFocusedIndex(users.length - 1)
        } else {
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : users.length - 1))
        }
        break
    }
  }

  const handleUserSelect = (userId: number | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (userId) {
      params.set('userId', userId.toString())
    } else {
      params.delete('userId')
    }

    // Reset to first page when filter changes
    params.delete('page')

    router.push(`/posts?${params.toString()}`)
    setIsOpen(false)
    setFocusedIndex(-1)
  }

  const handleClearFilter = () => {
    handleUserSelect(null)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-2">
        <label
          htmlFor="user-filter"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Filter by author:
        </label>

        <div className="relative">
          <button
            id="user-filter"
            type="button"
            className={`
              inline-flex items-center justify-between w-64 px-3 py-2 text-sm border rounded-md
              ${
                isOpen
                  ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50'
                  : 'border-gray-300 dark:border-gray-600'
              }
              bg-white dark:bg-gray-800 text-gray-900 dark:text-white
              hover:border-gray-400 dark:hover:border-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
              transition-colors duration-200
            `}
            onClick={() => setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            data-testid="user-filter-dropdown"
          >
            <span className="truncate">
              {selectedUser ? selectedUser.name : 'All authors'}
            </span>
            <svg
              className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
              <ul
                role="listbox"
                className="py-1 max-h-60 overflow-auto"
                aria-label="Authors list"
              >
                <li
                  role="option"
                  aria-selected={!selectedUserId}
                  className={`
                    px-3 py-2 text-sm cursor-pointer
                    ${focusedIndex === -1 ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                    ${!selectedUserId ? 'bg-blue-50 dark:bg-blue-800 text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'}
                  `}
                  onClick={() => handleUserSelect(null)}
                  onMouseEnter={() => setFocusedIndex(-1)}
                >
                  <div className="flex items-center justify-between">
                    <span>All authors</span>
                    {!selectedUserId && (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </li>

                {users.map((user, index) => (
                  <li
                    key={user.id}
                    role="option"
                    aria-selected={selectedUserId === user.id.toString()}
                    className={`
                      px-3 py-2 text-sm cursor-pointer
                      ${focusedIndex === index ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                      ${selectedUserId === user.id.toString() ? 'bg-blue-50 dark:bg-blue-800 text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'}
                    `}
                    onClick={() => handleUserSelect(user.id)}
                    data-testid={`user-option-${user.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{user.name || 'Unnamed user'}</span>
                      {selectedUserId === user.id.toString() && (
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {selectedUserId && (
          <button
            type="button"
            onClick={handleClearFilter}
            className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200"
            aria-label="Clear filter"
            data-testid="clear-filter"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}

export default UserFilterDropdown
