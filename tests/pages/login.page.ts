import type { Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/login');
    await this.page.waitForURL('/login');
  }

  async populateForm(username: string, password: string) {
    await this.page.fill('[data-testid="username-field"]', username);
    await this.page.fill('[data-testid="password-field"]', password);
  }
}
