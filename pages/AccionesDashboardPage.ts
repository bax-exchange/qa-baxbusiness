import { Page, Locator } from '@playwright/test';

export class AccionesDashboardPage {
  readonly page: Page;

  // Botones de acción (el label está en un <span> sibling, no dentro del <button>)
  readonly ingresarButton: Locator;
  readonly retirarButton: Locator;
  readonly cambiarButton: Locator;

  // Drawer Ingresar
  readonly ingresarTitle: Locator;
  readonly ingresarBancariaLabel: Locator;
  readonly ingresarCriptoLabel: Locator;
  readonly ingresarPesosMexicanos: Locator;
  readonly ingresarDolares: Locator;

  // Ingresar > Pesos Mexicanos — detalle CLABE
  readonly clabeSection: Locator;
  readonly pesosTitulo: Locator;
  readonly cuentaClabeLabel: Locator;
  readonly beneficiarioLabel: Locator;
  readonly beneficiarioValue: Locator;
  readonly bancoLabel: Locator;
  readonly bancoValue: Locator;
  readonly copiarDireccionButton: Locator;

  // Drawer Retirar
  readonly retirarTitle: Locator;
  readonly retirarBancariaLabel: Locator;
  readonly retirarCriptoLabel: Locator;
  readonly retirarPesosMexicanos: Locator;
  readonly retirarDolares: Locator;
  readonly permisosNecesariosTitle: Locator;
  readonly permitirUbicacionButton: Locator;

  // Drawer Cambiar
  readonly cambiarTitle: Locator;
  readonly quieroVenderLabel: Locator;
  readonly quieroRecibirLabel: Locator;
  readonly quieroVenderInput: Locator;
  readonly tasaDeCambioLabel: Locator;
  readonly maxButton: Locator;
  readonly continuarButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Botones de acción — a 1280×720 (Desktop Chrome) se renderizan como botones con texto
    this.ingresarButton = page.getByRole('button', { name: /ingresar dinero/i });
    this.retirarButton = page.getByRole('button', { name: /^retirar$/i });
    this.cambiarButton = page.getByRole('button', { name: /cambiar monedas/i });

    // Drawer Ingresar — en Ingresar la etiqueta usa plural "Bancarias"
    this.ingresarTitle = page.getByText('Selecciona cómo quieres ingresar', { exact: false });
    this.ingresarBancariaLabel = page.getByText('Transferencia Bancarias:').first();
    this.ingresarCriptoLabel = page.getByText('Transferencia Cripto:').first();
    this.ingresarPesosMexicanos = page.getByRole('button', { name: /Pesos Mexicanos/i }).first();
    this.ingresarDolares = page.getByRole('button', { name: /Dólares/i }).first();
    this.clabeSection = page.getByText('646180537900000009');
    this.pesosTitulo = page.getByText('Compra MEXAS depositando Pesos Mexicanos');
    this.cuentaClabeLabel = page.getByText('Cuenta CLABE');
    this.beneficiarioLabel = page.getByText('Beneficiario');
    this.beneficiarioValue = page.getByText('BAX BLOCKCHAIN SERVICES SA DE CV');
    this.bancoLabel = page.getByText('Banco');
    this.bancoValue = page.getByText('STP');
    this.copiarDireccionButton = page.getByRole('button', { name: 'Copiar dirección' });

    // Drawer Retirar
    this.retirarTitle = page.getByText('Selecciona cómo quieres retirar', { exact: false });
    this.retirarBancariaLabel = page.getByText('Transferencia Bancaria:').first();
    this.retirarCriptoLabel = page.getByText('Transferencia Cripto:').first();
    this.retirarPesosMexicanos = page.getByRole('button', { name: /Pesos Mexicanos.*MEXAS/i });
    this.retirarDolares = page.getByRole('button', { name: /Dólares.*USDC/i });
    this.permisosNecesariosTitle = page.getByText('Permisos Necesarios');
    this.permitirUbicacionButton = page.getByRole('button', { name: 'Permitir ubicación' });

    // Drawer Cambiar — "Cambiar Monedas" aparece también en el botón, usar .first() para el título
    this.cambiarTitle = page.getByText('Cambiar Monedas').first();
    this.quieroVenderLabel = page.getByText('Quiero vender');
    this.quieroRecibirLabel = page.getByText('Quiero recibir');
    this.quieroVenderInput = page.getByRole('textbox').first();
    this.tasaDeCambioLabel = page.getByText('Tasa de cambio');
    this.maxButton = page.getByRole('button', { name: 'MAX' });
    this.continuarButton = page.getByRole('button', { name: 'Continuar' });
  }

  async waitForDashboard() {
    await this.page.getByText('Balance en', { exact: false }).first().waitFor({ state: 'visible', timeout: 15000 });
  }

  async openIngresar() {
    await this.ingresarButton.click();
    await this.ingresarTitle.waitFor({ state: 'visible' });
  }

  async openRetirar() {
    await this.retirarButton.click();
    await this.retirarTitle.waitFor({ state: 'visible' });
  }

  async openCambiar() {
    await this.cambiarButton.click();
    await this.cambiarTitle.waitFor({ state: 'visible' });
  }
}
