import PostCard from '@/components/molecules/PostCard'
import { prisma } from '@/lib/prisma'

export const revalidate = 60

async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
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
    return []
  }
}

export default async function PostsPage() {
  const posts = await getPosts()

  if (posts.length === 0) {
    return <p className="text-center">No se encontraron publicaciones.</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
