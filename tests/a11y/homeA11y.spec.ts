import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('home page passes accessibility checks', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
