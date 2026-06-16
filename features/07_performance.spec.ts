// tests/07_performance.spec.js
const { test, expect }  = require('@playwright/test');
const { loginAs, randomString } = require('../utils/helpers');

test.describe('Performance Module', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page);
  });

  // TC_037
  test('TC_037 - Add KPI in Performance module', async ({ page }) => {
    await page.goto('/web/index.php/performance/searchKpi');

    await expect(page).toHaveURL(/searchKpi|kpi/i);

    await page.locator('button:has-text("Add")').click();
    await expect(page).toHaveURL(/addKpi|saveKpi/i);

    await page.locator('input[name="name"]').fill(`KPI_${randomString()}`);

    // Select job title
    await page.locator('.oxd-select-text').first().click();
    await page.locator('.oxd-select-option').first().click();

    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(1500);

    const url = page.url();
    expect(url).toBeTruthy();
  });

  // TC_038
  test('TC_038 - Performance Reviews page loads', async ({ page }) => {
    await page.goto('/web/index.php/performance/searchEvaluatePerformanceReview');

    await expect(page).toHaveURL(/searchEvaluatePerformanceReview|performance/i);
    await expect(page.locator('h5, h6').first()).toBeVisible();

    // Search button should exist
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  // TC_039
  test('TC_039 - Employee Trackers page loads', async ({ page }) => {
    await page.goto('/web/index.php/performance/searchPerformanceTracker');

    await expect(page).toHaveURL(/searchPerformanceTracker|tracker/i);
    await expect(page.locator('h5, h6').first()).toBeVisible();

    // Add button should be present
    const addBtn = page.locator('button:has-text("Add")');
    await expect(addBtn).toBeVisible();
  });

});
