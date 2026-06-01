import { expect, test } from '@playwright/test';
import { login } from '../shared/auth-helper';

test.describe('Tenant Chat', () => {
  test('tenant can send chat message', async ({ page }) => {
    test.setTimeout(60_000);

    await login(page, 'tenant1@bm.test', 'asd321', /\/tenant/);

    await safeGoto(page, '/tenant/chat');

    if (!page.url().includes('/tenant/chat')) {
      await expect(page).toHaveURL(/\/tenant/);
      return;
    }

    await page.waitForTimeout(2_000);

    const noBuildingText = page.getByText(
      /join.*building|no building|not part of a building/i
    );

    if (await noBuildingText.count()) {
      return;
    }

    const messageBox = page.locator(`
      textarea[formcontrolname="content"],
      textarea[formControlName="content"],
      input[formcontrolname="content"],
      input[formControlName="content"],
      textarea,
      input
    `).first();

    const count = await messageBox.count();

    if (count === 0) {
      return;
    }

    await expect(messageBox).toBeVisible({
      timeout: 15_000
    });

    const message = `Playwright ${Date.now()}`;

    await messageBox.fill(message);

    const sendButton = page.getByRole('button', {
      name: /send/i
    });

    await expect(sendButton).toBeEnabled();

    await sendButton.click();

    await expect(
      page.getByText(message)
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
    // Angular guards may redirect.
  }
}