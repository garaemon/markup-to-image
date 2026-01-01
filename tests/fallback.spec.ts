
import { test, expect } from '@playwright/test';

test('renders plain text when invalid language is specified', async ({ page }) => {
  // Navigate with code language (cl) set to a non-existent language
  // and some specific text content
  const uniqueText = 'fallback_test_content_' + Date.now();
  // We use valid params that mimic the Emacs integration or manual URL construction
  await page.goto(`/?l=code&cl=non-existent-lang&txt=${uniqueText}`);

  // Wait for the preview to be ready (e.g., look for action buttons)
  await page.getByRole('button', { name: 'Copy PNG' }).waitFor();

  // The content should be visible in the page
  // We verify that the text content is present
  await expect(page.getByText(uniqueText)).toBeVisible();

  // Ensure no crash or error message is dominating (optional heuristic)
  // expect(page.getByText('Application Error')).not.toBeVisible();
});
