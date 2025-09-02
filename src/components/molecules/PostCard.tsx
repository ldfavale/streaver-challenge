import React from 'react'
import TrashIcon from '../atoms/icons/TrashIcon'

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
  return (
    <article className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-6 flex-grow">
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          {post.title}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">
          {post.body}
        </p>
      </div>
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex justify-between items-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Author: {post.author?.name ?? 'Unknown user'}
        </p>
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors duration-200 flex items-center"
          aria-label={`Delete post: ${post.title}`}
        >
          <TrashIcon className="w-4 h-4 mr-2" />
          Delete
        </button>
      </div>
    </article>
  )
}

export default PostCard
