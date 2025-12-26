import { test, expect } from '@playwright/test';

test.describe('Code Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Switch to Code tab
    await page.getByRole('tab', { name: 'Code' }).click();
  });

  test('should show language selector', async ({ page }) => {
    // There are two comboboxes: one for language, one for theme.
    // Language selector default value is 'typescript'
    const langSelector = page.getByRole('combobox').filter({ hasText: 'typescript' });
    await expect(langSelector).toBeVisible();
  });

  test('should switch language and persist', async ({ page }) => {
    // There are two comboboxes: one for language, one for theme.
    // Language selector default value is 'typescript'
    const langSelector = page.getByRole('combobox').filter({ hasText: 'typescript' });
    await langSelector.click();

    // Select Python
    await page.getByRole('option', { name: 'python' }).click();
    
    // Check if python is selected (now the combobox text is 'python')
    const langSelectorPython = page.getByRole('combobox').filter({ hasText: 'python' });
    await expect(langSelectorPython).toBeVisible();
    
    // Type some python code
    const editor = page.getByPlaceholder('Enter your markup here...');
    const code = 'def hello():\n    print("world")';
    await editor.fill(code);
    
    // Check preview
    const preview = page.locator('.shiki');
    await expect(preview).toBeVisible();
    
    // Check persistence
    await page.waitForTimeout(600); // Wait for debounce
    const url = page.url();
    expect(url).toContain('cl=python');
    
    await page.reload();
    await expect(page.getByRole('combobox').filter({ hasText: 'python' })).toBeVisible();
    await expect(editor).toHaveValue(code);
  });
});
