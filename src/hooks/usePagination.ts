'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export function usePagination() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const goToPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', page.toString())
      router.push(`/posts?${params.toString()}`)
    },
    [router, searchParams]
  )

  const goToNextPage = useCallback(
    (currentPage: number) => {
      goToPage(currentPage + 1)
    },
    [goToPage]
  )

  const goToPrevPage = useCallback(
    (currentPage: number) => {
      goToPage(currentPage - 1)
    },
    [goToPage]
  )

  const resetToFirstPage = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('page')
    router.push(`/posts?${params.toString()}`)
  }, [router, searchParams])

  return {
    goToPage,
    goToNextPage,
    goToPrevPage,
    resetToFirstPage,
  }
}
