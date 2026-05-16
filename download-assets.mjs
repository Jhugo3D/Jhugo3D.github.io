import { readFileSync, mkdirSync, createWriteStream, copyFileSync, existsSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __dirname = dirname(fileURLToPath(import.meta.url));
const scrapeFile = join(__dirname, '../10 SKILLS ADRI Y JUANPE/kit-instagram-web/scrape-results.json');
const data = JSON.parse(readFileSync(scrapeFile, 'utf-8'));

const PROD_DIR = join(__dirname, 'public/img/productos');
const IG_DIR   = join(__dirname, 'public/img/ig');
const IG_SRC   = join(__dirname, '../10 SKILLS ADRI Y JUANPE/kit-instagram-web/assets/instagram');

mkdirSync(PROD_DIR, { recursive: true });
mkdirSync(IG_DIR,   { recursive: true });

function download(url, dest) {
  return new Promise((resolve) => {
    if (existsSync(dest) && statSync(dest).size > 0) { console.log(`  skip (exists): ${dest.split('\\').pop()}`); return resolve(); }
    const file = createWriteStream(dest);
    https.get(url, res => {
      if (res.statusCode !== 200) { console.log(`  error ${res.statusCode}: ${dest.split('/').pop()}`); return resolve(); }
      res.pipe(file);
      file.on('finish', () => { file.close(); console.log(`  ok: ${dest.split('/').pop()}`); resolve(); });
    }).on('error', e => { console.log(`  err: ${e.message}`); resolve(); });
  });
}

// Copy IG images
console.log('\n--- Copiando imágenes de Instagram ---');
const igMap = [
  ['post-1.jpg', 'profile.jpg'],
  ['post-2.jpg', 'post-01.jpg'],
  ['post-3.jpg', 'post-02.jpg'],
  ['post-4.jpg', 'post-03.jpg'],
  ['post-5.jpg', 'post-04.jpg'],
  ['post-6.jpg', 'post-05.jpg'],
  ['post-7.jpg', 'post-06.jpg'],
  ['post-8.jpg', 'post-07.jpg'],
  ['post-9.jpg', 'post-08.jpg'],
  ['post-10.jpg', 'post-09.jpg'],
  ['post-11.jpg', 'post-10.jpg'],
  ['post-12.jpg', 'post-11.jpg'],
];
for (const [src, dest] of igMap) {
  const srcPath  = join(IG_SRC, src);
  const destPath = join(IG_DIR, dest);
  if (existsSync(srcPath)) {
    copyFileSync(srcPath, destPath);
    console.log(`  ok: ${dest}`);
  } else {
    console.log(`  missing: ${src}`);
  }
}

// Download Sites product images (skip first 2 duplicate logos)
console.log('\n--- Descargando imágenes de productos (Google Sites) ---');
const imgs = data.sitesData.disenios.imgs;
// imgs[0] & imgs[1] are the same logo/duplicate → start at index 2
const productImgs = imgs.slice(2, 50); // 48 products

const tasks = productImgs.map((img, i) => {
  const num = String(i + 1).padStart(2, '0');
  const dest = join(PROD_DIR, `p${num}.jpg`);
  return download(img.src, dest);
});

await Promise.all(tasks);
console.log('\nListo. Assets en public/img/');
