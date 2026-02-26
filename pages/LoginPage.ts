import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly forgotPasswordButton: Locator;
  readonly registerButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Los inputs usan labels flotantes (sin placeholder), se identifican por posición
    this.emailInput = page.getByRole('textbox').first();
    this.passwordInput = page.getByRole('textbox').nth(1);
    this.submitButton = page.getByRole('button', { name: 'Ingresar a mi cuenta' });
    this.forgotPasswordButton = page.getByRole('button', { name: 'Olvidé mi contraseña' });
    this.registerButton = page.getByRole('button', { name: 'Registrarme' });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectVisible() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }
}
