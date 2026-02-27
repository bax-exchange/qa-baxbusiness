import { test, expect } from '@playwright/test';
import { ClientesPage } from '../../pages/ClientesPage';

test.describe('Clientes', () => {
  let clientesPage: ClientesPage;

  test.beforeEach(async ({ page }) => {
    clientesPage = new ClientesPage(page);
    await clientesPage.goto();
  });

  test('carga la página de Clientes correctamente', async () => {
    await clientesPage.expectLoaded();
  });

  test('muestra el botón "Agregar cliente"', async () => {
    await expect(clientesPage.agregarClienteButton).toBeVisible();
    await expect(clientesPage.agregarClienteButton).toBeEnabled();
  });

  test('muestra la pestaña "Usuarios"', async () => {
    await expect(clientesPage.tabUsuarios).toBeVisible();
  });

  test('muestra los contadores de estado (Activos, Pendientes, Bloqueados)', async ({ page }) => {
    await expect(page.getByText('Activos')).toBeVisible();
    await expect(page.getByText('Pendientes')).toBeVisible();
    await expect(page.getByText('Bloqueados')).toBeVisible();
  });

  test('el contador de Activos muestra un número positivo', async ({ page }) => {
    // El bloque tiene: "Activos\n45" — esperamos que cargue el número y sea > 0
    const activosContainer = page.locator('p', { hasText: /^Activos$/ }).locator('..');
    await expect(async () => {
      const fullText = await activosContainer.textContent() ?? '';
      const match = fullText.match(/(\d+)/);
      expect(match).not.toBeNull();
      expect(Number(match![1])).toBeGreaterThan(0);
    }).toPass({ timeout: 10000 });
  });

  test('la tabla tiene las columnas correctas', async ({ page }) => {
    await clientesPage.table.waitFor({ state: 'visible' });
    const columnas = ['Correo', 'Nombre', 'Estado', 'Saldo', 'Tarjetas', 'Proveedor'];
    for (const columna of columnas) {
      await expect(page.getByRole('columnheader', { name: columna })).toBeVisible();
    }
  });

  test('muestra filas de clientes en la tabla', async () => {
    await clientesPage.table.waitFor({ state: 'visible' });
    const rowCount = await clientesPage.getRowCount();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('muestra el botón "Cargar más"', async () => {
    await clientesPage.table.waitFor({ state: 'visible' });
    await expect(clientesPage.cargarMasButton).toBeVisible();
    await expect(clientesPage.cargarMasButton).toBeEnabled();
  });

  test('el campo de búsqueda acepta texto', async () => {
    await clientesPage.searchByEmail('test@test.test');
    await expect(clientesPage.searchInput).toHaveValue('test@test.test');
  });

  test('los filtros de ordenamiento son visibles', async () => {
    await expect(clientesPage.filterOrdenarPor).toBeVisible();
    await expect(clientesPage.filterOrden).toBeVisible();
    await expect(clientesPage.filterEstado).toBeVisible();
  });
});
