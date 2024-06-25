import prisma from '@/app/lib/database/prisma';
import { test, expect } from './fixtures/auth.fixture';
import { faker } from '@faker-js/faker';

test.describe('Login', () => {
  test('should redirect to the dashboard page after login', async ({
    loginPage,
    providerAccount,
    page,
  }) => {
    await loginPage.populateForm(
      providerAccount.username,
      providerAccount.password
    );
    await page.click('[data-testid="submit-button"]');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL('/dashboard');
  });

  test('should show an error message when the credentials are invalid', async ({
    loginPage,
    page,
  }) => {
    await loginPage.populateForm('invalidUsername', 'invalid-password');
    await page.click('[data-testid="submit-button"]');

    await expect(page.getByText('Credenciales incorrectas')).toBeVisible();
  });
});
test.describe('Forgot Password', () => {
  test('should show an error message when the username is empty', async ({
    forgotPasswordPage,
    page,
  }) => {
    await forgotPasswordPage.populateUsername('');
    await page.click('[data-testid="submit-button"]');

    await expect(
      page.getByText('El usuario debe tener al menos 4 caracteres.')
    ).toBeVisible();
  });

  test('should not pass to next step if username is invalid', async ({
    forgotPasswordPage,
    page,
  }) => {
    await forgotPasswordPage.populateUsername('inv');
    await page.click('[data-testid="submit-button"]');

    await expect(page.getByText('Nombre de usuario')).toBeVisible();
  });

  test('should pass to otp code step if username is valid', async ({
    forgotPasswordPage,
    page,
  }) => {
    // We don't need real credentials because we neither need to check if the username exists
    const username = faker.internet.userName();
    await forgotPasswordPage.populateUsername(username);
    await page.click('[data-testid="submit-button"]');

    await expect(page.getByText('Código de seguridad')).toBeVisible();
  });

  test('should show an error message when the otp code is wrong', async ({
    forgotPasswordPage,
    page,
  }) => {
    // We don't need real credentials because the otp code is always the same
    const username = faker.internet.userName();
    await forgotPasswordPage.populateUsername(username);
    await page.click('[data-testid="submit-button"]');

    await forgotPasswordPage.populateOTP('000000');
    await page.click('[data-testid="submit-button"]');

    await expect(
      page.getByText('El código de recuperación es incorrecto')
    ).toBeVisible();
  });

  test('should show an error message when other user is trying to use the otp code', async ({
    forgotPasswordPage,
    providerAccounts,
    page,
  }) => {
    await forgotPasswordPage.populateUsername(providerAccounts[0].username);
    await page.click('[data-testid="submit-button"]');
    await page.waitForSelector('[data-testid="otp-code-title"]');

    await forgotPasswordPage.goto();
    await forgotPasswordPage.populateUsername(providerAccounts[1].username);
    await page.click('[data-testid="submit-button"]');
    await page.waitForSelector('[data-testid="otp-code-title"]');

    const user = await prisma.users.findFirst({
      where: {
        username: providerAccounts[0].username,
      },
    });

    await forgotPasswordPage.populateOTP(String(user?.otp) || '');
    await page.click('[data-testid="submit-button"]');

    await expect(
      page.getByText('El código de recuperación es incorrecto')
    ).toBeVisible();
  });

  test('should not set opt code if user is not active', async ({
    forgotPasswordPage,
    providerAccount,
    page,
  }) => {
    const user = await prisma.users.findFirst({
      where: {
        username: providerAccount.username,
      },
    });

    await prisma.users.update({
      where: {
        id: user?.id,
      },
      data: {
        isActive: false,
      },
    });

    await forgotPasswordPage.populateUsername(providerAccount.username);
    await page.click('[data-testid="submit-button"]');

    await page.waitForSelector('[data-testid="otp-code-title"]'); // Wait until the otp code step is visible

    expect(user?.otp).toBeNull();
  });

  test('should show an error message when the otp code has expired', async ({
    forgotPasswordPage,
    providerAccount,
    page,
  }) => {
    await forgotPasswordPage.populateUsername(providerAccount.username);
    await page.click('[data-testid="submit-button"]');
    await page.waitForSelector('[data-testid="otp-code-title"]'); // Wait until the otp code step is visible

    // We need to get the otp code from the database and modify expiration date to substract 10 minutes
    const user = await prisma.users.findFirst({
      where: {
        username: providerAccount.username,
      },
    });

    await prisma.users.update({
      where: {
        id: user?.id,
      },
      data: {
        otpExpireDate: new Date(Date.now() - 600000),
      },
    });

    await forgotPasswordPage.populateOTP(String(user?.otp) || '');
    await page.click('[data-testid="submit-button"]');

    await expect(
      page.getByText('El código de recuperación ha expirado')
    ).toBeVisible();
  });

  test('should pass to password step if otp code is correct', async ({
    forgotPasswordPage,
    providerAccount,
    page,
  }) => {
    await forgotPasswordPage.populateUsername(providerAccount.username);
    await page.click('[data-testid="submit-button"]');
    await page.waitForSelector('[data-testid="otp-code-title"]'); // Wait until the otp code step is visible

    const user = await prisma.users.findFirst({
      where: {
        username: providerAccount.username,
      },
    });

    await forgotPasswordPage.populateOTP(String(user?.otp) || '');
    await page.click('[data-testid="submit-button"]');

    await expect(
      page.getByRole('heading', { name: 'Nueva contraseña' })
    ).toBeVisible();
  });

  test('should show an error message when password is less than 6', async ({
    forgotPasswordPage,
    providerAccount,
    page,
  }) => {
    await forgotPasswordPage.populateUsername(providerAccount.username);
    await page.click('[data-testid="submit-button"]');
    await page.waitForSelector('[data-testid="otp-code-title"]'); // Wait until the otp code step is visible

    const user = await prisma.users.findFirst({
      where: {
        username: providerAccount.username,
      },
    });

    await forgotPasswordPage.populateOTP(String(user?.otp) || '');
    await page.click('[data-testid="submit-button"]');
    await page.waitForSelector('[data-testid="password-title"]'); // Wait until the password step is visible

    await forgotPasswordPage.populatePassword('123');

    await page.click('[data-testid="submit-button"]');

    await expect(
      page.getByText('La contraseña debe tener al menos 6 caracteres')
    ).toBeVisible();
  });

  test('should show an error message when password and confirm password do not match', async ({
    forgotPasswordPage,
    providerAccount,
    page,
  }) => {
    await forgotPasswordPage.populateUsername(providerAccount.username);
    await page.click('[data-testid="submit-button"]');
    await page.waitForSelector('[data-testid="otp-code-title"]'); // Wait until the otp code step is visible

    const user = await prisma.users.findFirst({
      where: {
        username: providerAccount.username,
      },
    });

    await forgotPasswordPage.populateOTP(String(user?.otp) || '');
    await page.click('[data-testid="submit-button"]');
    await page.waitForSelector('[data-testid="password-title"]'); // Wait until the password step is visible

    await forgotPasswordPage.populatePassword('123456');
    await forgotPasswordPage.populateConfirmPassword('1234567');

    await page.click('[data-testid="submit-button"]');

    await expect(page.getByText('Las contraseñas no coinciden')).toBeVisible();
  });

  test('should change the password and login with the new password', async ({
    forgotPasswordPage,
    providerAccount,
    page,
  }) => {
    await forgotPasswordPage.populateUsername(providerAccount.username);
    await page.click('[data-testid="submit-button"]');
    await page.waitForSelector('[data-testid="otp-code-title"]'); // Wait until the otp code step is visible

    const user = await prisma.users.findFirst({
      where: {
        username: providerAccount.username,
      },
    });

    await forgotPasswordPage.populateOTP(String(user?.otp) || '');
    await page.click('[data-testid="submit-button"]');
    await page.waitForSelector('[data-testid="password-title"]'); // Wait until the password step is visible

    const password = faker.internet.password({
      length: 10,
    });

    await forgotPasswordPage.populatePassword(password);
    await forgotPasswordPage.populateConfirmPassword(password);

    await page.click('[data-testid="submit-button"]');
    await page.waitForSelector('[data-testid="password-updated-title"]');
    await page.click('[data-testid="login-button-redirect"]');

    await page.waitForSelector('[data-testid="username-field"]');
    await page.fill('[data-testid="username-field"]', providerAccount.username);
    await page.fill('[data-testid="password-field"]', password);
    await page.click('[data-testid="submit-button"]');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL('/dashboard');
  });
});
