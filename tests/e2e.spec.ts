import { test, expect } from '@playwright/test';

test.describe('Markup to Image App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the application', async ({ page }) => {
    await expect(page).toHaveTitle(/Markup to Image/);
    await expect(page.getByRole('heading', { name: 'Markup to Image' })).toBeVisible();
  });

  test('should render latex by default', async ({ page }) => {
    // Default is latex
    await expect(page.getByRole('tab', { name: 'LaTeX' })).toHaveAttribute('aria-selected', 'true');
    // Check for preview content
    const preview = page.locator('.katex');
    await expect(preview).toBeVisible();
  });

  test('should switch to LaTeX and render', async ({ page }) => {
    await page.getByRole('tab', { name: 'LaTeX' }).click();
    await expect(page.getByRole('tab', { name: 'LaTeX' })).toHaveAttribute('aria-selected', 'true');
    
    // Set valid LaTeX content
    const editor = page.getByPlaceholder('Enter your markup here...');
    await editor.fill('E = mc^2');

    // Check for KaTeX rendering
    await expect(page.locator('.katex')).toBeVisible();
  });

  test('should switch to Mermaid and render', async ({ page }) => {
    await page.getByRole('tab', { name: 'Mermaid' }).click();
    await expect(page.getByRole('tab', { name: 'Mermaid' })).toHaveAttribute('aria-selected', 'true');
    
    // Set valid Mermaid content
    const editor = page.getByPlaceholder('Enter your markup here...');
    await editor.fill('graph TD; A-->B;');

    // Check for Mermaid svg rendering
    // Mermaid rendering might be async, verify SVG presence
    // Scope to .fit-content to avoid potential global temporary elements from mermaid.js
    await expect(page.locator('.fit-content svg[id^="mermaid-"]').first()).toBeVisible();
  });

  test('should update preview when content changes', async ({ page }) => {
    // Select Markdown
    await page.getByRole('tab', { name: 'Markdown' }).click();
    
    const editor = page.getByPlaceholder('Enter your markup here...');
    await editor.fill('# New Content Test');
    
    // Wait for debounce
    await page.waitForTimeout(600);
    
    const preview = page.locator('.prose');
    await expect(preview).toContainText('New Content Test');
  });

  test('should update padding settings', async ({ page }) => {
    // Initial check - get the style or computed style of the container
    // The padding is applied to the inner div
    const contentContainer = page.locator('div.fit-content > div');
    await expect(contentContainer).toHaveCSS('padding', '32px');

    // Change padding using slider (simulating by clicking or simple logic if accessible)
    // Shadcn slider might be tricky to interact with standard inputs, 
    // but we can try to find the slider input or interact with the track.
    // Alternatively, just verify the element exists for now, 
    // interacting with sliders in playwright often implies keyboard arrows or specific click.
    const slider = page.getByRole('slider').first(); // Padding is likely the first slider
    await slider.focus();
    await page.keyboard.press('ArrowRight'); // Increment
    
    // Wait for update
    await page.waitForTimeout(100);
    
    // Check if padding changed (32 -> 36 because step is 4)
    await expect(contentContainer).toHaveCSS('padding', '36px');
  });

  test('should persist state in URL', async ({ page }) => {
    const editor = page.getByPlaceholder('Enter your markup here...');
    await editor.fill('State Persistence Test');
    
    // Wait for debounce and URL update
    await page.waitForTimeout(1000);
    
    const url = page.url();
    expect(url).toContain('c='); // Content param exists
    
    // Reload page
    await page.reload();
    
    await expect(editor).toHaveValue('State Persistence Test');
  });
});
