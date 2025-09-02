import React from 'react'

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Posts</h1>
      {children}
    </section>
  )
}
