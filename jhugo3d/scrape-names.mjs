import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 900 });

console.log('Cargando Google Sites…');
await page.goto('https://sites.google.com/view/jhugo3d?usp=sharing', {
  waitUntil: 'networkidle', timeout: 60000
});
await page.waitForTimeout(2000);

// Acepta cookies
try {
  await page.click('text=GOT IT', { timeout: 4000 });
  await page.waitForTimeout(1000);
} catch (_) {}

// Navega a Diseños
try {
  await page.click('text=Diseños', { timeout: 5000 });
  await page.waitForTimeout(2000);
} catch (_) {
  try {
    await page.click('text=Mira mis diseños', { timeout: 5000 });
    await page.waitForTimeout(2000);
  } catch (_) {}
}

// Scroll completo para cargar todo
const total = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < total + 500; y += 400) {
  await page.evaluate(pos => window.scrollTo(0, pos), y);
  await page.waitForTimeout(250);
}
await page.waitForTimeout(2000);

// Screenshot para verificar qué vemos
await page.screenshot({ path: 'scrape-names-screenshot.jpg', fullPage: true });
console.log('Screenshot guardado.');

// Extrae TODO el texto visible de la página
const allText = await page.evaluate(() => {
  const texts = [];
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null
  );
  let node;
  while ((node = walker.nextNode())) {
    const t = node.textContent.trim();
    const parent = node.parentElement;
    if (!t || !parent) continue;
    const style = window.getComputedStyle(parent);
    if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) continue;
    if (t.length > 1 && t.length < 120) texts.push(t);
  }
  return texts;
});

console.log('\n=== TODO EL TEXTO VISIBLE ===');
allText.forEach((t, i) => console.log(`[${i}] ${t}`));

// Extrae texto de elementos que parecen labels/títulos cerca de imágenes
const nearImages = await page.evaluate(() => {
  const results = [];
  const imgs = Array.from(document.querySelectorAll('img')).filter(img =>
    img.naturalWidth > 100 && img.naturalHeight > 100
  );
  imgs.forEach(img => {
    // Busca texto en el padre y sus hijos
    let el = img.parentElement;
    for (let i = 0; i < 6; i++) {
      if (!el) break;
      const texts = Array.from(el.querySelectorAll('*'))
        .map(n => n.childNodes)
        .reduce((acc, nodes) => {
          nodes.forEach(n => { if (n.nodeType === 3 && n.textContent.trim()) acc.push(n.textContent.trim()); });
          return acc;
        }, [])
        .filter(t => t.length > 1 && t.length < 100 && !t.match(/^[\d€.,]+$/));
      if (texts.length) { results.push({ img: img.src.slice(-40), texts }); break; }
      el = el.parentElement;
    }
  });
  return results;
});

console.log('\n=== TEXTO CERCANO A IMÁGENES ===');
nearImages.forEach((r, i) => console.log(`[${i}] ...${r.img}: ${r.texts.join(' | ')}`));

await browser.close();
