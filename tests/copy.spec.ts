import { test, expect } from '@playwright/test';

test.describe('Copy PNG functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should copy PNG to clipboard', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-write', 'clipboard-read']);

    // Ensure preview is visible
    await expect(page.locator('.fit-content')).toBeVisible();

    // Click Copy PNG button
    await page.getByRole('button', { name: 'Copy PNG' }).click();

    // Check for success toast
    // The code uses sonner toast: toast.success("Copied to clipboard as PNG")
    await expect(page.getByText('Copied to clipboard as PNG')).toBeVisible();
  });
});
