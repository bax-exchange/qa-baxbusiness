import { Page, Locator, expect } from '@playwright/test';

export class ClientesPage {
  readonly page: Page;

  readonly pageTitle: Locator;
  readonly agregarClienteButton: Locator;
  readonly searchInput: Locator;
  readonly filterOrdenarPor: Locator;
  readonly filterOrden: Locator;
  readonly filterEstado: Locator;
  readonly contadorActivos: Locator;
  readonly contadorPendientes: Locator;
  readonly contadorBloqueados: Locator;
  readonly table: Locator;
  readonly tableRows: Locator;
  readonly cargarMasButton: Locator;
  readonly tabUsuarios: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByText('Clientes').first();
    this.agregarClienteButton = page.getByRole('button', { name: 'Agregar cliente' });
    this.searchInput = page.getByRole('textbox', { name: /buscar por correo/i });
    this.filterOrdenarPor = page.getByText('Ordenar por');
    this.filterOrden = page.getByText('Orden').first();
    this.filterEstado = page.getByText('Estado').first();
    this.contadorActivos = page.getByText('Activos').locator('..').getByText(/^\d+$/);
    this.contadorPendientes = page.getByText('Pendientes').locator('..').getByText(/^\d+$/);
    this.contadorBloqueados = page.getByText('Bloqueados').locator('..').getByText(/^\d+$/);
    this.table = page.getByRole('table');
    this.tableRows = page.getByRole('table').getByRole('row');
    this.cargarMasButton = page.getByRole('button', { name: 'Cargar más' });
    this.tabUsuarios = page.getByRole('button', { name: 'Usuarios' });
  }

  async goto() {
    await this.page.goto('/users');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/users/);
    await expect(this.table).toBeVisible();
  }

  async searchByEmail(email: string) {
    await this.searchInput.fill(email);
    await this.page.waitForTimeout(500); // debounce
  }

  async getRowCount(): Promise<number> {
    const rows = await this.tableRows.count();
    return rows - 1; // descontar header
  }
}
