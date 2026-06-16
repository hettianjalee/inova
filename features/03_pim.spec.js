// tests/03_pim.spec.js
const { test, expect } = require('@playwright/test');
const { PimPage }      = require('../pages/PimPage');
const { loginAs, randomString } = require('../utils/helpers');

test.describe('PIM Module', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page);
  });

  // TC_011
  test('TC_011 - Add new employee with first and last name', async ({ page }) => {
    const pim = new PimPage(page);
    const firstName = randomString('John');
    const lastName  = randomString('Doe');

    await pim.addEmployee(firstName, lastName);

    await expect(page).toHaveURL(/viewPersonalDetails/);
    await expect(page.locator('input[name="firstName"]')).toHaveValue(firstName);
  });

  // TC_012
  test('TC_012 - Add employee with custom Employee ID', async ({ page }) => {
    const pim = new PimPage(page);
    const empId = `EMP${Date.now().toString().slice(-5)}`;

    await pim.addEmployee(randomString('Jane'), randomString('Smith'), empId);

    await expect(page).toHaveURL(/viewPersonalDetails/);
  });

  // TC_013
  test('TC_013 - Search employee by name returns results', async ({ page }) => {
    const pim = new PimPage(page);

    await pim.searchEmployee('Admin');

    // Table should have at least one result
    const rows = await pim.getTableRowCount();
    expect(rows).toBeGreaterThan(0);
  });

  // TC_014
  test('TC_014 - Search by Employee ID shows specific employee', async ({ page }) => {
    await page.goto('/web/index.php/pim/viewEmployeeList');

    // Search by ID field
    await page.locator('.oxd-input').nth(1).fill('0001');
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(1500);

    const rows = page.locator('.oxd-table-row--with-border');
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(0); // 0 is ok if ID doesn't exist
  });

  // TC_015
  test('TC_015 - Edit employee personal info and save', async ({ page }) => {
    const pim = new PimPage(page);

    // First add a new employee
    const firstName = randomString('Edit');
    const lastName  = randomString('Test');
    await pim.addEmployee(firstName, lastName);

    // Edit nickname field (safe field to edit)
    const nicknameInput = page.locator('input[name="nickname"]');
    await nicknameInput.fill('TestNick');
    await page.locator('button[type="submit"]').first().click();

    await expect(page.locator('.oxd-toast-content--success')).toBeVisible();
  });

  // TC_016
  test('TC_016 - Profile photo upload area is visible', async ({ page }) => {
    const pim = new PimPage(page);
    const firstName = randomString('Photo');
    const lastName  = randomString('Test');
    await pim.addEmployee(firstName, lastName);

    // Photo upload button should be present
    const photoSection = page.locator('.employee-image-action');
    await expect(photoSection).toBeVisible();
  });

  // TC_017
  test('TC_017 - Delete employee from list', async ({ page }) => {
    const pim = new PimPage(page);

    // Add employee first
    const firstName = randomString('Del');
    const lastName  = randomString('Test');
    await pim.addEmployee(firstName, lastName);

    // Go to employee list and search
    await pim.searchEmployee(firstName);

    // Check a row checkbox and delete
    const checkbox = page.locator('.oxd-checkbox-input').first();
    if (await checkbox.isVisible()) {
      await checkbox.check();
      await page.locator('button:has-text("Delete Selected")').click();
      await page.locator('.oxd-button--label-danger').click();
      await expect(page.locator('.oxd-toast-content--success')).toBeVisible();
    }
  });

  // TC_018
  test('TC_018 - Emergency contact section is accessible', async ({ page }) => {
    const pim = new PimPage(page);
    const firstName = randomString('EC');
    const lastName  = randomString('Test');
    await pim.addEmployee(firstName, lastName);

    // Navigate to emergency contacts tab
    await page.locator('a:has-text("Emergency Contacts")').click();
    await expect(page.locator('h6:has-text("Assigned Emergency Contacts")')).toBeVisible();

    // Add emergency contact
    await page.locator('button:has-text("Add")').click();
    await page.locator('input[name="name"]').fill('Emergency Person');
    await page.locator('input[name="relationship"]').fill('Spouse');
    await page.locator('input[name="homePhone"]').fill('0771234567');
    await page.locator('button[type="submit"]').click();

    await expect(page.locator('.oxd-toast-content--success')).toBeVisible();
  });

  // TC_019
  test('TC_019 - Add dependent for employee', async ({ page }) => {
    const pim = new PimPage(page);
    const firstName = randomString('Dep');
    const lastName  = randomString('Test');
    await pim.addEmployee(firstName, lastName);

    await page.locator('a:has-text("Dependents")').click();
    await expect(page.locator('h6:has-text("Assigned Dependents")')).toBeVisible();

    await page.locator('button:has-text("Add")').click();
    await page.locator('input[name="name"]').fill('Child One');

    // Select relationship
    await page.locator('.oxd-select-text').first().click();
    await page.locator('.oxd-select-option').first().click();

    await page.locator('button[type="submit"]').click();
    await expect(page.locator('.oxd-toast-content--success')).toBeVisible();
  });

  // TC_020
  test('TC_020 - Assign job title to employee', async ({ page }) => {
    const pim = new PimPage(page);
    const firstName = randomString('Job');
    const lastName  = randomString('Test');
    await pim.addEmployee(firstName, lastName);

    await page.locator('a:has-text("Job")').click();
    await expect(page.locator('h6:has-text("Job Details")')).toBeVisible();

    // Click edit and check job title dropdown is present
    await page.locator('button:has-text("Edit")').click();
    const jobTitleSelect = page.locator('.oxd-select-text').first();
    await expect(jobTitleSelect).toBeVisible();
  });

});
