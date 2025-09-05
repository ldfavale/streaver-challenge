import { GET, POST } from './route'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    post: {
      findMany: jest.fn(),
    },
  },
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>

describe('API /api/posts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('should return a list of posts and a 200 status', async () => {
      const mockPosts = [
        {
          id: 1,
          title: 'Post 1',
          content: '...',
          authorId: 1,
          author: { id: 1, name: 'User 1' },
        },
        {
          id: 2,
          title: 'Post 2',
          content: '...',
          authorId: 2,
          author: { id: 2, name: 'User 2' },
        },
      ]
      ;(mockPrisma.post.findMany as jest.Mock).mockResolvedValue(mockPosts)

      const request = new Request('http://localhost/api/posts')

      const response = await GET(request)
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body).toEqual(mockPosts)
      expect(mockPrisma.post.findMany).toHaveBeenCalledTimes(1)
      expect(mockPrisma.post.findMany).toHaveBeenCalledWith({
        where: {},
        include: { author: true },
        orderBy: { id: 'desc' },
      })
    })

    it('should return posts filtered by userId when provided', async () => {
      const mockPosts = [
        {
          id: 1,
          title: 'Post 1',
          content: '...',
          authorId: 1,
          author: { id: 1, name: 'User 1' },
        },
      ]
      ;(mockPrisma.post.findMany as jest.Mock).mockResolvedValue(mockPosts)

      const request = new Request('http://localhost/api/posts?userId=1')

      await GET(request)

      expect(mockPrisma.post.findMany).toHaveBeenCalledWith({
        where: { authorId: 1 },
        include: { author: true },
        orderBy: { id: 'desc' },
      })
    })

    it('should return a 500 error if the database fails', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      ;(mockPrisma.post.findMany as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      const request = new Request('http://localhost/api/posts')

      const response = await GET(request)
      const body = await response.json()

      expect(response.status).toBe(500)
      expect(body.error).toBe('An error occurred while fetching posts.')

      consoleErrorSpy.mockRestore()
    })
  })
})
