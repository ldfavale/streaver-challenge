import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Cleanup existing data
  await prisma.post.deleteMany({})
  await prisma.user.deleteMany({})

  console.log('Fetching users...')
  const usersResponse = await fetch(
    'https://jsonplaceholder.typicode.com/users'
  )
  const usersData = await usersResponse.json()

  console.log('Creating users...')
  for (const user of usersData) {
    await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  }

  console.log('Fetching posts...')
  const postsResponse = await fetch(
    'https://jsonplaceholder.typicode.com/posts'
  )
  const postsData = await postsResponse.json()

  console.log('Creating posts...')
  for (const post of postsData) {
    await prisma.post.create({
      data: {
        id: post.id,
        title: post.title,
        body: post.body,
        authorId: post.userId,
      },
    })
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
