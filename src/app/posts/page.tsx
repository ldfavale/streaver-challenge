'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import PostCard from '@/components/molecules/PostCard'
import UserFilterDropdown from '@/components/molecules/UserFilterDropdown'
import PostCardSkeleton from '@/components/molecules/PostCardSkeleton'
import { PostWithAuthor, User, PaginatedResponse } from '@/types'
import Pagination from '@/components/molecules/Pagination'

async function fetchUsers(): Promise<User[]> {
  // For simplicity in this example, we fetch all users every time.
  // In a real-world app, this could be cached.
  const res = await fetch('/api/users')
  if (!res.ok) {
    // We don't throw here, so the dropdown can still be rendered.
    console.error('Failed to fetch users')
    return []
  }
  return res.json()
}

async function fetchPosts(
  userId?: string | null,
  page = 1
): Promise<PaginatedResponse<PostWithAuthor>> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: '9',
  })
  if (userId) {
    params.set('userId', userId)
  }

  const res = await fetch(`/api/posts?${params.toString()}`)
  if (!res.ok) {
    throw new Error('Failed to fetch posts')
  }
  return res.json()
}

function PostsPageClient() {
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')
  const page = parseInt(searchParams.get('page') || '1', 10)

  const [postsData, setPostsData] =
    useState<PaginatedResponse<PostWithAuthor> | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch users first, so the filter is always available.
        const usersData = await fetchUsers()
        setUsers(usersData)

        // Then fetch posts.
        const postsResponse = await fetchPosts(userId, page)
        setPostsData(postsResponse)
      } catch (e) {
        const errorMessage =
          e instanceof Error ? e.message : 'An unknown error occurred'
        setError(errorMessage)
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [userId, page])

  const renderContent = () => {
    if (error) {
      return (
        <div className="text-center py-12 text-red-500">
          <p>Error: {error}</p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Please try again later.
          </p>
        </div>
      )
    }

    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      )
    }

    if (!postsData || postsData.data.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {userId ? 'No posts found for this author.' : 'No posts found.'}
          </p>
        </div>
      )
    }

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {postsData.data.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        <Pagination
          currentPage={postsData.pagination.page}
          totalPages={postsData.pagination.totalPages}
          hasNext={postsData.pagination.hasNext}
          hasPrev={postsData.pagination.hasPrev}
          total={postsData.pagination.total}
          limit={postsData.pagination.limit}
        />
      </>
    )
  }

  return (
    <div className="space-y-6" data-testid="posts-container">
      <UserFilterDropdown users={users} selectedUserId={userId || undefined} />
      {renderContent()}
    </div>
  )
}

export default function PostsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PostsPageClient />
    </Suspense>
  )
}

function Loading() {
  return (
    <div className="space-y-6">
      <UserFilterDropdown users={[]} selectedUserId={undefined} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
