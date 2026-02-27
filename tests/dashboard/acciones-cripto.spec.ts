import { test, expect } from '@playwright/test';
import { AccionesDashboardPage } from '../../pages/AccionesDashboardPage';
import {
  IngresosCriptoPage,
  MonedaCripto,
  RedCripto,
  REDES_POR_MONEDA,
} from '../../pages/IngresosCriptoPage';

test.describe('Dashboard - Ingresar > Transferencias Cripto', () => {
  let accionesPage: AccionesDashboardPage;
  let criptoPage: IngresosCriptoPage;

  test.beforeEach(async ({ page }) => {
    accionesPage = new AccionesDashboardPage(page);
    criptoPage = new IngresosCriptoPage(page);
    await page.goto('/dashboard');
    await accionesPage.waitForDashboard();
    await accionesPage.openIngresar();
  });

  // ─── Redes disponibles por moneda ─────────────────────────────────────────

  const MONEDAS: MonedaCripto[] = ['MEX', 'USDT', 'USDC'];

  for (const moneda of MONEDAS) {
    test(`${moneda} — muestra las redes disponibles correctas`, async ({ page }) => {
      await criptoPage.seleccionarMoneda(moneda);
      for (const red of REDES_POR_MONEDA[moneda]) {
        await expect(page.getByText(red, { exact: true }).first()).toBeVisible();
      }
    });
  }

  // ─── Detalle por moneda × red ──────────────────────────────────────────────

  const COMBINACIONES: { moneda: MonedaCripto; red: RedCripto }[] = [
    { moneda: 'MEX',  red: 'Liquid Network' },
    { moneda: 'MEX',  red: 'Red Arbitrum' },
    { moneda: 'USDT', red: 'Liquid Network' },
    { moneda: 'USDT', red: 'Red Arbitrum' },
    { moneda: 'USDC', red: 'Red Arbitrum' },
    { moneda: 'USDC', red: 'Binance Smart Chain' },
  ];

  for (const { moneda, red } of COMBINACIONES) {
    test.describe(`${moneda} > ${red}`, () => {
      test.beforeEach(async () => {
        await criptoPage.seleccionarMoneda(moneda);
        await criptoPage.seleccionarRed(red);
      });

      test('1 — muestra toda la información', async ({ page }) => {
        const titulo = criptoPage.tituloEsperado(moneda, red);
        await expect(page.getByText(titulo)).toBeVisible();
        await expect(criptoPage.advertencia).toBeVisible();
        await expect(criptoPage.etiquetaDireccion).toBeVisible();
        const address = await criptoPage.getDireccion();
        expect(address, 'El address no debe estar vacío').not.toBe('');
        await expect(criptoPage.copiarButton).toBeVisible();
      });

      test('2 — el título menciona la moneda y la red correctas', async ({ page }) => {
        const titulo = criptoPage.tituloEsperado(moneda, red);
        await expect(page.getByText(titulo, { exact: true })).toBeVisible();
      });

      test('3 — el address tiene formato válido para la red', async () => {
        const address = await criptoPage.getDireccion();
        expect(
          criptoPage.esAddressValido(address, red),
          `Address inválido para ${red}: "${address}"`,
        ).toBe(true);
      });

      test('4 — el QR decodificado coincide con el address mostrado', async () => {
        const address = await criptoPage.getDireccion();
        const qrData = await criptoPage.decodeQR();
        expect(qrData, 'No se pudo decodificar el QR').not.toBe('');
        expect(qrData).toBe(address);
      });
    });
  }
});
