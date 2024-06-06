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
      providerAccount.email,
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
    await loginPage.populateForm(
      'invalid-email@invalid.com',
      'invalid-password'
    );
    await page.click('[data-testid="submit-button"]');

    await expect(page.getByText('Credenciales incorrectas')).toBeVisible();
  });
});
test.describe('Forgot Password', () => {
  test('should show an error message when the email is empty', async ({
    forgotPasswordPage,
    page,
  }) => {
    await forgotPasswordPage.populateEmail('');
    await page.click('[data-testid="submit-button"]');

    await expect(
      page.getByText('Por favor, ingresa un correo válido')
    ).toBeVisible();
  });

  test('should not pass to next step if email is invalid', async ({
    forgotPasswordPage,
    page,
  }) => {
    await forgotPasswordPage.populateEmail('invalid-email');
    await page.click('[data-testid="submit-button"]');

    await expect(page.getByText('Correo electrónico')).toBeVisible();
  });

  test('should pass to otp code step if email is valid', async ({
    forgotPasswordPage,
    page,
  }) => {
    // We don't need real credentials because we neither need to check if the email exists
    const email = faker.internet.email();
    await forgotPasswordPage.populateEmail(email);
    await page.click('[data-testid="submit-button"]');

    await expect(page.getByText('Código de seguridad')).toBeVisible();
  });

  test('should show an error message when the otp code is wrong', async ({
    forgotPasswordPage,
    page,
  }) => {
    // We don't need real credentials because the otp code is always the same
    const email = faker.internet.email();
    await forgotPasswordPage.populateEmail(email);
    await page.click('[data-testid="submit-button"]');

    await forgotPasswordPage.populateOTP('000000');
    await page.click('[data-testid="submit-button"]');

    await expect(
      page.getByText('El código de recuperación es incorrecto')
    ).toBeVisible();
  });

  test('should show an error message when the otp code has expired', async ({
    forgotPasswordPage,
    providerAccount,
    page,
  }) => {
    await forgotPasswordPage.populateEmail(providerAccount.email);
    await page.click('[data-testid="submit-button"]');
    await page.waitForSelector('[data-testid="otp-code-title"]'); // Wait until the otp code step is visible

    // We need to get the otp code from the database and modify expiration date to substract 10 minutes
    const user = await prisma.users.findFirst({
      where: {
        email: providerAccount.email,
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
    await forgotPasswordPage.populateEmail(providerAccount.email);
    await page.click('[data-testid="submit-button"]');
    await page.waitForSelector('[data-testid="otp-code-title"]'); // Wait until the otp code step is visible

    const user = await prisma.users.findFirst({
      where: {
        email: providerAccount.email,
      },
    });

    await forgotPasswordPage.populateOTP(String(user?.otp) || '');
    await page.click('[data-testid="submit-button"]');

    await expect(
      page.getByRole('heading', { name: 'Nueva contraseña' })
    ).toBeVisible();
  });
});
