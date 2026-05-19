import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://localhost:4200';

const MANAGER_EMAIL = 'manager1@bm.test';
const TENANT_EMAIL = 'tenant1@bm.test';
const PASSWORD = 'asd321';

test.describe('Building Management MVP Smoke Test', () => {
  test('manager building code can be used by tenant to join building', async ({ browser }) => {
    test.setTimeout(60_000);

    const managerContext = await browser.newContext();
    const tenantContext = await browser.newContext();

    const managerPage = await managerContext.newPage();
    const tenantPage = await tenantContext.newPage();

    await login(managerPage, MANAGER_EMAIL, PASSWORD);

    await managerPage.goto(`${BASE_URL}/manager/dashboard`);
    await expect(managerPage.getByText(/Code:/i)).toBeVisible();

    const buildingCode = await getBuildingCodeFromDashboard(managerPage);

    await login(tenantPage, TENANT_EMAIL, PASSWORD);

    await tenantPage.goto(`${BASE_URL}/tenant/join-building`);

    await tenantPage.getByLabel(/building code/i).fill(buildingCode);
    await tenantPage.getByRole('button', { name: /join building/i }).click();

    await expect(tenantPage).toHaveURL(/\/tenant/);

    await managerContext.close();
    await tenantContext.close();
  });
});

async function login(page: Page, email: string, password: string): Promise<void> {
  await page.goto(`${BASE_URL}/auth/login`);

  await page.getByLabel(/username or email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /^login$/i }).click();

  await expect(page).not.toHaveURL(/\/auth\/login/);
}

async function getBuildingCodeFromDashboard(page: Page): Promise<string> {
  const codeLine = await page
    .locator('p')
    .filter({ hasText: /Code:/i })
    .first()
    .innerText();

  const match = codeLine.match(/Code:\s*(BM-[A-Za-z0-9-]+)/i);

  if (!match?.[1]) {
    throw new Error(`Building code was not found. Text was: ${codeLine}`);
  }

  return match[1].trim();
}