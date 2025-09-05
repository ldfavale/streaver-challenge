'use client'

import React, { useState } from 'react'
import TrashIcon from '../atoms/icons/TrashIcon'
import ConfirmationModal from './ConfirmationModal'
import { useOptimisticUpdate } from '@/hooks/useOptimisticUpdate'
import { useToast } from '@/providers/ToastProvider'

type PostWithAuthor = {
  id: number
  title: string
  body: string
  author: {
    name: string | null
  } | null
}

interface PostCardProps {
  post: PostWithAuthor
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isOptimisticallyDeleted, setIsOptimisticallyDeleted] = useState(false)
  const { showToast } = useToast()

  const { executeOptimisticUpdate, isOptimistic, isOffline } =
    useOptimisticUpdate({
      onSuccess: () => {
        showToast('Post deleted successfully', 'success')
      },
      onError: (error) => {
        console.error('Failed to delete post:', error)
        showToast('Failed to delete post. Please try again.', 'error')
      },
      onOffline: () => {
        showToast(
          'You are offline. Please check your connection and try again.',
          'error'
        )
      },
    })

  const handleDeleteClick = () => {
    if (isOffline) {
      showToast(
        'You are offline. Please check your connection and try again.',
        'error'
      )
      return
    }
    setIsModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    await executeOptimisticUpdate(
      () => setIsOptimisticallyDeleted(true),
      () =>
        fetch(`/api/posts/${post.id}`, { method: 'DELETE' }).then((res) => {
          if (!res.ok) throw new Error('Failed to delete post')
          return res.json()
        }),
      () => setIsOptimisticallyDeleted(false)
    )

    setIsModalOpen(false)
  }

  const handleCancelDelete = () => {
    setIsModalOpen(false)
  }

  if (isOptimisticallyDeleted) {
    return null
  }

  return (
    <>
      <article
        className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col"
        data-testid="post-card"
      >
        <div className="p-6 flex-grow">
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            {post.title}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">
            {post.body}
          </p>
        </div>
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex justify-between items-center">
          <p
            className="text-sm text-gray-600 dark:text-gray-400"
            data-testid="post-author"
          >
            Author: {post.author?.name ?? 'Unknown user'}
          </p>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleDeleteClick}
            disabled={isOptimistic}
            data-testid="delete-post-button"
          >
            <TrashIcon className="w-4 h-4 mr-2" />
            {isOptimistic ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </article>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Post"
        message={`Are you sure you want to delete "${post.title}"? This action cannot be undone.`}
        confirmText="Delete Post"
        cancelText="Cancel"
        type="danger"
      />
    </>
  )
}

export default PostCard
