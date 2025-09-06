import { Suspense } from 'react'
import UserFilterDropdown from './UserFilterDropdown'
import { User } from '@/types'

interface UserFilterSuspenseProps {
  users: User[]
  selectedUserId?: string | null
}

const UserFilterSkeleton = () => (
  <div className="flex items-center gap-2">
    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-64"></div>
  </div>
)

export default function UserFilterSuspense({
  users,
  selectedUserId,
}: UserFilterSuspenseProps) {
  return (
    <Suspense fallback={<UserFilterSkeleton />}>
      <UserFilterDropdown users={users} selectedUserId={selectedUserId} />
    </Suspense>
  )
}
