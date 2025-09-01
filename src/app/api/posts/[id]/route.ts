import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

interface DeleteParams {
  params: { id: string }
}

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Deletes a specific post by its ID
 *     description: Deletes a post from the database using its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier of the post to be deleted.
 *     responses:
 *       200:
 *         description: Post deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post 1 deleted successfully
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Internal server error.
 */
export async function DELETE(request: Request, { params }: DeleteParams) {
  const postId = parseInt(params.id, 10)

  if (isNaN(postId)) {
    return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 })
  }

  try {
    await prisma.post.delete({
      where: { id: postId },
    })

    return NextResponse.json({ message: `Post ${postId} deleted successfully` })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      }
    }
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'An error occurred while deleting the post.' },
      { status: 500 }
    )
  }
}
