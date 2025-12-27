import { test, expect } from '@playwright/test';
import fs from 'fs';

test.describe('Download Reliability', () => {
  const modes = [
    { name: 'LaTeX', tab: 'LaTeX', selector: '.fit-content .katex-display' },
    { name: 'Mermaid', tab: 'Mermaid', selector: '.fit-content svg' },
    { name: 'Code', tab: 'Code', selector: '.fit-content pre' },
    { name: 'Markdown', tab: 'Markdown', selector: '.fit-content .prose' },
  ];

  for (const mode of modes) {
    test(`should download a valid PNG for ${mode.name}`, async ({ page }) => {
      await page.goto('/');

      // Select the mode
      await page.getByRole('tab', { name: mode.tab }).click();

      // Wait for the specific content to be rendered
      await expect(page.locator(mode.selector).first()).toBeVisible();

      // Start waiting for download before clicking
      const downloadPromise = page.waitForEvent('download');
      await page.getByRole('button', { name: 'PNG', exact: true }).click();
      const download = await downloadPromise;

      // Verify download
      const path = await download.path();
      expect(path).not.toBeNull();

      const stats = fs.statSync(path!);
      // A typical minimal image with content should be at least a few KB.
      // 2000 bytes is a safe lower bound for these examples.
      console.log(`${mode.name} PNG size: ${stats.size} bytes`);
      expect(stats.size).toBeGreaterThan(2000);

      expect(download.suggestedFilename()).toMatch(/^markup-\d+\.png$/);
    });
  }

  test('should download a valid SVG for Mermaid', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: 'Mermaid' }).click();
    await expect(page.locator('.fit-content svg').first()).toBeVisible();

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'SVG', exact: true }).click();
    const download = await downloadPromise;

    const path = await download.path();
    const stats = fs.statSync(path!);
    console.log(`Mermaid SVG size: ${stats.size} bytes`);
    expect(stats.size).toBeGreaterThan(2000);
    expect(download.suggestedFilename()).toMatch(/^markup-\d+\.svg$/);
  });
});
