import { test } from '../src/config/page.config';
import { users, loginExpected as expected } from '../src/config/page-loader';

test.describe('OrangeHRM - Authentication & Navigation', () => {

  test('TC01 - Login with valid credentials', async ({ loginPage, dashboardPage }) => {
    await loginPage.step_navigate();
    await loginPage.step_login(users.admin);

    await dashboardPage.verify_onDashboard();
    await dashboardPage.verify_pageTitle(expected.labels.pageTitle);
  });

  test('TC02 - Login with invalid username', async ({ loginPage }) => {
    await loginPage.step_navigate();

    await loginPage.step_login({
      username: 'InvalidUser',
      password: 'admin123'
    });

    await loginPage.verify_errorMessage(expected.errors.invalidCredentials);
  });
});