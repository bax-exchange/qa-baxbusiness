import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('debe mostrar el formulario de login correctamente', async () => {
    await loginPage.expectVisible();
    await expect(loginPage.forgotPasswordButton).toBeVisible();
    await expect(loginPage.registerButton).toBeVisible();
  });

  test('el botón "Ingresar" está deshabilitado cuando los campos están vacíos', async () => {
    await expect(loginPage.submitButton).toBeDisabled();
  });

  test('el botón "Ingresar" se habilita al completar email y contraseña', async () => {
    await loginPage.emailInput.fill('test@ejemplo.com');
    await loginPage.passwordInput.fill('password123');
    await expect(loginPage.submitButton).toBeEnabled();
  });

  test('muestra error con credenciales inválidas', async ({ page }) => {
    await loginPage.emailInput.fill('usuario@invalido.com');
    await loginPage.passwordInput.fill('contraseñaincorrecta');
    await loginPage.submitButton.click();
    await expect(page.getByText(/incorrecto|inválido|error/i)).toBeVisible({ timeout: 5000 });
  });

  test('navega a recuperar contraseña al hacer click en "Olvidé mi contraseña"', async ({ page }) => {
    await loginPage.forgotPasswordButton.click();
    await expect(page).not.toHaveURL('/login');
  });

  test('"Registrarme" permanece en la página de login (comportamiento actual)', async ({ page }) => {
    await loginPage.registerButton.click();
    // El botón actualmente no navega — permanece en /login
    // TODO: actualizar cuando el flujo de registro esté implementado
    await expect(page).toHaveURL('/login');
  });

  test('login exitoso redirige al dashboard', async ({ page }) => {
    await loginPage.login(
      process.env.TEST_EMAIL ?? 'mike+biz@bax.mx',
      process.env.TEST_PASSWORD ?? 'Bax@2024'
    );
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  });
});
