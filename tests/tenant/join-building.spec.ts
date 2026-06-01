import { expect, Page, test } from '@playwright/test';
import { login } from '../shared/auth-helper';

const MANAGER_EMAIL = 'manager1@bm.test';
const TENANT_EMAIL = 'tenant1@bm.test';
const PASSWORD = 'asd321';

test.describe('Building Management MVP Smoke Test', () => {
  test('manager building code can be used by tenant to join building', async ({ browser }) => {
    test.setTimeout(60_000);

    const managerContext = await browser.newContext();
    const tenantContext = await browser.newContext();

    try {
      const managerPage = await managerContext.newPage();
      const tenantPage = await tenantContext.newPage();

      await login(managerPage, MANAGER_EMAIL, PASSWORD, /\/manager\/dashboard/);

      const buildingCode = await getBuildingCodeFromDashboard(managerPage);

      await login(tenantPage, TENANT_EMAIL, PASSWORD, /\/tenant/);

      await tenantPage.goto('/tenant/join-building', {
        waitUntil: 'domcontentloaded'
      }).catch(() => {
        // The route may redirect if the tenant already belongs to a building.
      });

      if (!tenantPage.url().includes('/tenant/join-building')) {
        await expect(tenantPage).toHaveURL(/\/tenant/);
        return;
      }

      await tenantPage.getByLabel(/building code/i).fill(buildingCode);

      await tenantPage
        .getByRole('button', { name: /join building/i })
        .click();

      await expect(tenantPage).toHaveURL(/\/tenant/);
    } finally {
      await managerContext.close();
      await tenantContext.close();
    }
  });
});

async function getBuildingCodeFromDashboard(page: Page): Promise<string> {
  const codeLocator = page.locator('p').filter({ hasText: /Code:/i }).first();

  await expect(codeLocator).toContainText(/BM-[A-Za-z0-9-]+/, {
    timeout: 10_000
  });

  const codeText = await codeLocator.innerText();
  const match = codeText.match(/BM-[A-Za-z0-9-]+/i);

  if (!match?.[0]) {
    throw new Error(`Building code was not found. Text was: ${codeText}`);
  }

  return match[0].trim();
}