export default function PaginationSkeleton() {
  return (
    <nav className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 animate-pulse">
      {/* Results info skeleton */}
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-48"></div>

      {/* Pagination controls skeleton */}
      <div className="flex items-center gap-1">
        {/* Previous button skeleton */}
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>

        {/* Page numbers skeleton */}
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded"
            ></div>
          ))}
        </div>

        {/* Next button skeleton */}
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
      </div>
    </nav>
  )
}
