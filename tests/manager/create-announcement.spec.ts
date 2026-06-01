import { expect, test } from '@playwright/test';
import { login } from '../shared/auth-helper';

test.describe('Manager Announcements', () => {
    test('manager can create announcement', async ({ page }) => {
        test.setTimeout(60_000);

        await login(page, 'manager1@bm.test', 'asd321', /\/manager\/dashboard/);

        await page.goto('/manager/announcements', {
            waitUntil: 'domcontentloaded'
        });

        await page
            .getByRole('button', { name: /create announcement/i })
            .click();

        await expect(page).toHaveURL(/\/manager\/announcements\/create/);

        const titleInput = page.locator(
            'input[formControlName="title"], input[formcontrolname="title"], input[placeholder*="Title"], input'
        ).first();

        const descriptionInput = page.locator(
            'textarea[formControlName="description"], textarea[formcontrolname="description"], textarea[placeholder*="Description"], textarea'
        ).first();

        await expect(titleInput).toBeVisible({ timeout: 15_000 });
        await expect(descriptionInput).toBeVisible({ timeout: 15_000 });

        await titleInput.fill('Playwright Smoke Test');

        await descriptionInput.fill('Smoke test announcement');

        await page
            .getByRole('button', { name: /create announcement|publish announcement|save/i })
            .click();

       const headings = page.getByRole('heading', {name: /Playwright Smoke Test/i});

await expect(headings.first()).toBeVisible();
    });
});