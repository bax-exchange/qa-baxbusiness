import { test, expect } from '@playwright/test';
import { AccionesDashboardPage } from '../../pages/AccionesDashboardPage';

test.describe('Dashboard - Acciones de Home', () => {
  let accionesPage: AccionesDashboardPage;

  test.beforeEach(async ({ page }) => {
    accionesPage = new AccionesDashboardPage(page);
    await page.goto('/dashboard');
    await accionesPage.waitForDashboard();
  });

  // ─── BOTONES VISIBLES ─────────────────────────────────────────────────────

  test('muestra los tres botones de acción: Ingresar, Retirar, Cambiar', async () => {
    await expect(accionesPage.ingresarButton).toBeVisible();
    await expect(accionesPage.retirarButton).toBeVisible();
    await expect(accionesPage.cambiarButton).toBeVisible();
  });

  test('los tres botones de acción están habilitados', async () => {
    await expect(accionesPage.ingresarButton).toBeEnabled();
    await expect(accionesPage.retirarButton).toBeEnabled();
    await expect(accionesPage.cambiarButton).toBeEnabled();
  });

  // ─── DRAWER INGRESAR ──────────────────────────────────────────────────────

  test.describe('Ingresar', () => {
    test.beforeEach(async () => {
      await accionesPage.openIngresar();
    });

    test('abre el drawer con el título correcto', async () => {
      await expect(accionesPage.ingresarTitle).toBeVisible();
    });

    test('muestra la sección "Transferencia Bancarias"', async () => {
      await expect(accionesPage.ingresarBancariaLabel).toBeVisible();
    });

    test('muestra la sección "Transferencia Cripto"', async () => {
      await expect(accionesPage.ingresarCriptoLabel).toBeVisible();
    });

    test('muestra las opciones Pesos Mexicanos y Dólares en Transferencia Bancaria', async () => {
      await expect(accionesPage.ingresarPesosMexicanos).toBeVisible();
      await expect(accionesPage.ingresarDolares).toBeVisible();
    });

    test('muestra las opciones de cripto: MEX, USDT, USDC, BTC', async ({ page }) => {
      const criptos = ['MEX', 'USDT', 'USDC', 'BTC'];
      for (const cripto of criptos) {
        await expect(page.getByRole('button', { name: new RegExp(`^${cripto}\\s`) })).toBeVisible();
      }
    });

    test('al seleccionar Pesos Mexicanos muestra el número de CLABE', async ({ page }) => {
      await accionesPage.ingresarPesosMexicanos.click();
      await expect(accionesPage.clabeSection).toBeVisible();
    });

    test('al seleccionar Pesos Mexicanos muestra el beneficiario BAX', async ({ page }) => {
      await accionesPage.ingresarPesosMexicanos.click();
      await expect(page.getByText('BAX BLOCKCHAIN SERVICES', { exact: false })).toBeVisible();
    });
  });

  // ─── DRAWER RETIRAR ───────────────────────────────────────────────────────

  test.describe('Retirar', () => {
    test.beforeEach(async () => {
      await accionesPage.openRetirar();
    });

    test('abre el drawer con el título correcto', async () => {
      await expect(accionesPage.retirarTitle).toBeVisible();
    });

    test('muestra la sección "Transferencia Bancaria"', async () => {
      await expect(accionesPage.retirarBancariaLabel).toBeVisible();
    });

    test('muestra la sección "Transferencia Cripto"', async () => {
      await expect(accionesPage.retirarCriptoLabel).toBeVisible();
    });

    test('muestra las opciones Pesos Mexicanos y Dólares', async () => {
      await expect(accionesPage.retirarPesosMexicanos).toBeVisible();
      await expect(accionesPage.retirarDolares).toBeVisible();
    });

    test('muestra las opciones de cripto: MEX, USDC, USDT, BTC', async ({ page }) => {
      const criptos = ['MEX', 'USDC', 'USDT', 'BTC'];
      for (const cripto of criptos) {
        await expect(page.getByRole('button', { name: new RegExp(`^${cripto}\\s`) })).toBeVisible();
      }
    });

    test('al seleccionar Pesos Mexicanos solicita permiso de ubicación (requerido por SPEI)', async () => {
      await accionesPage.retirarPesosMexicanos.click();
      await expect(accionesPage.permisosNecesariosTitle).toBeVisible();
      await expect(accionesPage.permitirUbicacionButton).toBeVisible();
      await expect(accionesPage.permitirUbicacionButton).toBeEnabled();
    });
  });

  // ─── DRAWER CAMBIAR ───────────────────────────────────────────────────────

  test.describe('Cambiar', () => {
    test.beforeEach(async () => {
      await accionesPage.openCambiar();
    });

    test('abre el drawer con el título "Cambiar Monedas"', async () => {
      await expect(accionesPage.cambiarTitle).toBeVisible();
    });

    test('muestra la sección "Quiero vender" con moneda MEX por defecto', async ({ page }) => {
      await expect(accionesPage.quieroVenderLabel).toBeVisible();
      await expect(page.getByText('MEX').first()).toBeVisible();
    });

    test('muestra la sección "Quiero recibir" con moneda BTC por defecto', async ({ page }) => {
      await expect(accionesPage.quieroRecibirLabel).toBeVisible();
      await expect(page.getByText('BTC').first()).toBeVisible();
    });

    test('muestra la tasa de cambio', async () => {
      await expect(accionesPage.tasaDeCambioLabel).toBeVisible();
    });

    test('muestra el botón MAX habilitado', async () => {
      await expect(accionesPage.maxButton).toBeVisible();
      // El botón MAX se habilita una vez que la tasa de cambio termina de cargar
      await expect(accionesPage.maxButton).toBeEnabled({ timeout: 15000 });
    });

    test('el botón Continuar está deshabilitado cuando el monto es 0', async () => {
      await expect(accionesPage.continuarButton).toBeDisabled();
    });

    test('el botón MAX llena el campo con el saldo disponible', async ({ page }) => {
      // El input es un componente React que no expone su valor via inputValue()
      // Verificamos que el equivalente MXN bajo "Quiero vender" cambia de 0.00 a un monto real
      await accionesPage.maxButton.click();
      const quieroVenderSection = page.getByText('Quiero vender').locator('..');
      await expect(quieroVenderSection).not.toContainText('0.00 MXN', { timeout: 5000 });
    });

    test('el campo "Quiero vender" acepta valores numéricos', async () => {
      await accionesPage.quieroVenderInput.fill('500');
      await expect(accionesPage.quieroVenderInput).toHaveValue('500');
    });
  });
});
