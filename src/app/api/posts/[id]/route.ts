import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { z } from 'zod'

const routeParamsSchema = z.object({
  id: z.coerce.number().positive('Post ID must be a positive number'),
})

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Deletes a post by ID
 *     description: Permanently removes a post from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The post ID to delete
 *     responses:
 *       200:
 *         description: Post successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid post ID
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate the route parameters with Zod
    const { id } = routeParamsSchema.parse(params)

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id },
    })

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Delete the post
    await prisma.post.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: `Post ${id} deleted successfully` },
      { status: 200 }
    )
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid post ID format', details: error.issues },
        { status: 400 }
      )
    }

    // Handle Prisma specific errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      }
    }

    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'An error occurred while deleting the post' },
      { status: 500 }
    )
  }
}
