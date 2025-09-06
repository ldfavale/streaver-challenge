import React, { Suspense } from 'react'
import PostCardSkeleton from './PostCardSkeleton'

interface PostsSkeletonWrapperProps {
  count?: number
}

const PostsSkeletonGrid: React.FC<PostsSkeletonWrapperProps> = ({
  count = 6,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  )
}

const PostsSkeletonWrapper: React.FC<PostsSkeletonWrapperProps> = ({
  count,
}) => {
  return (
    <Suspense fallback={<PostsSkeletonGrid count={count} />}>
      <PostsSkeletonGrid count={count} />
    </Suspense>
  )
}

export default PostsSkeletonWrapper
