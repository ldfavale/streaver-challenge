import PostCardSkeleton from '@/components/molecules/PostCardSkeleton'

export default function Loading() {
  // Replicamos el grid layout de la página de posts.
  // Mostramos 6 esqueletos para dar la impresión de una carga inicial completa.
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  )
}
