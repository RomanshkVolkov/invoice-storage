import type { Page } from '@playwright/test';

export class ForgotPasswordPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/forgot-password');
    await this.page.waitForURL('/forgot-password');
  }

  async populateEmail(email: string) {
    await this.page.fill('[data-testid="email-field"]', email);
  }

  async populateOTP(otp: string) {
    for (let i = 0; i < otp.length; i++) {
      await this.page.fill(`[data-testid="code${i}-field"]`, otp[i]);
    }
  }

  async populatePassword(password: string) {
    await this.page.fill('[data-testid="password-field"]', password);
  }

  async populateConfirmPassword(password: string) {
    await this.page.fill('[data-testid="password-confirm-field"]', password);
  }
}
