import { expect, test } from '@playwright/test';
import { login } from '../shared/auth-helper';

test.describe('Authentication', () => {

  test('manager can login successfully', async ({ page }) => {

    await login(page, 'manager1@bm.test', 'asd321');

    await expect(page).toHaveURL(/manager/);
  });

  test('tenant can login successfully', async ({ page }) => {

    await login(page, 'tenant1@bm.test', 'asd321');

    await expect(page).toHaveURL(/tenant/);
  });
});