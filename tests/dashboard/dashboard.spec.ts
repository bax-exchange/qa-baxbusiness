import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../pages/DashboardPage';

test.describe('Dashboard', () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    // Esperar que la sección de balance sea visible (indica empresa cargada)
    await dashboardPage.balanceSection.waitFor({ state: 'visible', timeout: 15000 });
  });

  test('carga el dashboard correctamente tras login', async () => {
    await dashboardPage.expectLoaded();
  });

  test('muestra la sección de Balance en MXN', async () => {
    await expect(dashboardPage.balanceSection).toBeVisible();
  });

  test('muestra los botones de acción principales', async ({ page }) => {
    await expect(page.getByRole('button', { name: /ingresar dinero/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /retirar/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /cambiar/i })).toBeVisible();
  });

  test('muestra la sección "Transacciones pendientes"', async () => {
    await expect(dashboardPage.transaccionesPendientesSection).toBeVisible();
  });

  test('muestra la sección "Últimas Transacciones" con tabla', async ({ page }) => {
    await expect(dashboardPage.ultimasTransaccionesSection).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('la tabla de últimas transacciones tiene las columnas correctas', async ({ page }) => {
    const columnas = ['Fecha', 'Tipo', 'Origen', 'Destino', 'Estado', 'Monto'];
    for (const columna of columnas) {
      await expect(page.getByRole('columnheader', { name: columna })).toBeVisible();
    }
  });

  test('el sidebar muestra las secciones de navegación', async ({ page }) => {
    await expect(page.getByText('Balance total')).toBeVisible();
    await expect(page.getByText('Transacciones').first()).toBeVisible();
    await expect(page.getByText('Pagos').first()).toBeVisible();
    await expect(page.getByText('Clientes').first()).toBeVisible();
  });

  test('navega a Transacciones desde el sidebar', async () => {
    await dashboardPage.navigateTo('transacciones');
    await expect(dashboardPage.page).toHaveURL(/\/movements/);
  });

  test('navega a Pagos SPEI desde el sidebar', async () => {
    await dashboardPage.navigateTo('spei');
    await expect(dashboardPage.page).toHaveURL(/\/payment\/spei/);
  });

  test('navega a Clientes desde el sidebar', async () => {
    await dashboardPage.navigateTo('clientes');
    await expect(dashboardPage.page).toHaveURL(/\/users/);
  });
});
