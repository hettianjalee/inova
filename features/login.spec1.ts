import { test } from '../src/config/page.config';
import { users } from '../src/config/page-loader';

test.describe('OrangeHRM - End-to-End Test Suite', () => {

  test('TC01 - should login successfully with valid credentials', async ({ loginPage, dashboardPage }) => {
    await loginPage.step_navigate();
    await loginPage.step_login(users.admin);

    await dashboardPage.verify_onDashboard();
  });

  test('TC02 - should reject login with invalid username', async ({ loginPage }) => {
    await loginPage.step_navigate();

    await loginPage.step_login({
      username: 'WrongUser',
      password: 'admin123'
    });

    await loginPage.verify_errorMessage('Invalid credentials');
  });

  test('TC03 - should reject login with invalid password', async ({ loginPage }) => {
    await loginPage.step_navigate();

    await loginPage.step_login({
      username: 'Admin',
      password: 'WrongPassword'
    });

    await loginPage.verify_errorMessage('Invalid credentials');
  });

  test('TC04 - should validate required username field', async ({ loginPage }) => {
    await loginPage.step_navigate();

    await loginPage.step_login({
      username: '',
      password: 'admin123'
    });

    await loginPage.verify_usernameFieldError('Required');
  });

  test('TC05 - should validate required password field', async ({ loginPage }) => {
    await loginPage.step_navigate();

    await loginPage.step_login({
      username: 'Admin',
      password: ''
    });

    await loginPage.verify_passwordFieldError('Required');
  });

  test('TC06 - should validate when username and password are empty', async ({ loginPage }) => {
    await loginPage.step_navigate();

    await loginPage.step_login({
      username: '',
      password: ''
    });

    await loginPage.verify_usernameFieldError('Required');
    await loginPage.verify_passwordFieldError('Required');
  });

  test('TC07 - should open forgot password page', async ({ loginPage }) => {
    await loginPage.step_navigate();

    await loginPage.clickForgotPassword();

    await loginPage.verify_resetPasswordPage();
  });

  test('TC08 - should display dashboard widgets after login', async ({ loginPage, dashboardPage }) => {
    await loginPage.step_navigate();
    await loginPage.step_login(users.admin);

    await dashboardPage.verify_widgetVisible('Time at Work');
    await dashboardPage.verify_widgetVisible('My Actions');
    await dashboardPage.verify_widgetVisible('Quick Launch');
  });

  test('TC09 - should navigate to PIM module', async ({ loginPage, dashboardPage }) => {
    await loginPage.step_navigate();
    await loginPage.step_login(users.admin);

    await dashboardPage.navigateToPIM();

    await dashboardPage.verify_pageTitle('PIM');
  });

  test('TC10 - should logout successfully', async ({ loginPage, dashboardPage }) => {
    await loginPage.step_navigate();
    await loginPage.step_login(users.admin);

    await dashboardPage.logout();

    await loginPage.verify_loginPageLoaded();
  });

});