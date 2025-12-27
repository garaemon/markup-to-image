import { test, expect } from '@playwright/test';

test.describe('PDF functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have PDF button and be clickable', async ({ page }) => {
    // Ensure preview is visible
    await expect(page.locator('.fit-content')).toBeVisible();

    const pdfButton = page.getByRole('button', { name: 'PDF', exact: true });
    await expect(pdfButton).toBeVisible();
    await expect(pdfButton).toBeEnabled();

    // Clicking it shouldn't crash the app, but verifying print dialog is hard.
    // We just ensure it's clickable.
    await pdfButton.click();
    
    // Check if the app is still responsive/visible
    await expect(page.locator('.fit-content')).toBeVisible();
  });
});