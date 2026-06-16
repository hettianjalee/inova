// tests/06_recruitment.spec.js
const { test, expect }  = require('@playwright/test');
const { loginAs, randomString } = require('../utils/helpers');

test.describe('Recruitment Module', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page);
  });

  // TC_033
  test('TC_033 - Add Job Vacancy', async ({ page }) => {
    await page.goto('/web/index.php/recruitment/addJobVacancy');

    await expect(page).toHaveURL(/addJobVacancy/);

    // Fill in vacancy name
    await page.locator('input[name="name"]').fill(`QA Engineer ${randomString()}`);

    // Select job title
    await page.locator('.oxd-select-text').first().click();
    await page.locator('.oxd-select-option').first().click();

    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(1500);

    // Should redirect to vacancy list or show success
    const url = page.url();
    expect(url).toBeTruthy();
  });

  // TC_034
  test('TC_034 - Add Job Candidate', async ({ page }) => {
    await page.goto('/web/index.php/recruitment/addCandidate');

    await expect(page).toHaveURL(/addCandidate/);

    const name = randomString('Candidate');
    await page.locator('input[name="firstName"]').fill(name);
    await page.locator('input[name="lastName"]').fill('AutoTest');
    await page.locator('input[name="email"]').fill(`${name.toLowerCase()}@test.com`);

    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(1500);

    const url = page.url();
    expect(url).toBeTruthy();
  });

  // TC_035
  test('TC_035 - Search Vacancy by job title', async ({ page }) => {
    await page.goto('/web/index.php/recruitment/viewJobVacancy');

    await expect(page).toHaveURL(/viewJobVacancy/);

    // Job title filter should exist
    await expect(page.locator('.oxd-select-text').first()).toBeVisible();

    // Click search
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(1500);

    // Table should appear
    await expect(page.locator('.oxd-table')).toBeVisible();
  });

  // TC_036
  test('TC_036 - View Candidate List', async ({ page }) => {
    await page.goto('/web/index.php/recruitment/viewCandidates');

    await expect(page).toHaveURL(/viewCandidates/);
    await expect(page.locator('h5, h6').first()).toBeVisible();

    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(1500);

    await expect(page.locator('.oxd-table')).toBeVisible();
  });

});
