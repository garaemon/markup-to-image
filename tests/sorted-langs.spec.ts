import { test, expect } from '@playwright/test';

test.describe('Language Sorting', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Switch to Code tab
    await page.getByRole('tab', { name: 'Code' }).click();
  });

  test('should display languages in alphabetical order', async ({ page }) => {
    // Open language selector
    const langSelector = page.getByRole('combobox').filter({ hasText: 'typescript' });
    await langSelector.click();

    // Get all options
    const options = page.getByRole('option');
    const texts = await options.allInnerTexts();

    // Verify the texts are sorted
    const sortedTexts = [...texts].sort();
    expect(texts).toEqual(sortedTexts);
  });
});
