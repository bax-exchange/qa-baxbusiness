import { test, expect } from '@playwright/test';
import { TransaccionesPage } from '../../pages/TransaccionesPage';

test.describe('Transacciones', () => {
  let transaccionesPage: TransaccionesPage;

  test.beforeEach(async ({ page }) => {
    transaccionesPage = new TransaccionesPage(page);
    await transaccionesPage.goto();
  });

  test('carga la página de transacciones correctamente', async () => {
    await transaccionesPage.expectLoaded();
  });

  test('muestra las dos pestañas: Concentradora y Cuentas', async () => {
    await expect(transaccionesPage.tabConcentradora).toBeVisible();
    await expect(transaccionesPage.tabCuentas).toBeVisible();
  });

  test('la pestaña Concentradora está activa por defecto', async ({ page }) => {
    await expect(page).toHaveURL(/\/movements/);
    await expect(transaccionesPage.tabConcentradora).toBeVisible();
  });

  test('cambia a la pestaña Cuentas', async ({ page }) => {
    await transaccionesPage.switchToTab('Cuentas');
    await expect(page).toHaveURL(/\/movements/);
    await expect(transaccionesPage.tabCuentas).toBeVisible();
  });

  test('muestra el campo de búsqueda', async () => {
    await expect(transaccionesPage.searchInput).toBeVisible();
  });

  test('muestra los filtros: Tipo, Estado, Moneda, Fecha', async () => {
    await expect(transaccionesPage.filterTipo).toBeVisible();
    await expect(transaccionesPage.filterEstado).toBeVisible();
    await expect(transaccionesPage.filterMoneda).toBeVisible();
    await expect(transaccionesPage.filterFecha).toBeVisible();
  });

  test('la tabla tiene las columnas correctas', async ({ page }) => {
    const columnas = ['Fecha', 'Tipo', 'Origen', 'Destino', 'Estado', 'Monto'];
    for (const columna of columnas) {
      await expect(page.getByRole('columnheader', { name: columna })).toBeVisible();
    }
  });

  test('muestra filas de transacciones en la tabla', async () => {
    const rowCount = await transaccionesPage.getRowCount();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('el campo de búsqueda acepta texto', async () => {
    await transaccionesPage.search('compra');
    await expect(transaccionesPage.searchInput).toHaveValue('compra');
  });
});
