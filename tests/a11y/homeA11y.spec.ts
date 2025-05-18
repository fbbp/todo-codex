const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright');

test('home page passes accessibility checks', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
