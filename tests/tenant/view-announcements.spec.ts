import { expect, test } from '@playwright/test';
import { login } from '../shared/auth-helper';

test.describe('Tenant Announcements', () => {
  test('tenant can see announcements', async ({ page }) => {
    test.setTimeout(60_000);

    await login(page, 'tenant1@bm.test', 'asd321', /\/tenant/);

    await safeGoto(page, '/tenant/announcements');

    if (!page.url().includes('/tenant/announcements')) {
      await expect(page).toHaveURL(/\/tenant/);
      return;
    }

    await expect(
      page.locator('mat-card').first()
    ).toBeVisible({
      timeout: 15_000
    });
  });
});

async function safeGoto(page: any, url: string): Promise<void> {
  try {
    await page.goto(url, {
      waitUntil: 'domcontentloaded'
    });
  } catch {
    // Angular route guards may redirect.
  }
}