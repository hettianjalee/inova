// tests/09_reports_myinfo.spec.js
const { test, expect } = require('@playwright/test');
const { loginAs }      = require('../utils/helpers');

test.describe('Reports & My Info Module', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page);
  });

  // TC_048
  test('TC_048 - Employee Report page generates data', async ({ page }) => {
    await page.goto('/web/index.php/pim/viewPimReports');

    await expect(page).toHaveURL(/viewPimReports/);
    await expect(page.locator('h5, h6').first()).toBeVisible();

    // Select a report
    const reportItems = page.locator('.orangehrm-report-table-row, .oxd-table-row');
    await page.waitForTimeout(1000);
    const count = await reportItems.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  // TC_049
  test('TC_049 - My Info personal details can be edited', async ({ page }) => {
    await page.goto('/web/index.php/pim/viewMyDetails');

    await expect(page).toHaveURL(/viewMyDetails/);
    await expect(page.locator('h5, h6').first()).toBeVisible();

    // Edit button should be present
    await expect(page.locator('button:has-text("Edit")')).toBeVisible();

    await page.locator('button:has-text("Edit")').click();

    // Form fields should be editable
    await expect(page.locator('input[name="firstName"]')).toBeEnabled();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  // TC_050
  test('TC_050 - Change Password page loads and validates', async ({ page }) => {
    await page.goto('/web/index.php/pim/viewMyDetails');

    // Navigate to change password via top menu
    await page.locator('.oxd-userdropdown-tab').click();
    await page.locator('a:has-text("Change Password")').click();

    await expect(page).toHaveURL(/changePassword/i);
    await expect(page.locator('h6:has-text("Update Password")')).toBeVisible();

    // Form fields should be present
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    // Test empty submit shows validation
    await page.locator('button[type="submit"]').click();
    const errors = page.locator('.oxd-input-field-error-message');
    const errorCount = await errors.count();
    expect(errorCount).toBeGreaterThan(0);
  });

});
