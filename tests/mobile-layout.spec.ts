import { test, expect } from '@playwright/test';

test.describe('Mobile Layout', () => {
  test.use({
    viewport: { width: 375, height: 667 }, // iPhone SE dimensions
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
  });

  test('should show editor and allow switching to preview on mobile', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load (loader to disappear)
    await expect(page.locator('.animate-spin')).not.toBeVisible({ timeout: 10000 });

    const editorContainer = page.locator('main > div').first();
    const previewContainer = page.locator('main > div').nth(1);

    // Check if we can find the View Switcher tabs
    // I added data-testid="view-switcher" to the TabsList
    const viewSwitcher = page.getByTestId('view-switcher');
    await expect(viewSwitcher).toBeVisible();

    // Initial state: Editor visible, Preview hidden
    await expect(editorContainer).toBeVisible();
    await expect(previewContainer).not.toBeVisible();

    const previewTab = viewSwitcher.getByRole('tab', { name: 'Preview' });
    const editorTab = viewSwitcher.getByRole('tab', { name: 'Editor' });

    // Click Preview
    await previewTab.click();

    // Now Editor should be hidden and Preview visible
    await expect(editorContainer).not.toBeVisible();
    await expect(previewContainer).toBeVisible();

    // Click Editor
    await editorTab.click();
    await expect(editorContainer).toBeVisible();
    await expect(previewContainer).not.toBeVisible();
  });

  test('should show split view on desktop', async ({ page }) => {
    test.setTimeout(30000);
    page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    await expect(page.locator('.animate-spin')).not.toBeVisible({ timeout: 10000 });

    const editorContainer = page.locator('main > div').first();
    const previewContainer = page.locator('main > div').nth(1);

    // Both should be visible side-by-side
    await expect(editorContainer).toBeVisible();
    await expect(previewContainer).toBeVisible();

    // View Switcher should NOT be visible on desktop
    const viewSwitcher = page.getByTestId('view-switcher');
    await expect(viewSwitcher).not.toBeVisible();
  });
});
