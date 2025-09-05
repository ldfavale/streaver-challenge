import React from 'react'
import { ConnectionStatus } from '@/components/atoms/ConnectionStatus'

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="container mx-auto px-4 py-8">
      <ConnectionStatus />
      <h1 className="text-4xl font-bold mb-8 text-center">Posts</h1>
      {children}
    </section>
  )
}
