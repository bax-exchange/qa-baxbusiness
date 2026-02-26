import { chromium, FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

async function globalSetup(config: FullConfig) {
  // Cargar variables de entorno desde .env si existe
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const [key, ...rest] = line.split('=');
      if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
    });
  }

  const email = process.env.TEST_EMAIL!;
  const password = process.env.TEST_PASSWORD!;
  const baseURL = config.projects[0].use.baseURL!;

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`${baseURL}/login`);

  // Esperar que cargue el formulario
  await page.getByRole('textbox').first().waitFor({ state: 'visible' });
  await page.getByRole('textbox').first().fill(email);
  await page.getByRole('textbox').nth(1).fill(password);
  await page.getByRole('button', { name: 'Ingresar a mi cuenta' }).click();

  // Esperar redirección al dashboard
  await page.waitForURL('**/dashboard');

  // Esperar que la empresa esté seleccionada (balance visible = empresa cargada)
  await page.getByText('Balance en', { exact: false }).waitFor({ state: 'visible', timeout: 15000 });
  // Esperar que la empresa NO sea "Selecciona una compañía"
  await page.waitForFunction(() => {
    const els = Array.from(document.querySelectorAll('p'));
    return els.some(el => el.textContent?.includes('BAX') || el.textContent?.includes('Bax') || el.textContent?.includes('MIKE'));
  }, { timeout: 10000 });

  // Guardar el estado de autenticación con empresa ya cargada
  await page.context().storageState({ path: 'auth/storage.json' });
  await browser.close();

  console.log('✓ Auth state guardado en auth/storage.json (empresa seleccionada)');
}

export default globalSetup;
