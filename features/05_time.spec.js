// tests/05_time.spec.js
const { test, expect } = require('@playwright/test');
const { loginAs }      = require('../utils/helpers');

test.describe('Time Module', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page);
  });

  // TC_029
  test('TC_029 - My Timesheets page loads', async ({ page }) => {
    await page.goto('/web/index.php/time/viewMyTimeSheetList');

    await expect(page).toHaveURL(/timeSheet|timesheet/i);
    await expect(page.locator('h5, h6').first()).toBeVisible();
  });

  // TC_030
  test('TC_030 - Add Timesheet button is present', async ({ page }) => {
    await page.goto('/web/index.php/time/viewMyTimeSheetList');

    const addBtn = page.locator('button:has-text("Add Timesheet")');
    await expect(addBtn).toBeVisible();

    await addBtn.click();
    await page.waitForTimeout(1000);

    // Should show a timesheet form or date picker
    await expect(page.locator('.oxd-input, .oxd-select-text').first()).toBeVisible();
  });

  // TC_031
  test('TC_031 - Project Info page is accessible', async ({ page }) => {
    await page.goto('/web/index.php/time/projectInfo/project/list');

    await expect(page).toHaveURL(/projectInfo|project/i);
    await expect(page.locator('h5, h6').first()).toBeVisible();

    // Add button should be present
    const addBtn = page.locator('button:has-text("Add")');
    await expect(addBtn).toBeVisible();
  });

  // TC_032
  test('TC_032 - Attendance records page loads', async ({ page }) => {
    await page.goto('/web/index.php/attendance/viewMyAttendanceRecord');

    await expect(page).toHaveURL(/attendance/);
    await expect(page.locator('h5, h6').first()).toBeVisible();

    // Date filter or table should be visible
    await expect(page.locator('.oxd-table, .orangehrm-container').first()).toBeVisible();
  });

});
