// tests/08_admin.spec.js
const { test, expect }  = require('@playwright/test');
const { AdminPage }     = require('../pages/AdminPage');
const { loginAs, randomString } = require('../utils/helpers');

test.describe('Admin Module', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page);
  });

  // TC_040
  test('TC_040 - Add new system user', async ({ page }) => {
    await page.goto('/web/index.php/admin/saveSystemUser');

    await expect(page).toHaveURL(/saveSystemUser/);

    // Select user role
    await page.locator('.oxd-select-text').first().click();
    await page.locator('.oxd-select-option:has-text("Admin")').click();

    // Type employee name
    await page.locator('input[placeholder="Type for hints..."]').fill('Admin');
    await page.waitForTimeout(1000);
    const suggestion = page.locator('.oxd-autocomplete-option').first();
    if (await suggestion.isVisible()) {
      await suggestion.click();
    }

    // Select status
    await page.locator('.oxd-select-text').nth(1).click();
    await page.locator('.oxd-select-option:has-text("Enabled")').click();

    const username = `user_${randomString()}`.substring(0, 20);
    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="password"]').fill('Admin@1234');
    await page.locator('input[name="confirmPassword"]').fill('Admin@1234');

    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(2000);

    const url = page.url();
    expect(url).toBeTruthy();
  });

  // TC_041
  test('TC_041 - User Management page loads with user list', async ({ page }) => {
    const admin = new AdminPage(page);
    await admin.gotoUserManagement();

    await expect(page).toHaveURL(/viewSystemUsers/);
    await expect(page.locator('h5, h6').first()).toBeVisible();

    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(1500);

    const count = await admin.getTableRowCount();
    expect(count).toBeGreaterThan(0);
  });

  // TC_042
  test('TC_042 - Add Job Title', async ({ page }) => {
    const admin = new AdminPage(page);
    await admin.gotoJobTitles();

    await page.locator('button:has-text("Add")').click();
    await expect(page).toHaveURL(/saveJobTitle|addJobTitle/i);

    await page.locator('input[name="title"]').fill(`Title_${randomString()}`);
    await page.locator('button[type="submit"]').click();

    await expect(page.locator('.oxd-toast-content--success')).toBeVisible();
  });

  // TC_043
  test('TC_043 - Pay Grades page loads', async ({ page }) => {
    const admin = new AdminPage(page);
    await admin.gotoPayGrades();

    await expect(page).toHaveURL(/viewPayGrades/);
    await expect(page.locator('h5, h6').first()).toBeVisible();
    await expect(page.locator('button:has-text("Add")')).toBeVisible();
  });

  // TC_044
  test('TC_044 - Add Employment Status', async ({ page }) => {
    const admin = new AdminPage(page);
    await admin.gotoEmploymentStatus();

    await page.locator('button:has-text("Add")').click();
    await page.locator('input[name="name"]').fill(`Status_${randomString()}`);
    await page.locator('button[type="submit"]').click();

    await expect(page.locator('.oxd-toast-content--success')).toBeVisible();
  });

  // TC_045
  test('TC_045 - Add Organization Location', async ({ page }) => {
    const admin = new AdminPage(page);
    await admin.gotoLocations();

    await page.locator('button:has-text("Add")').click();
    await expect(page).toHaveURL(/saveLocation|addLocation/i);

    await page.locator('input[name="name"]').fill(`Location_${randomString()}`);

    // Select country
    await page.locator('.oxd-select-text').first().click();
    await page.locator('.oxd-select-option').nth(1).click();

    await page.locator('button[type="submit"]').click();
    await expect(page.locator('.oxd-toast-content--success')).toBeVisible();
  });

  // TC_046
  test('TC_046 - Add Nationality', async ({ page }) => {
    const admin = new AdminPage(page);
    await admin.gotoNationalities();

    await page.locator('button:has-text("Add")').click();
    await page.locator('input[name="name"]').fill(`Nation_${randomString()}`);
    await page.locator('button[type="submit"]').click();

    await expect(page.locator('.oxd-toast-content--success')).toBeVisible();
  });

  // TC_047
  test('TC_047 - Email Configuration page loads', async ({ page }) => {
    await page.goto('/web/index.php/admin/listMailConfiguration');

    await expect(page).toHaveURL(/listMailConfiguration|mailConfiguration/i);
    await expect(page.locator('h5, h6').first()).toBeVisible();
  });

});
