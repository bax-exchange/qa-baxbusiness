import { Page, Locator, expect } from '@playwright/test';

export class PagosSpeiPage {
  readonly page: Page;

  readonly pageTitle: Locator;
  readonly tabPagosRealizados: Locator;
  readonly tabBeneficiarios: Locator;
  readonly tabGrupos: Locator;
  readonly searchInput: Locator;
  readonly ejecutarPagoButton: Locator;
  readonly table: Locator;
  readonly emptyStateMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByText('Pagos a través de SPEI');
    this.tabPagosRealizados = page.getByRole('button', { name: 'Pagos realizados' });
    this.tabBeneficiarios = page.getByRole('button', { name: 'Beneficiarios' });
    this.tabGrupos = page.getByRole('button', { name: 'Grupos' });
    this.searchInput = page.getByRole('textbox', { name: /buscar/i });
    this.ejecutarPagoButton = page.getByRole('button', { name: 'Ejecutar nuevo pago' });
    this.table = page.getByRole('table');
    this.emptyStateMessage = page.getByText(/aquí vas a poder ver todos los pagos realizados/i);
  }

  async goto() {
    await this.page.goto('/payment/spei');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/payment\/spei/);
    await expect(this.pageTitle).toBeVisible();
  }

  async switchToTab(tab: 'Pagos realizados' | 'Beneficiarios' | 'Grupos') {
    const tabMap: Record<string, Locator> = {
      'Pagos realizados': this.tabPagosRealizados,
      'Beneficiarios': this.tabBeneficiarios,
      'Grupos': this.tabGrupos,
    };
    await tabMap[tab].click();
  }
}
