import { test, expect } from '@playwright/test';

test.describe('LaTeX Examples', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Make sure we are on LaTeX tab (it's default now, but good to ensure)
    await page.getByRole('tab', { name: 'LaTeX' }).click();
  });

  test('should render Pythagorean example', async ({ page }) => {
    await page.getByRole('button', { name: 'Pythagorean' }).click();
    await expect(page.locator('.katex')).toBeVisible();
    // c = \sqrt{a^2 + b^2}
    await expect(page.locator('.katex')).toContainText('c');
  });

  test('should render Maxwell example', async ({ page }) => {
    await page.getByRole('button', { name: 'Maxwell' }).click();
    
    // If it fails, it might show an error message or not render katex class
    // KaTeX error usually results in no .katex element or an error message if caught.
    // Our renderer catches error and shows red text.
    const error = page.locator('.text-red-500');
    if (await error.isVisible()) {
        const errorText = await error.textContent();
        console.log('Maxwell Error:', errorText);
        throw new Error(`Maxwell example failed to render: ${errorText}`);
    }
    
    await expect(page.locator('.katex')).toBeVisible();
  });

  test('should render Matrix example', async ({ page }) => {
    await page.getByRole('button', { name: 'Matrix' }).click();
    
    const error = page.locator('.text-red-500');
    if (await error.isVisible()) {
        const errorText = await error.textContent();
        console.log('Matrix Error:', errorText);
        throw new Error(`Matrix example failed to render: ${errorText}`);
    }

    await expect(page.locator('.katex')).toBeVisible();
  });
});
