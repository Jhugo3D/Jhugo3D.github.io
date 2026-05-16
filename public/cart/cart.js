(function () {
  'use strict';

  /* ── Constants ───────────────────────────────────── */
  var KEY      = 'jh_cart_v1';
  var WA_NUM   = '34630481639';

  /* ── Storage ─────────────────────────────────────── */
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
    catch (_) { return []; }
  }
  function save(items) { localStorage.setItem(KEY, JSON.stringify(items)); }

  /* ── Cart operations ─────────────────────────────── */
  function addItem(product) {
    var items = load();
    var nota = product.nota || '';
    var idx = items.findIndex(function (i) { return i.slug === product.slug; });
    if (idx > -1) {
      items[idx].qty += 1;
      if (!items[idx].nota && nota) items[idx].nota = nota;
    } else {
      items.push(Object.assign({}, product, { qty: 1, nota: nota }));
    }
    save(items);
  }

  function removeItem(slug) {
    save(load().filter(function (i) { return i.slug !== slug; }));
  }

  function changeQty(slug, delta) {
    save(load().map(function (i) {
      return i.slug === slug ? Object.assign({}, i, { qty: Math.max(1, i.qty + delta) }) : i;
    }));
  }

  function getCount(items) { return items.reduce(function (n, i) { return n + i.qty; }, 0); }
  function getTotal(items) { return items.reduce(function (n, i) { return n + i.precio * i.qty; }, 0); }

  /* ── CSS ─────────────────────────────────────────── */
  var CSS = [
    /* Overlay */
    '.jh-ov{position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:9000;opacity:0;pointer-events:none;transition:opacity .25s}',
    '.jh-ov.jh-on{opacity:1;pointer-events:all}',
    /* Drawer */
    '.jh-dr{position:fixed;top:0;right:0;bottom:0;width:420px;max-width:100vw;background:var(--surface,#151515);border-left:1px solid var(--border,#232323);z-index:9001;display:flex;flex-direction:column;transform:translateX(100%);transition:transform .3s cubic-bezier(.22,1,.36,1);font-family:var(--font-body,"Inter",system-ui,sans-serif)}',
    '.jh-dr.jh-on{transform:translateX(0)}',
    /* Header */
    '.jh-hd{padding:16px 20px;border-bottom:1px solid var(--border,#232323);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;background:var(--surface-2,#1e1e1e)}',
    '.jh-hd-l{display:flex;align-items:center;gap:8px}',
    '.jh-hd-title{font-family:var(--font-display,"Space Grotesk",sans-serif);font-size:.95rem;font-weight:700;color:var(--text,#f0f0f0)}',
    '.jh-hd-count{font-size:.72rem;color:var(--text-muted,#888)}',
    '.jh-x{background:none;border:none;color:var(--text-muted,#888);cursor:pointer;font-size:1.15rem;line-height:1;padding:4px 8px;border-radius:4px;transition:color .15s}',
    '.jh-x:hover{color:var(--text,#f0f0f0)}',
    /* Items list */
    '.jh-list{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px}',
    '.jh-list::-webkit-scrollbar{width:4px}',
    '.jh-list::-webkit-scrollbar-thumb{background:var(--border-2,#2e2e2e);border-radius:4px}',
    /* Empty */
    '.jh-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.75rem;color:var(--text-muted,#888);text-align:center;padding:2rem;font-size:.88rem}',
    '.jh-empty svg{opacity:.25}',
    '.jh-empty a{color:var(--gold,#D4A832);text-decoration:none;font-size:.84rem}',
    '.jh-empty a:hover{text-decoration:underline}',
    /* Item */
    '.jh-item{display:flex;gap:10px;align-items:flex-start;background:var(--surface-2,#1e1e1e);border:1px solid var(--border,#232323);border-radius:8px;padding:10px;animation:jh-fi .18s ease}',
    '.jh-img{width:54px;height:54px;border-radius:6px;object-fit:cover;flex-shrink:0;background:var(--surface,#151515)}',
    '.jh-ib{flex:1;min-width:0}',
    '.jh-nm{font-size:.82rem;font-weight:600;color:var(--text,#f0f0f0);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:3px}',
    '.jh-pr{font-size:.76rem;color:var(--gold,#D4A832);margin-bottom:7px}',
    '.jh-ctrl{display:flex;align-items:center;gap:5px}',
    '.jh-qb{width:26px;height:26px;border:1px solid var(--border-2,#2e2e2e);background:none;color:var(--text,#f0f0f0);border-radius:4px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.9rem;transition:border-color .15s,color .15s;flex-shrink:0}',
    '.jh-qb:hover{border-color:var(--gold,#D4A832);color:var(--gold,#D4A832)}',
    '.jh-qn{font-size:.84rem;min-width:22px;text-align:center;color:var(--text,#f0f0f0)}',
    '.jh-sub{font-size:.76rem;color:var(--text-muted,#888);margin-left:auto}',
    '.jh-rm{background:none;border:none;color:var(--text-subtle,#555);cursor:pointer;padding:2px 4px;border-radius:4px;line-height:1;font-size:.95rem;transition:color .15s;align-self:flex-start;flex-shrink:0}',
    '.jh-rm:hover{color:#e44}',
    '.jh-nota{font-size:.7rem;color:var(--gold,#D4A832);font-style:italic;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:.8}',
    /* Footer */
    '.jh-ft{border-top:1px solid var(--border,#232323);padding:14px 18px;flex-shrink:0;background:var(--surface,#151515);display:flex;flex-direction:column;gap:9px}',
    '.jh-tot{display:flex;justify-content:space-between;align-items:baseline}',
    '.jh-tot-l{font-size:.82rem;color:var(--text-muted,#888)}',
    '.jh-tot-v{font-family:var(--font-display,sans-serif);font-size:1.4rem;font-weight:700;color:var(--gold,#D4A832)}',
    /* Form */
    '.jh-form{display:flex;flex-direction:column;gap:6px}',
    '.jh-fi{background:var(--surface-2,#1e1e1e);border:1px solid var(--border-2,#2e2e2e);border-radius:6px;padding:9px 11px;color:var(--text,#f0f0f0);font-size:.84rem;font-family:inherit;outline:none;transition:border-color .15s;width:100%;box-sizing:border-box}',
    '.jh-fi:focus{border-color:var(--brand,#1B3C87)}',
    '.jh-fi::placeholder{color:var(--text-subtle,#555)}',
    /* Order btn */
    '.jh-ob{width:100%;padding:12px;background:var(--brand,#1B3C87);border:none;border-radius:8px;color:#fff;font-family:var(--font-display,sans-serif);font-size:.9rem;font-weight:600;cursor:pointer;transition:background .2s;letter-spacing:.02em}',
    '.jh-ob:hover:not(:disabled){background:var(--brand-light,#2550B8)}',
    '.jh-ob:disabled{background:var(--surface-2,#1e1e1e);color:var(--text-subtle,#555);cursor:default}',
    /* Clear btn */
    '.jh-cb{background:none;border:none;color:var(--text-subtle,#555);cursor:pointer;font-size:.72rem;padding:0;text-decoration:underline;font-family:inherit;transition:color .15s;align-self:flex-end}',
    '.jh-cb:hover{color:var(--text-muted,#888)}',
    /* Note */
    '.jh-note{font-size:.68rem;color:var(--text-subtle,#555);text-align:center;line-height:1.4}',
    /* Add btn on cards */
    '.jh-add-btn{width:100%;padding:8px 12px;background:none;border:1px solid var(--border-2,#2e2e2e);border-top:none;color:var(--text-muted,#888);font-family:var(--font-display,sans-serif);font-size:.78rem;font-weight:600;cursor:pointer;letter-spacing:.04em;border-radius:0 0 var(--radius,8px) var(--radius,8px);transition:background .2s,color .2s,border-color .2s}',
    '.jh-add-btn:hover{background:var(--brand,#1B3C87);border-color:var(--brand,#1B3C87);color:#fff}',
    '.jh-add-btn.jh-added{background:var(--gold,#D4A832)!important;border-color:var(--gold,#D4A832)!important;color:#080808!important}',
    /* Cart trigger in header */
    '.jh-trig{position:relative;background:none;border:1px solid var(--border,#232323);border-radius:var(--radius-sm,4px);color:var(--text,#f0f0f0);cursor:pointer;width:38px;height:38px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:border-color .15s,color .15s}',
    '.jh-trig:hover{border-color:var(--gold,#D4A832);color:var(--gold,#D4A832)}',
    '.jh-badge{position:absolute;top:-7px;right:-7px;background:var(--gold,#D4A832);color:#080808;font-size:.58rem;font-weight:700;width:17px;height:17px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--font-display,sans-serif);pointer-events:none}',
    /* Add to cart btn on product page */
    '.btn-add-cart{display:inline-flex;align-items:center;gap:.5rem}',
    /* Animation */
    '@keyframes jh-fi{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}',
  ].join('');

  /* ── Drawer HTML ─────────────────────────────────── */
  function buildDrawer() {
    var ov = document.createElement('div');
    ov.className = 'jh-ov'; ov.id = 'jhOv';

    var dr = document.createElement('div');
    dr.className = 'jh-dr'; dr.id = 'jhDr';
    dr.setAttribute('role', 'dialog');
    dr.setAttribute('aria-label', 'Carrito');
    dr.setAttribute('aria-hidden', 'true');
    dr.innerHTML = [
      '<div class="jh-hd">',
      '  <div class="jh-hd-l">',
      '    <span class="jh-hd-title">Tu carrito</span>',
      '    <span class="jh-hd-count" id="jhHdCount"></span>',
      '  </div>',
      '  <button class="jh-x" id="jhX" aria-label="Cerrar carrito">✕</button>',
      '</div>',
      '<div class="jh-list" id="jhList"></div>',
      '<div class="jh-ft" id="jhFt" hidden>',
      '  <div class="jh-tot">',
      '    <span class="jh-tot-l">Total estimado</span>',
      '    <span class="jh-tot-v" id="jhTot">0€</span>',
      '  </div>',
      '  <div class="jh-form">',
      '    <input id="jhName"    class="jh-fi" type="text"  placeholder="Tu nombre *"          autocomplete="name"  />',
      '    <input id="jhContact" class="jh-fi" type="text"  placeholder="Tel. o Instagram *"   autocomplete="tel" />',
      '    <textarea id="jhNotes" class="jh-fi" rows="2" placeholder="Notas (color, tamaño, detalles…)" style="resize:vertical;min-height:52px"></textarea>',
      '  </div>',
      '  <button class="jh-ob" id="jhOb">Hacer pedido →</button>',
      '  <button class="jh-cb" id="jhCb">Vaciar carrito</button>',
      '  <p class="jh-note">El pedido se envía por WhatsApp a Hugo, que te confirmará disponibilidad y forma de pago.</p>',
      '</div>',
    ].join('');

    document.body.appendChild(ov);
    document.body.appendChild(dr);
  }

  /* ── Render ──────────────────────────────────────── */
  function render() {
    var items   = load();
    var count   = getCount(items);
    var total   = getTotal(items);
    var listEl  = document.getElementById('jhList');
    var ftEl    = document.getElementById('jhFt');
    var totEl   = document.getElementById('jhTot');
    var hdCount = document.getElementById('jhHdCount');
    if (!listEl) return;

    updateBadge(count);
    if (hdCount) hdCount.textContent = count ? (count + ' artículo' + (count > 1 ? 's' : '')) : '';
    if (ftEl)  ftEl.hidden = items.length === 0;
    if (totEl) totEl.textContent = total + '€';

    if (items.length === 0) {
      listEl.innerHTML = [
        '<div class="jh-empty">',
        '  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">',
        '    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>',
        '    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
        '  </svg>',
        '  <p>Tu carrito está vacío</p>',
        '  <a href="/catalogo">Ver el catálogo →</a>',
        '</div>',
      ].join('');
      return;
    }

    listEl.innerHTML = items.map(function (item) {
      return [
        '<div class="jh-item" data-slug="' + esc(item.slug) + '">',
        '  <img class="jh-img" src="' + esc(item.imagen) + '" alt="' + esc(item.nombre) + '" loading="lazy" />',
        '  <div class="jh-ib">',
        '    <div class="jh-nm">' + esc(item.nombre) + '</div>',
        '    <div class="jh-pr">' + esc(item.precioTexto) + ' / ud.</div>',
        (item.nota ? '    <div class="jh-nota">✎ ' + esc(item.nota) + '</div>' : ''),
        '    <div class="jh-ctrl">',
        '      <button class="jh-qb" data-action="dec" data-slug="' + esc(item.slug) + '" aria-label="Reducir">−</button>',
        '      <span class="jh-qn">' + item.qty + '</span>',
        '      <button class="jh-qb" data-action="inc" data-slug="' + esc(item.slug) + '" aria-label="Aumentar">+</button>',
        '      <span class="jh-sub">' + (item.precio * item.qty) + '€</span>',
        '    </div>',
        '  </div>',
        '  <button class="jh-rm" data-slug="' + esc(item.slug) + '" aria-label="Eliminar">✕</button>',
        '</div>',
      ].join('');
    }).join('');
  }

  function updateBadge(count) {
    document.querySelectorAll('.jh-badge').forEach(function (el) {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /* ── Drawer toggle ───────────────────────────────── */
  var isOpen = false;
  function toggle(open) {
    isOpen = open;
    var dr = document.getElementById('jhDr');
    var ov = document.getElementById('jhOv');
    if (!dr || !ov) return;
    dr.classList.toggle('jh-on', open);
    ov.classList.toggle('jh-on', open);
    dr.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) render();
  }

  /* ── Checkout ────────────────────────────────────── */
  function buildWhatsApp(items, name, contact, notes) {
    var lines = items.map(function (i) {
      var line = '  • ' + i.qty + 'x ' + i.nombre + ' — ' + i.qty + ' × ' + i.precioTexto + ' = ' + (i.precio * i.qty) + '€';
      if (i.nota) line += '\n    Personalización: ' + i.nota;
      return line;
    }).join('\n');
    var total = getTotal(items);
    var body = [
      'Hola Hugo, me gustaría hacer este pedido:',
      '',
      'ARTÍCULOS:',
      lines,
      '',
      'TOTAL ESTIMADO: ' + total + '€',
      '',
      '---',
      'Nombre: ' + name,
      'Contacto: ' + contact,
      notes ? 'Notas: ' + notes : '',
    ].filter(function (l) { return l !== undefined; }).join('\n');

    return 'https://wa.me/' + WA_NUM + '?text=' + encodeURIComponent(body);
  }

  /* ── Add to cart feedback ────────────────────────── */
  function flashAdded(btn) {
    var prev = btn.textContent;
    btn.classList.add('jh-added');
    btn.textContent = '✓ Añadido';
    setTimeout(function () {
      btn.classList.remove('jh-added');
      btn.textContent = prev;
    }, 1400);
  }

  /* ── Validation ──────────────────────────────────── */
  function highlightError(el) {
    el.style.borderColor = '#e44444';
    el.focus();
    setTimeout(function () { el.style.borderColor = ''; }, 1800);
  }

  /* ── Event handlers ──────────────────────────────── */
  function handleGlobalClick(e) {
    /* Nota toggle en tarjetas */
    var notaTog = e.target.closest('.nota-toggle');
    if (notaTog) {
      var wrap = notaTog.closest('.card-nota-wrap');
      var area = wrap ? wrap.querySelector('.nota-input') : null;
      if (!area) return;
      var isExp = notaTog.getAttribute('aria-expanded') === 'true';
      notaTog.setAttribute('aria-expanded', String(!isExp));
      notaTog.textContent = !isExp
        ? (notaTog.dataset.labelClose || '✕ Cerrar personalización')
        : (notaTog.dataset.labelOpen  || '✎ Personalizar');
      area.hidden = isExp;
      if (!isExp) setTimeout(function () { area.focus(); }, 30);
      return;
    }

    /* Toggle drawer */
    if (e.target.closest('#jhTrig')) { toggle(!isOpen); return; }
    if (e.target.closest('#jhX'))    { toggle(false);   return; }
    if (e.target.id === 'jhOv')      { toggle(false);   return; }

    /* Add to cart button */
    var addBtn = e.target.closest('.jh-add-btn');
    if (addBtn) {
      e.preventDefault(); e.stopPropagation();
      var card = addBtn.closest('.product-card');
      var notaEl = (card && card.querySelector('.nota-input'))
        || document.getElementById('prodNota');
      var nota = notaEl ? notaEl.value.trim() : '';
      addItem({
        slug:        addBtn.dataset.slug,
        nombre:      addBtn.dataset.nombre,
        precio:      parseFloat(addBtn.dataset.precio),
        precioTexto: addBtn.dataset.preciotexto,
        imagen:      addBtn.dataset.imagen,
        nota:        nota,
      });
      render();
      flashAdded(addBtn);
      return;
    }

    /* Quantity buttons */
    var qBtn = e.target.closest('.jh-qb');
    if (qBtn) {
      changeQty(qBtn.dataset.slug, qBtn.dataset.action === 'inc' ? 1 : -1);
      render();
      return;
    }

    /* Remove */
    var rmBtn = e.target.closest('.jh-rm');
    if (rmBtn) { removeItem(rmBtn.dataset.slug); render(); return; }

    /* Order */
    if (e.target.closest('#jhOb')) {
      var items   = load();
      var nameEl  = document.getElementById('jhName');
      var ctcEl   = document.getElementById('jhContact');
      var notesEl = document.getElementById('jhNotes');
      var name    = nameEl ? nameEl.value.trim() : '';
      var contact = ctcEl  ? ctcEl.value.trim()  : '';
      var notes   = notesEl ? notesEl.value.trim() : '';
      if (!name)    { highlightError(nameEl); return; }
      if (!contact) { highlightError(ctcEl);  return; }
      window.open(buildWhatsApp(items, name, contact, notes));
      return;
    }

    /* Clear cart */
    if (e.target.closest('#jhCb')) { save([]); render(); return; }
  }

  /* ── Init ────────────────────────────────────────── */
  function init() {
    /* CSS */
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    /* Cart trigger button in header */
    var headerCta = document.querySelector('.header-cta');
    if (headerCta && headerCta.parentNode) {
      var trig = document.createElement('button');
      trig.className = 'jh-trig';
      trig.id = 'jhTrig';
      trig.setAttribute('aria-label', 'Abrir carrito');
      trig.innerHTML = [
        '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
        '  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>',
        '  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
        '</svg>',
        '<span class="jh-badge" style="display:none">0</span>',
      ].join('');
      headerCta.parentNode.insertBefore(trig, headerCta);
    }

    /* Drawer */
    buildDrawer();
    render();

    /* Events */
    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) toggle(false);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
