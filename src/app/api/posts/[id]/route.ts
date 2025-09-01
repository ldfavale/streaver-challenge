import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { z } from 'zod'

// Esquema para validar que el `id` del parámetro de la ruta es un número
const routeParamsSchema = z.object({
  id: z.coerce.number(),
})

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
 *       400:
 *         description: Invalid post ID.
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Internal server error.
 */
export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // Valida los parámetros de la ruta
    const { id } = routeParamsSchema.parse(context.params)

    await prisma.post.delete({
      where: { id },
    })

    return NextResponse.json({ message: `Post ${id} deleted successfully` })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }

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
