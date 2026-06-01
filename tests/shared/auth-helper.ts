import { expect, Page } from '@playwright/test';

export async function login(
  page: Page,
  email: string,
  password: string,
  expectedUrl: RegExp = /\/(manager|tenant)\/dashboard/
): Promise<void> {
  await page.goto('/auth/login', {
    waitUntil: 'domcontentloaded'
  });

  await page.getByLabel(/username or email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);

  await Promise.all([
    page.waitForURL(expectedUrl, {
      timeout: 15_000,
      waitUntil: 'domcontentloaded'
    }),
    page.getByRole('button', { name: /^login$/i }).click()
  ]);

  await expect(page).toHaveURL(expectedUrl);

  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);
}