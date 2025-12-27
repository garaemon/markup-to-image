import { test, expect } from '@playwright/test';

test.describe('Window Control', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should toggle window controls', async ({ page }) => {
    // Window controls should be hidden by default
    const preview = page.locator('.mockup-window');
    await expect(preview).toBeHidden();

    // Toggle Window Control
    const toggle = page.getByLabel('Window Control');
    await expect(toggle).toBeVisible();
    await toggle.click();

    // Window controls should be visible (mockup-window class applied)
    await expect(preview).toBeVisible();

    // Toggle off
    await toggle.click();
    await expect(preview).toBeHidden();
  });

  test('should persist window state in URL', async ({ page }) => {
    const toggle = page.getByLabel('Window Control');
    await toggle.click();

    // Wait for URL update
    await page.waitForTimeout(600);
    
    const url = page.url();
    expect(url).toContain('w=1');

    // Reload page
    await page.reload();

    // Check if toggle is still checked
    await expect(toggle).toBeChecked();
    
    // Check if window controls are visible
    const preview = page.locator('.mockup-window');
    await expect(preview).toBeVisible();
  });
});
