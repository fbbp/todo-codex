import { test, expect } from '@playwright/test';

test('home page displays content', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toContainText('今後のタスクはありません');
});
