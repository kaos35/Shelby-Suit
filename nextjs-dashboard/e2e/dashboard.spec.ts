import { test, expect } from '@playwright/test';

test('dashboard loads accurately', async ({ page }) => {
    await page.goto('/');

    // Check if main heading is present
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    // Check if overview text is present
    await expect(page.getByText('Overview of your Shelby Ecosystem node.')).toBeVisible();

    // Check if stats are rendered
    await expect(page.locator('text=Total Uploads')).toBeVisible();
    await expect(page.locator('text=Active Blobs')).toBeVisible();

    // Check if system health is rendered
    await expect(page.getByText('System Health')).toBeVisible();
});

test('navigation works', async ({ page }) => {
    await page.goto('/');

    // Click on Accounts in sidebar (assuming there's a sidebar with links)
    // Let's verify sidebar structure if possible, but for now we'll assume standard layout
    await page.click('text=Accounts');
    await expect(page).toHaveURL(/.*accounts/);
    await expect(page.getByRole('heading', { name: 'Accounts' })).toBeVisible();

    // Go back to dashboard
    await page.click('text=Dashboard');
    await expect(page).toHaveURL(/\//);
});
