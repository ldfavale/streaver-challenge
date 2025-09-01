import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Retrieves posts, optionally filtered by userId
 *     description: Returns a list of posts. If a `userId` is provided as a query parameter, it returns only posts from that user.
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: The ID of the user to filter posts by.
 *     responses:
 *       200:
 *         description: A list of posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PostWithAuthor'
 *       500:
 *         description: Internal server error.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  // Build a dynamic where clause
  const where: { authorId?: number } = {}
  if (userId) {
    const parsedUserId = parseInt(userId, 10)
    if (!isNaN(parsedUserId)) {
      where.authorId = parsedUserId
    }
  }

  try {
    const posts = await prisma.post.findMany({
      where,
      include: {
        author: true,
      },
      orderBy: {
        id: 'desc',
      },
    })
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching posts.' },
      { status: 500 }
    )
  }
}
