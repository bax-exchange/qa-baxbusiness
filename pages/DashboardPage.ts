import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;

  readonly balanceSection: Locator;
  readonly ingresarButton: Locator;
  readonly retirarButton: Locator;
  readonly cambiarButton: Locator;
  readonly transaccionesPendientesSection: Locator;
  readonly ultimasTransaccionesSection: Locator;

  // Sidebar
  readonly sidebarTransacciones: Locator;
  readonly sidebarPagos: Locator;
  readonly sidebarClientes: Locator;

  constructor(page: Page) {
    this.page = page;
    this.balanceSection = page.getByText('Balance en', { exact: false }).first();
    this.ingresarButton = page.getByRole('button', { name: /ingresar dinero/i });
    this.retirarButton = page.getByRole('button', { name: /retirar/i });
    this.cambiarButton = page.getByRole('button', { name: /cambiar/i });
    this.transaccionesPendientesSection = page.getByText('Transacciones pendientes');
    this.ultimasTransaccionesSection = page.getByText('Últimas Transacciones');

    this.sidebarTransacciones = page.getByText('Transacciones').first();
    this.sidebarPagos = page.getByText('Pagos').first();
    this.sidebarClientes = page.getByText('Clientes').first();
  }

  async goto() {
    await this.page.goto('/dashboard');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/dashboard/);
    await expect(this.balanceSection).toBeVisible();
  }

  async navigateTo(section: 'transacciones' | 'spei' | 'mexas' | 'clientes') {
    const routes: Record<string, string> = {
      transacciones: '/movements',
      spei: '/payment/spei',
      mexas: '/payment/mexas',
      clientes: '/users',
    };
    await this.page.goto(routes[section]);
  }
}
