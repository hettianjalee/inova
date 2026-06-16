// tests/01_login.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage }    = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');

test.describe('Login Module', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  // TC_001
  test('TC_001 - Valid login with correct credentials', async ({ page }) => {
    const loginPage    = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.login('Admin', 'admin123');

    await expect(page).toHaveURL(/dashboard/);
    const isLoaded = await dashboardPage.isLoaded();
    expect(isLoaded).toBeTruthy();
  });

  // TC_002
  test('TC_002 - Invalid password shows error message', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login('Admin', 'wrongpassword');

    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Invalid credentials');
  });

  // TC_003
  test('TC_003 - Empty username shows required error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await page.locator('input[name="password"]').fill('admin123');
    await loginPage.loginButton.click();

    const errors = await loginPage.getRequiredErrors();
    expect(errors.some(e => e.includes('Required'))).toBeTruthy();
  });

  // TC_004
  test('TC_004 - Empty password shows required error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await page.locator('input[name="username"]').fill('Admin');
    await loginPage.loginButton.click();

    const errors = await loginPage.getRequiredErrors();
    expect(errors.some(e => e.includes('Required'))).toBeTruthy();
  });

  // TC_005
  test('TC_005 - Both fields empty shows required errors', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.loginButton.click();

    const errors = await loginPage.getRequiredErrors();
    expect(errors.length).toBeGreaterThanOrEqual(2);
    errors.forEach(e => expect(e).toContain('Required'));
  });

  // TC_006
  test('TC_006 - Forgot password link navigates to reset page', async ({ page }) => {
    await page.locator('.orangehrm-login-forgot p').click();

    await expect(page).toHaveURL(/requestPasswordResetCode/);
    await expect(page.locator('h6')).toContainText('Reset Password');
  });

  // TC_007
  test('TC_007 - SQL injection in username does not bypass login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login("' OR 1=1--", 'anything');

    // Should NOT go to dashboard
    await expect(page).not.toHaveURL(/dashboard/);
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Invalid credentials');
  });

  // TC_008
  test('TC_008 - Logout redirects to login page', async ({ page }) => {
    const loginPage     = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.login('Admin', 'admin123');
    await page.waitForURL('**/dashboard/index');

    await dashboardPage.logout();

    await expect(page).toHaveURL(/login/);
    await expect(page.locator('input[name="username"]')).toBeVisible();
  });

});
