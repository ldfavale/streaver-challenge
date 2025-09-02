import React from 'react'

const PostCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse">
      <div className="p-6">
        {/* Title Skeleton */}
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        {/* Body Skeleton */}
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6 mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-4"></div>
      </div>
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex justify-between items-center">
        {/* Author Skeleton */}
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
        {/* Button Skeleton */}
        <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
      </div>
    </div>
  )
}

export default PostCardSkeleton
