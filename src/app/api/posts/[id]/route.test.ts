/**
 * @jest-environment @edge-runtime/jest-environment
 */
import { DELETE } from './route'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    post: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>

describe('API /api/posts/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('DELETE', () => {
    it('should delete a post and return 200 if it exists', async () => {
      const postId = 1
      const mockPost = { id: postId, title: 'Test Post', body: '... ' }
      ;(mockPrisma.post.findUnique as jest.Mock).mockResolvedValue(mockPost)
      ;(mockPrisma.post.delete as jest.Mock).mockResolvedValue(mockPost)

      const request = new NextRequest(`http://localhost/api/posts/${postId}`)

      const response = await DELETE(request, { params: { id: String(postId) } })
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body.message).toBe(`Post ${postId} deleted successfully`)
      expect(mockPrisma.post.findUnique).toHaveBeenCalledWith({
        where: { id: postId },
      })
      expect(mockPrisma.post.delete).toHaveBeenCalledWith({
        where: { id: postId },
      })
    })

    it('should return 404 if the post to delete does not exist', async () => {
      const postId = 99
      ;(mockPrisma.post.findUnique as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest(`http://localhost/api/posts/${postId}`)

      const response = await DELETE(request, { params: { id: String(postId) } })
      const body = await response.json()

      expect(response.status).toBe(404)
      expect(body.error).toBe('Post not found')
      expect(mockPrisma.post.delete).not.toHaveBeenCalled()
    })

    it('should return 400 for an invalid post ID', async () => {
      const invalidId = 'abc'
      const request = new NextRequest(`http://localhost/api/posts/${invalidId}`)

      const response = await DELETE(request, { params: { id: invalidId } })
      const body = await response.json()

      expect(response.status).toBe(400)
      expect(body.error).toBe('Invalid post ID format')
      expect(mockPrisma.post.delete).not.toHaveBeenCalled()
    })

    it('should return 500 if the database fails on delete', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      const postId = 1
      const mockPost = { id: postId, title: 'Test Post', body: '... ' }
      ;(mockPrisma.post.findUnique as jest.Mock).mockResolvedValue(mockPost)
      ;(mockPrisma.post.delete as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      const request = new NextRequest(`http://localhost/api/posts/${postId}`)

      const response = await DELETE(request, { params: { id: String(postId) } })
      const body = await response.json()

      expect(response.status).toBe(500)
      expect(body.error).toBe('An error occurred while deleting the post')

      consoleErrorSpy.mockRestore()
    })
  })
})
