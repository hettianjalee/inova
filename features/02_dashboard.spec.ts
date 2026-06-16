// tests/02_dashboard.spec.js
const { test, expect }   = require('@playwright/test');
const { DashboardPage }  = require('../pages/DashboardPage');
const { loginAs }        = require('../utils/helpers');

test.describe('Dashboard Module', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page);
  });

  // TC_009
  test('TC_009 - Dashboard widgets load after login', async ({ page }) => {
    const dashboard = new DashboardPage(page);

    await expect(page).toHaveURL(/dashboard/);

    // Quick Launch panel should be visible
    await expect(dashboard.quickLaunch).toBeVisible();

    // At least one widget should exist
    const widgetCount = await dashboard.getWidgetCount();
    expect(widgetCount).toBeGreaterThan(0);
  });

  // TC_010
  test('TC_010 - Quick Launch icons are displayed', async ({ page }) => {
    const dashboard = new DashboardPage(page);

    await expect(dashboard.quickLaunch).toBeVisible();

    const count = await dashboard.getQuickLaunchCount();
    expect(count).toBeGreaterThan(0);

    // Check specific quick launch items exist
    await expect(page.locator('.oxd-quick-launch')).toContainText('Assign Leave');
  });

});
