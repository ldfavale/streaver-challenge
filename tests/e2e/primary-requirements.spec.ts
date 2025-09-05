import { test, expect } from '@playwright/test'

/**
 * Tests E2E para los requisitos primarios de la aplicación
 * Siguiendo las mejores prácticas de testing estratégico
 */

test.describe('Requisitos Primarios - Posts Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/posts')
  })

  test('should display posts list correctly', async ({ page }) => {
    // Verificar que la página se carga correctamente
    await expect(page).toHaveTitle(/Streaver/)

    // Verificar que el contenedor de posts existe
    await expect(page.locator('[data-testid="posts-container"]')).toBeVisible()

    // Esperar a que se carguen los posts
    await page.waitForSelector('[data-testid="post-card"]', { timeout: 10000 })

    // Verificar que hay posts visibles
    const posts = page.locator('[data-testid="post-card"]')
    const postCount = await posts.count()
    expect(postCount).toBeGreaterThan(0)

    // Verificar estructura de los posts
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
    // Esperar a que se carguen los posts
    await page.waitForSelector('[data-testid="post-card"]', { timeout: 10000 })

    // Contar posts iniciales
    const initialPosts = page.locator('[data-testid="post-card"]')
    const initialCount = await initialPosts.count()

    // Hacer clic en el botón de eliminar del primer post
    await page.locator('[data-testid="delete-post-button"]').first().click()

    // Verificar que aparece el modal de confirmación
    await expect(
      page.locator('[data-testid="confirmation-modal"]')
    ).toBeVisible()

    // Verificar que el modal tiene los botones correctos
    await expect(
      page.locator('[data-testid="confirm-delete-button"]')
    ).toBeVisible()
    await expect(
      page.locator('[data-testid="cancel-delete-button"]')
    ).toBeVisible()

    // Confirmar la eliminación
    await page.click('[data-testid="confirm-delete-button"]')

    // Verificar que el modal se cierra
    await expect(
      page.locator('[data-testid="confirmation-modal"]')
    ).not.toBeVisible()

    // Verificar que el número de posts disminuyó. Usamos `expect.poll` para reintentar
    // hasta que la UI se actualice, eliminando la necesidad de un `waitForTimeout`.
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
    // Esperar a que se carguen los posts
    await page.waitForSelector('[data-testid="post-card"]', { timeout: 10000 })

    // Contar posts iniciales
    const initialPosts = page.locator('[data-testid="post-card"]')
    const initialCount = await initialPosts.count()

    // Hacer clic en el botón de eliminar del primer post
    await page.locator('[data-testid="delete-post-button"]').first().click()

    // Verificar que aparece el modal de confirmación
    await expect(
      page.locator('[data-testid="confirmation-modal"]')
    ).toBeVisible()

    // Cancelar la eliminación
    await page.click('[data-testid="cancel-delete-button"]')

    // Verificar que el modal se cierra
    await expect(
      page.locator('[data-testid="confirmation-modal"]')
    ).not.toBeVisible()

    // Verificar que el número de posts no cambió
    const finalPosts = page.locator('[data-testid="post-card"]')
    const finalCount = await finalPosts.count()

    expect(finalCount).toBe(initialCount)
  })

  test('should filter posts by user and update URL', async ({ page }) => {
    // Esperar a que se carguen los posts
    await page.waitForSelector('[data-testid="post-card"]', { timeout: 10000 })

    // Contar posts iniciales
    const initialPosts = page.locator('[data-testid="post-card"]')
    const initialCount = await initialPosts.count()

    // Abrir el dropdown de filtro
    await page.click('[data-testid="user-filter-dropdown"]')

    // Seleccionar un usuario específico
    await page.click('[data-testid="user-option-1"]')

    // Verificar que la URL cambió
    await expect(page).toHaveURL(/userId=1/)

    // Verificar que los skeletons aparecen mientras se recargan los posts
    await expect(
      page.locator('[data-testid="post-skeleton"]').first()
    ).toBeVisible()

    // Esperar a que los skeletons desaparezcan
    await expect(
      page.locator('[data-testid="post-skeleton"]').first()
    ).not.toBeVisible({ timeout: 10000 })

    // Verificar que se filtraron los posts y ahora sí contamos
    const filteredPosts = page.locator('[data-testid="post-card"]')
    const filteredCount = await filteredPosts.count()

    // Verificar que el número de posts cambió (filtrado)
    expect(filteredCount).toBeLessThanOrEqual(initialCount)
    expect(filteredCount).toBeGreaterThan(0)
  })

  test('should clear user filter correctly', async ({ page }) => {
    // Esperar a que se carguen los posts
    await page.waitForSelector('[data-testid="post-card"]', { timeout: 10000 })
    const initialPosts = page.locator('[data-testid="post-card"]')
    const initialCount = await initialPosts.count()

    // Aplicar un filtro para que aparezca el botón de limpiar
    await page.click('[data-testid="user-filter-dropdown"]')
    await page.click('[data-testid="user-option-1"]')

    // Esperar a que se aplique el filtro
    await expect(
      page.locator('[data-testid="post-skeleton"]').first()
    ).toBeVisible()
    await expect(
      page.locator('[data-testid="post-skeleton"]').first()
    ).not.toBeVisible({ timeout: 10000 })

    // Verificar que el botón para limpiar es visible
    const clearButton = page.locator('[aria-label="Clear filter"]')
    await expect(clearButton).toBeVisible()

    // Limpiar el filtro
    await clearButton.click()

    // Verificar que la URL ya no contiene el filtro
    await expect(page).not.toHaveURL(/userId/)

    // Esperar a que los skeletons desaparezcan
    await expect(
      page.locator('[data-testid="post-skeleton"]').first()
    ).not.toBeVisible({ timeout: 10000 })

    // Verificar que el número de posts vuelve a ser el inicial
    const finalPosts = page.locator('[data-testid="post-card"]')
    const finalCount = await finalPosts.count()
    expect(finalCount).toBe(initialCount)
  })

  test('should handle slow connections gracefully', async ({ page }) => {
    // Configurar conexión lenta ANTES de navegar
    await page.route('**/api/posts*', (route) => {
      setTimeout(() => {
        route.continue()
      }, 5000) // 5 segundos - más tiempo para capturar skeletons
    })

    // Navegar a la página (esto activará los skeletons)
    await page.goto('/posts')

    // Esperar un momento para que los skeletons aparezcan
    await page.waitForTimeout(1000)

    // Verificar que se muestran skeletons de carga durante la conexión lenta
    await expect(
      page.locator('[data-testid="post-skeleton"]').first()
    ).toBeVisible({ timeout: 10000 })

    // Verificar que los skeletons desaparecen cuando cargan los posts
    await page.waitForSelector('[data-testid="post-card"]', { timeout: 15000 })
    await expect(
      page.locator('[data-testid="post-skeleton"]').first()
    ).not.toBeVisible()

    // Verificar que los posts se cargaron correctamente
    const posts = page.locator('[data-testid="post-card"]')
    const postCount = await posts.count()
    expect(postCount).toBeGreaterThan(0)
  })

  test('should handle network errors gracefully', async ({ page }) => {
    // Simular error de red
    await page.route('**/api/posts*', (route) => {
      route.abort('failed')
    })

    // Navegar a la página
    await page.goto('/posts')

    // Verificar que se muestra un mensaje de error dentro del contenedor
    const postsContainer = page.locator('[data-testid="posts-container"]')
    await expect(postsContainer).toBeVisible()
    await expect(postsContainer.locator('text=/Error/i')).toBeVisible()
  })

  test('should handle API failures gracefully', async ({ page }) => {
    // Simular fallo de API
    await page.route('**/api/posts*', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      })
    })

    // Navegar a la página
    await page.goto('/posts')

    // Verificar que se muestra un mensaje de error dentro del contenedor
    const postsContainer = page.locator('[data-testid="posts-container"]')
    await expect(postsContainer).toBeVisible()
    await expect(postsContainer.locator('text=/Error/i')).toBeVisible()
  })
})
