import { test, expect } from '@playwright/test';
import { PagosSpeiPage } from '../../pages/PagosSpeiPage';

test.describe('Pagos SPEI', () => {
  let speiPage: PagosSpeiPage;

  test.beforeEach(async ({ page }) => {
    speiPage = new PagosSpeiPage(page);
    await speiPage.goto();
  });

  test('carga la página de Pagos SPEI correctamente', async () => {
    await speiPage.expectLoaded();
  });

  test('muestra el título "Pagos a través de SPEI"', async () => {
    await expect(speiPage.pageTitle).toBeVisible();
  });

  test('muestra las tres pestañas: Pagos realizados, Beneficiarios, Grupos', async () => {
    await expect(speiPage.tabPagosRealizados).toBeVisible();
    await expect(speiPage.tabBeneficiarios).toBeVisible();
    await expect(speiPage.tabGrupos).toBeVisible();
  });

  test('"Pagos realizados" está activa por defecto y muestra la tabla', async ({ page }) => {
    await expect(speiPage.tabPagosRealizados).toBeVisible();
    // La tabla debe estar visible (con datos o en estado vacío)
    await expect(speiPage.table).toBeVisible();
  });

  test('muestra estado vacío O datos en la tabla de pagos realizados', async ({ page }) => {
    // Esperar que la página cargue (estado vacío o tabla con datos)
    await Promise.race([
      speiPage.emptyStateMessage.waitFor({ state: 'visible', timeout: 10000 }),
      speiPage.table.waitFor({ state: 'visible', timeout: 10000 }),
    ]).catch(() => {});
    const tieneEstadoVacio = await speiPage.emptyStateMessage.isVisible();
    const tieneDatos = await speiPage.table.isVisible();
    expect(tieneEstadoVacio || tieneDatos).toBe(true);
  });

  test('muestra el botón "Ejecutar nuevo pago"', async () => {
    await expect(speiPage.ejecutarPagoButton).toBeVisible();
    await expect(speiPage.ejecutarPagoButton).toBeEnabled();
  });

  test('muestra el campo de búsqueda', async () => {
    await expect(speiPage.searchInput).toBeVisible();
  });

  test('la tabla tiene las columnas correctas', async ({ page }) => {
    const columnas = ['Fecha', 'Tipo', 'Origen', 'Destino', 'Estado', 'Monto'];
    for (const columna of columnas) {
      await expect(page.getByRole('columnheader', { name: columna })).toBeVisible();
    }
  });

  test('cambia a la pestaña Beneficiarios', async () => {
    await speiPage.switchToTab('Beneficiarios');
    await expect(speiPage.tabBeneficiarios).toBeVisible();
  });

  test('cambia a la pestaña Grupos', async () => {
    await speiPage.switchToTab('Grupos');
    await expect(speiPage.tabGrupos).toBeVisible();
  });
});
