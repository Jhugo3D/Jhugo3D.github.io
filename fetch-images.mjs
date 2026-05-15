/**
 * Navega a Google Sites, acepta cookies, va a "Diseños",
 * intercepta las respuestas de imagen y las guarda localmente.
 */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, existsSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROD_DIR = join(__dirname, 'public/img/productos');
mkdirSync(PROD_DIR, { recursive: true });

const SITES_URL = 'https://sites.google.com/view/jhugo3d?usp=sharing';

console.log('Iniciando Playwright…');
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
});
const page = await context.newPage();

// Intercepta todas las respuestas de imagen y las guarda en memoria
const capturedImages = [];
page.on('response', async (response) => {
  const url = response.url();
  const ct = response.headers()['content-type'] || '';
  if (!ct.startsWith('image/')) return;
  if (url.includes('favicon') || url.includes('icon') || url.includes('gstatic')) return;
  try {
    const body = await response.body();
    if (body.length > 5000) { // ignora iconos pequeños (< 5KB)
      capturedImages.push({ url, body, size: body.length });
    }
  } catch (_) {}
});

console.log('Cargando página principal…');
await page.goto(SITES_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(2000);

// Acepta cookies si aparece el banner
try {
  const gotIt = page.locator('text=GOT IT');
  await gotIt.click({ timeout: 5000 });
  console.log('Cookie banner aceptado.');
  await page.waitForTimeout(1000);
} catch (_) {
  console.log('Sin cookie banner.');
}

// Navega a la sección Diseños
console.log('Navegando a Diseños…');
try {
  await page.click('text=Diseños', { timeout: 5000 });
  await page.waitForTimeout(2000);
} catch (_) {
  try {
    await page.click('text=Mira mis diseños', { timeout: 5000 });
    await page.waitForTimeout(2000);
  } catch (_) {
    console.log('No encontré botón de diseños, scrolleando desde aquí…');
  }
}

// Scroll lento para forzar lazy-load de todas las imágenes
console.log('Scrolleando para cargar imágenes…');
const totalHeight = await page.evaluate(() => document.body.scrollHeight);
const step = 400;
for (let y = 0; y < totalHeight + step; y += step) {
  await page.evaluate((pos) => window.scrollTo(0, pos), y);
  await page.waitForTimeout(300);
}
await page.waitForTimeout(3000);

console.log(`\nImágenes capturadas de la red: ${capturedImages.length}`);

// Deduplica por URL
const seen = new Set();
const unique = capturedImages.filter(img => {
  if (seen.has(img.url)) return false;
  seen.add(img.url);
  return true;
});
console.log(`Imágenes únicas: ${unique.length}`);

// Ordena por tamaño desc (las fotos reales son más grandes que iconos)
unique.sort((a, b) => b.size - a.size);

// Guarda las primeras 48
const toSave = unique.slice(0, 48);
console.log(`\nGuardando ${toSave.length} imágenes…`);

let saved = 0;
for (let i = 0; i < toSave.length; i++) {
  const num = String(i + 1).padStart(2, '0');
  const dest = join(PROD_DIR, `p${num}.jpg`);
  writeFileSync(dest, toSave[i].body);
  console.log(`  p${num}.jpg — ${(toSave[i].size / 1024).toFixed(0)} KB`);
  saved++;
}

// Screenshot final para verificar
await page.screenshot({ path: join(__dirname, 'debug-screenshot.jpg'), fullPage: false });

await browser.close();
console.log(`\nListo: ${saved} imágenes guardadas en public/img/productos/`);
