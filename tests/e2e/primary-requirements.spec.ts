import { test, expect } from '@playwright/test'

test.describe('Requisitos Primarios - Posts Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/posts')
  })

  test('should display posts list correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Streaver/)

    await expect(page.locator('[data-testid="posts-container"]')).toBeVisible()

    await page.waitForSelector('[data-testid="post-card"]', { timeout: 10000 })

    const posts = page.locator('[data-testid="post-card"]')
    const postCount = await posts.count()
    expect(postCount).toBeGreaterThan(0)

    for (let i = 0; i < Math.min(postCount, 3); i++) {
      const post = posts.nth(i)
      await expect(post.locator('h2')).toBeVisible() // título
      await expect(post.locator('[data-testid="post-author"]')).toBeVisible() // autor
      await expect(
        post.locator('[data-testid="delete-post-button"]')
      ).toBeVisible() // botón eliminar
    }
  })

  test('should delete post with confirmation modal', async ({ page }) => {
    await page.waitForSelector('[data-testid="post-card"]', { timeout: 10000 })

    const initialPosts = page.locator('[data-testid="post-card"]')
    const initialCount = await initialPosts.count()

    await page.locator('[data-testid="delete-post-button"]').first().click()

    await expect(
      page.locator('[data-testid="confirmation-modal"]')
    ).toBeVisible()

    await expect(
      page.locator('[data-testid="confirm-delete-button"]')
    ).toBeVisible()
    await expect(
      page.locator('[data-testid="cancel-delete-button"]')
    ).toBeVisible()

    await page.click('[data-testid="confirm-delete-button"]')

    await expect(
      page.locator('[data-testid="confirmation-modal"]')
    ).not.toBeVisible()

    await expect
      .poll(
        async () => {
          const finalPosts = page.locator('[data-testid="post-card"]')
          return finalPosts.count()
        },
        { timeout: 5000 }
      )
      .toBe(initialCount - 1)
  })

  test('should cancel post deletion', async ({ page }) => {
    await page.waitForSelector('[data-testid="post-card"]', { timeout: 10000 })

    const initialPosts = page.locator('[data-testid="post-card"]')
    const initialCount = await initialPosts.count()

    await page.locator('[data-testid="delete-post-button"]').first().click()

    await expect(
      page.locator('[data-testid="confirmation-modal"]')
    ).toBeVisible()

    await page.click('[data-testid="cancel-delete-button"]')

    await expect(
      page.locator('[data-testid="confirmation-modal"]')
    ).not.toBeVisible()

    const finalPosts = page.locator('[data-testid="post-card"]')
    const finalCount = await finalPosts.count()

    expect(finalCount).toBe(initialCount)
  })

  test('should filter posts by user and update URL', async ({ page }) => {
    await page.waitForSelector('[data-testid="post-card"]', { timeout: 10000 })

    const initialPosts = page.locator('[data-testid="post-card"]')
    const initialCount = await initialPosts.count()

    await page.click('[data-testid="user-filter-dropdown"]')

    await page.click('[data-testid="user-option-1"]')

    await expect(page).toHaveURL(/userId=1/)

    await expect(
      page.locator('[data-testid="post-skeleton"]').first()
    ).toBeVisible()

    await expect(
      page.locator('[data-testid="post-skeleton"]').first()
    ).not.toBeVisible({ timeout: 10000 })

    const filteredPosts = page.locator('[data-testid="post-card"]')
    const filteredCount = await filteredPosts.count()

    expect(filteredCount).toBeLessThanOrEqual(initialCount)
    expect(filteredCount).toBeGreaterThan(0)
  })

  test('should clear user filter correctly', async ({ page }) => {
    await page.waitForSelector('[data-testid="post-card"]')

    await page.click('[data-testid="user-filter-dropdown"]')
    await page.click('[data-testid="user-option-1"]')

    await expect(page).toHaveURL(/userId=1/)
    await expect(page.locator('[data-testid="clear-filter"]')).toBeVisible()
    await expect(
      page.locator('[data-testid="post-skeleton"]').first()
    ).not.toBeVisible({ timeout: 10000 })

    await page.click('[data-testid="clear-filter"]')

    await expect(page).not.toHaveURL(/userId/)
    await expect(page.locator('[data-testid="clear-filter"]')).not.toBeVisible()

    await expect
      .poll(
        async () => {
          const skeletonCount = await page
            .locator('[data-testid="post-skeleton"]')
            .count()
          const postCount = await page
            .locator('[data-testid="post-card"]')
            .count()

          return skeletonCount === 0 && postCount > 0
        },
        {
          message: 'Posts should load after clearing filter',
          timeout: 15000,
        }
      )
      .toBe(true)
  })

  test('should handle slow connections gracefully', async ({ page }) => {
    await page.route('**/api/posts*', (route) => {
      setTimeout(() => {
        route.continue()
      }, 5000)
    })

    await page.goto('/posts')

    await page.waitForTimeout(1000)

    await expect(
      page.locator('[data-testid="post-skeleton"]').first()
    ).toBeVisible({ timeout: 10000 })

    await page.waitForSelector('[data-testid="post-card"]', { timeout: 15000 })
    await expect(
      page.locator('[data-testid="post-skeleton"]').first()
    ).not.toBeVisible()

    const posts = page.locator('[data-testid="post-card"]')
    const postCount = await posts.count()
    expect(postCount).toBeGreaterThan(0)
  })

  test('should handle network errors gracefully', async ({ page }) => {
    await page.route('**/api/posts*', (route) => {
      route.abort('failed')
    })

    await page.goto('/posts')

    const postsContainer = page.locator('[data-testid="posts-container"]')
    await expect(postsContainer).toBeVisible()
    await expect(postsContainer.locator('text=/Error/i')).toBeVisible()
  })

  test('should handle API failures gracefully', async ({ page }) => {
    await page.route('**/api/posts*', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      })
    })

    await page.goto('/posts')

    const postsContainer = page.locator('[data-testid="posts-container"]')
    await expect(postsContainer).toBeVisible()
    await expect(postsContainer.locator('text=/Error/i')).toBeVisible()
  })
})
