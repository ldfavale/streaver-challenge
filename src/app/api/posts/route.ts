import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Esquema de validación para los parámetros de la query
const getPostsQuerySchema = z.object({
  userId: z.coerce.number().optional(),
})

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
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Internal server error.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const queryParams = Object.fromEntries(searchParams.entries())

  const validation = getPostsQuerySchema.safeParse(queryParams)

  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.issues },
      { status: 400 }
    )
  }

  const { userId } = validation.data

  const where: { authorId?: number } = {}
  if (userId !== undefined) {
    where.authorId = userId
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
