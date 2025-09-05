import { Post, User as PrismaUser } from '@prisma/client'

// El tipo User que exponemos en la API y usamos en el frontend
// Omitimos el email para no exponerlo públicamente
export type User = Omit<PrismaUser, 'email'>

// El tipo Post que incluye la relación con su autor
export type PostWithAuthor = Post & { author: User }
