import { Page, Locator } from '@playwright/test';
import jsQR from 'jsqr';

export type MonedaCripto = 'MEX' | 'USDT' | 'USDC';
export type RedCripto = 'Liquid Network' | 'Red Arbitrum' | 'Binance Smart Chain';

export const REDES_POR_MONEDA: Record<MonedaCripto, RedCripto[]> = {
  MEX:  ['Liquid Network', 'Red Arbitrum'],
  USDT: ['Liquid Network', 'Red Arbitrum'],
  USDC: ['Red Arbitrum', 'Binance Smart Chain'],
};

const TITULO_RED: Record<RedCripto, string> = {
  'Liquid Network':      'la Liquid Network',
  'Red Arbitrum':        'la Red Arbitrum',
  'Binance Smart Chain': 'la Binance Smart Chain',
};

// Liquid testnet confidential addresses: tlq1 + bech32 chars (lowercase)
// EVM addresses (Arbitrum, BSC): 0x + 40 hex chars
const ADDRESS_REGEX: Record<RedCripto, RegExp> = {
  'Liquid Network':      /^tlq1[a-z0-9]{56,}$/,
  'Red Arbitrum':        /^0x[0-9a-fA-F]{40}$/,
  'Binance Smart Chain': /^0x[0-9a-fA-F]{40}$/,
};

export class IngresosCriptoPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async seleccionarMoneda(moneda: MonedaCripto) {
    await this.page.getByRole('button', { name: new RegExp(`^${moneda}\\s`) }).click();
    await this.page
      .getByText(`Ingresar ${moneda} por tu red preferida`)
      .waitFor({ state: 'visible' });
  }

  async seleccionarRed(red: RedCripto) {
    await this.page.getByText(red, { exact: true }).first().click();
    await this.etiquetaDireccion.waitFor({ state: 'visible' });
  }

  tituloEsperado(moneda: MonedaCripto, red: RedCripto): string {
    return `Ingresa ${moneda} utilizando ${TITULO_RED[red]}`;
  }

  get etiquetaDireccion(): Locator {
    return this.page.getByText('Dirección', { exact: true });
  }

  get advertencia(): Locator {
    return this.page.getByText('Verifica la red a utilizar', { exact: false });
  }

  get copiarButton(): Locator {
    // The copy icon is an <svg> element (sibling of the address-row container)
    // Playwright's accessibility tree shows it as "img" but the DOM tag is svg
    return this.etiquetaDireccion.locator('../..').locator('svg');
  }

  async getDireccion(): Promise<string> {
    // Structure: <div> <div> <p>Dirección</p> <p>{address}</p> </div> <img/> </div>
    const text = await this.etiquetaDireccion
      .locator('..')
      .locator('p')
      .nth(1)
      .textContent();
    return text?.trim() ?? '';
  }

  esAddressValido(address: string, red: RedCripto): boolean {
    return ADDRESS_REGEX[red].test(address);
  }

  async decodeQR(): Promise<string> {
    // 1. Find the largest SVG on the page (that's the QR rendered by qrcode.react)
    // 2. Render it to a canvas in the browser context
    // 3. Return raw RGBA pixel data to Node.js
    // 4. Decode with jsQR in Node.js
    const imageData = await this.page.evaluate(
      (): Promise<{ data: number[]; width: number; height: number }> => {
        const svgs = Array.from(document.querySelectorAll('svg'));
        const qrSvg = svgs.reduce((largest, s) => {
          const a = s.getBoundingClientRect();
          const b = largest.getBoundingClientRect();
          return a.width * a.height > b.width * b.height ? s : largest;
        });

        const rect = qrSvg.getBoundingClientRect();
        const w = Math.round(rect.width);
        const h = Math.round(rect.height);

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d')!;

        // White background so dark QR modules are readable
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);

        const svgStr = new XMLSerializer().serializeToString(qrSvg);
        const blob = new Blob([svgStr], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);

        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0, w, h);
            URL.revokeObjectURL(url);
            const imgData = ctx.getImageData(0, 0, w, h);
            resolve({ data: Array.from(imgData.data), width: w, height: h });
          };
          img.src = url;
        });
      },
    );

    const code = jsQR(
      new Uint8ClampedArray(imageData.data),
      imageData.width,
      imageData.height,
    );

    return code?.data ?? '';
  }
}
