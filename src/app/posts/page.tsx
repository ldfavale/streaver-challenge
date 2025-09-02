import PostCard from '@/components/molecules/PostCard'
import UserFilterDropdown from '@/components/molecules/UserFilterDropdown'
import { prisma } from '@/lib/prisma'

export const revalidate = 60

async function getPosts(userId?: string) {
  try {
    const whereClause = userId
      ? {
          authorId: parseInt(userId),
        }
      : {}

    const posts = await prisma.post.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: { name: true },
        },
      },
    })
    return posts
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch posts.')
  }
}

async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        name: 'asc',
      },
    })
    return users
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch users.')
  }
}

interface PostsPageProps {
  searchParams: {
    userId?: string
  }
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const [posts, users] = await Promise.all([
    getPosts(searchParams.userId),
    getUsers(),
  ])

  if (posts.length === 0) {
    return (
      <div className="space-y-6">
        <UserFilterDropdown
          users={users}
          selectedUserId={searchParams.userId}
        />
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {searchParams.userId
              ? 'No posts found for this author.'
              : 'No posts found.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <UserFilterDropdown users={users} selectedUserId={searchParams.userId} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
