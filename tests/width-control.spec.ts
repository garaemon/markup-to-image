import { test, expect } from '@playwright/test';

test('width control updates url and style', async ({ page }) => {
  await page.goto('/');

  // Initial state check
  const preview = page.locator('.fit-content');
  await expect(preview).toBeVisible();

  // Width should be auto initially
  await expect(preview).toHaveAttribute('style', /width:\s*auto/);

  // Find width control
  const widthControlContainer = page.locator('.flex.items-center.justify-between').filter({ has: page.getByText('Width', { exact: true }) });
  const autoSwitch = widthControlContainer.getByRole('switch');

  await expect(autoSwitch).toBeVisible();
  await autoSwitch.click();

  // Now slider and input should appear
  const widthInput = page.locator('input[type="number"]');
  await expect(widthInput).toBeVisible();
  
  const initialValue = (await widthInput.inputValue()).trim();
  expect(parseInt(initialValue)).toBeGreaterThan(0);

  // Check preview style - immediate update expected
  // Using a more flexible regex or just checking the inclusion
  const style = await preview.getAttribute('style');
  expect(style).toContain(`width: ${initialValue}px`);

  // Change width value
  await widthInput.fill('500');

  // Check preview style updated (immediate)
  await expect(preview).toHaveAttribute('style', /width:\s*500px/);

  // Check URL updated - this is debounced by 500ms
  await expect(async () => {
    const url = page.url();
    expect(url).toContain('wd=500');
  }).toPass({ timeout: 2000 });

  // Reload page to check persistence
  await page.reload();
  await expect(page.locator('input[type="number"]')).toHaveValue('500');
  await expect(page.locator('.fit-content')).toHaveAttribute('style', /width:\s*500px/);

  // Toggle Auto back on
  const widthControlContainer2 = page.locator('.flex.items-center.justify-between').filter({ has: page.getByText('Width', { exact: true }) });
  const autoSwitch2 = widthControlContainer2.getByRole('switch');
  await autoSwitch2.click();

  await expect(page.locator('.fit-content')).toHaveAttribute('style', /width:\s*auto/);

  // Wait for URL update (debounced)
  await expect(async () => {
    const url2 = page.url();
    expect(url2).toContain('wd=auto');
  }).toPass({ timeout: 2000 });
});
