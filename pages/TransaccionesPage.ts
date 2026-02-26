import { Page, Locator, expect } from '@playwright/test';

export class TransaccionesPage {
  readonly page: Page;

  readonly pageTitle: Locator;
  readonly tabConcentradora: Locator;
  readonly tabCuentas: Locator;
  readonly searchInput: Locator;
  readonly filterTipo: Locator;
  readonly filterEstado: Locator;
  readonly filterMoneda: Locator;
  readonly filterFecha: Locator;
  readonly downloadButton: Locator;
  readonly table: Locator;
  readonly tableRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByText('Transacciones').first();
    this.tabConcentradora = page.getByRole('button', { name: 'Concentradora' });
    this.tabCuentas = page.getByRole('button', { name: 'Cuentas' });
    this.searchInput = page.getByRole('textbox', { name: /buscar/i });
    this.filterTipo = page.getByText('Tipo').first();
    this.filterEstado = page.getByText('Estado').first();
    this.filterMoneda = page.getByText('Moneda').first();
    this.filterFecha = page.getByText('Fecha').first();
    this.downloadButton = page.getByRole('button', { name: 'Descargar' });
    this.table = page.getByRole('table');
    this.tableRows = page.getByRole('table').getByRole('row');
  }

  async goto() {
    await this.page.goto('/movements');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/movements/);
    await expect(this.table).toBeVisible();
  }

  async search(query: string) {
    await this.searchInput.fill(query);
  }

  async switchToTab(tab: 'Concentradora' | 'Cuentas') {
    if (tab === 'Concentradora') {
      await this.tabConcentradora.click();
    } else {
      await this.tabCuentas.click();
    }
  }

  async getRowCount(): Promise<number> {
    // Descontar fila de headers
    const rows = await this.tableRows.count();
    return rows - 1;
  }
}
