import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 900 });

console.log('Cargando Google Sites…');
await page.goto('https://sites.google.com/view/jhugo3d?usp=sharing', {
  waitUntil: 'networkidle', timeout: 60000
});
await page.waitForTimeout(4000);

// Scroll agresivo
for (let i = 0; i < 12; i++) {
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(500);
}
await page.waitForTimeout(2000);

// Screenshot
await page.screenshot({ path: join(__dirname, 'debug-screenshot.jpg'), fullPage: false });
console.log('Screenshot guardado en debug-screenshot.jpg');

// Todas las URLs sin filtro
const all = await page.evaluate(() =>
  Array.from(document.querySelectorAll('img')).map(img => ({
    src: img.src,
    w: img.naturalWidth,
    h: img.naturalHeight,
    alt: img.alt?.slice(0, 40)
  }))
);
console.log('\nTodas las imágenes encontradas:');
all.forEach((img, i) => console.log(`  [${i}] ${img.w}x${img.h} | ${img.src.slice(0, 100)}`));

// CSS background images
const bgImgs = await page.evaluate(() => {
  const urls = [];
  document.querySelectorAll('*').forEach(el => {
    const bg = getComputedStyle(el).backgroundImage;
    if (bg && bg !== 'none' && bg.includes('url(')) {
      const m = bg.match(/url\("?([^")]+)"?\)/);
      if (m) urls.push(m[1]);
    }
  });
  return [...new Set(urls)];
});
console.log('\nBackground images:');
bgImgs.forEach((u, i) => console.log(`  [${i}] ${u.slice(0, 100)}`));

await browser.close();
