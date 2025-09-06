import { Suspense } from 'react'
import PostCard from './PostCard'
import PostCardSkeleton from './PostCardSkeleton'
import { PostWithAuthor } from '@/types'

interface PostCardSuspenseProps {
  post: PostWithAuthor
}

export default function PostCardSuspense({ post }: PostCardSuspenseProps) {
  return (
    <Suspense fallback={<PostCardSkeleton />}>
      <PostCard post={post} />
    </Suspense>
  )
}
