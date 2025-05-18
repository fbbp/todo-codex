const { test, expect } = require('@playwright/test');

test('home page displays content', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toContainText('Home Page');
});
