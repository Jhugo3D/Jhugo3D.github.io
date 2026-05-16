(function () {
  'use strict';

  /* ── Config ── */
  var CFG = {
    faqsUrl: '/chat/faqs.json',
    fallback: 'No tengo esa respuesta. Para cualquier duda escríbenos a <a href="mailto:soportejhugo3d@gmail.com">soportejhugo3d@gmail.com</a> o por Instagram <a href="https://www.instagram.com/jhugo3d/" target="_blank" rel="noopener">@jhugo3d</a>.',
    typingMs: 650,
    maxChars: 500,
    rateMax: 20,
    rateWindowMs: 60000,
  };

  /* ── State ── */
  var faqs = [];
  var isOpen = false;
  var msgTimes = [];

  /* ── CSS ── */
  var CSS = [
    '#jh-widget {',
    '  position: fixed; bottom: 24px; right: 24px; z-index: 9999;',
    '  font-family: var(--font-body, "Inter", system-ui, sans-serif);',
    '  font-size: 14px; line-height: 1.5;',
    '}',

    '#jh-btn {',
    '  width: 56px; height: 56px; border-radius: 50%;',
    '  background: var(--brand, #1B3C87);',
    '  border: none; cursor: pointer; margin-left: auto;',
    '  display: flex; align-items: center; justify-content: center;',
    '  box-shadow: 0 4px 24px rgba(0,0,0,0.45);',
    '  transition: transform .2s, box-shadow .2s;',
    '  color: #fff;',
    '}',
    '#jh-btn:hover { transform: scale(1.07); box-shadow: 0 6px 32px rgba(0,0,0,0.55); }',
    '#jh-btn .jh-ico-close { display: none; }',
    '#jh-widget.jh-open #jh-btn .jh-ico-chat  { display: none; }',
    '#jh-widget.jh-open #jh-btn .jh-ico-close { display: block; }',

    '#jh-panel {',
    '  position: absolute; bottom: 68px; right: 0;',
    '  width: 340px; max-height: 520px;',
    '  background: var(--surface, #151515);',
    '  border: 1px solid var(--border, #232323);',
    '  border-radius: 12px;',
    '  display: flex; flex-direction: column; overflow: hidden;',
    '  box-shadow: 0 8px 48px rgba(0,0,0,0.55);',
    '  transform-origin: bottom right;',
    '  transform: scale(.92) translateY(8px); opacity: 0; pointer-events: none;',
    '  transition: transform .22s cubic-bezier(.22,1,.36,1), opacity .18s;',
    '}',
    '#jh-widget.jh-open #jh-panel {',
    '  transform: scale(1) translateY(0); opacity: 1; pointer-events: all;',
    '}',

    '#jh-header {',
    '  display: flex; align-items: center; justify-content: space-between;',
    '  padding: 13px 16px;',
    '  border-bottom: 1px solid var(--border, #232323);',
    '  background: var(--surface-2, #1E1E1E);',
    '  flex-shrink: 0;',
    '}',
    '.jh-brand { font-family: var(--font-display, "Space Grotesk", system-ui, sans-serif); font-weight: 700; font-size: .9rem; color: var(--text, #F0F0F0); }',
    '.jh-brand em { font-style: normal; color: var(--gold, #D4A832); }',
    '.jh-status { font-size: .7rem; color: var(--text-muted, #888); display: block; margin-top: 2px; }',
    '#jh-close-btn {',
    '  background: none; border: none; color: var(--text-muted, #888);',
    '  cursor: pointer; font-size: 1.1rem; line-height: 1; padding: 4px 6px;',
    '  border-radius: 4px; transition: color .15s;',
    '}',
    '#jh-close-btn:hover { color: var(--text, #F0F0F0); }',

    '#jh-messages {',
    '  flex: 1; overflow-y: auto; padding: 14px;',
    '  display: flex; flex-direction: column; gap: 10px;',
    '  scroll-behavior: smooth;',
    '}',
    '#jh-messages::-webkit-scrollbar { width: 4px; }',
    '#jh-messages::-webkit-scrollbar-track { background: transparent; }',
    '#jh-messages::-webkit-scrollbar-thumb { background: var(--border-2, #2E2E2E); border-radius: 4px; }',

    '.jh-bubble {',
    '  max-width: 86%; padding: 9px 13px;',
    '  border-radius: 12px; font-size: .875rem; line-height: 1.55;',
    '  animation: jh-in .18s ease;',
    '  word-break: break-word;',
    '}',
    '.jh-bubble.jh-bot {',
    '  background: var(--surface-2, #1E1E1E); color: var(--text, #F0F0F0);',
    '  border-bottom-left-radius: 3px; align-self: flex-start;',
    '}',
    '.jh-bubble.jh-bot a { color: var(--gold, #D4A832); }',
    '.jh-bubble.jh-user {',
    '  background: var(--brand, #1B3C87); color: #fff;',
    '  border-bottom-right-radius: 3px; align-self: flex-end;',
    '}',

    '.jh-typing {',
    '  display: flex; gap: 4px; align-items: center;',
    '  padding: 10px 14px;',
    '  background: var(--surface-2, #1E1E1E);',
    '  border-radius: 12px; border-bottom-left-radius: 3px;',
    '  align-self: flex-start;',
    '}',
    '.jh-typing span {',
    '  width: 6px; height: 6px;',
    '  background: var(--text-muted, #888); border-radius: 50%;',
    '  animation: jh-dot 1.2s infinite;',
    '}',
    '.jh-typing span:nth-child(2) { animation-delay: .2s; }',
    '.jh-typing span:nth-child(3) { animation-delay: .4s; }',

    '.jh-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 2px; }',
    '.jh-chip {',
    '  background: none;',
    '  border: 1px solid var(--border-2, #2E2E2E);',
    '  color: var(--text-muted, #888);',
    '  border-radius: 20px; padding: 5px 11px;',
    '  font-size: .74rem; cursor: pointer; font-family: inherit;',
    '  transition: border-color .15s, color .15s;',
    '}',
    '.jh-chip:hover { border-color: var(--gold, #D4A832); color: var(--gold, #D4A832); }',

    '#jh-disclaimer {',
    '  padding: 5px 16px; font-size: .68rem;',
    '  color: var(--text-subtle, #555);',
    '  border-top: 1px solid var(--border, #232323);',
    '  text-align: center; flex-shrink: 0;',
    '}',

    '#jh-footer {',
    '  padding: 10px 12px;',
    '  border-top: 1px solid var(--border, #232323);',
    '  display: flex; gap: 8px; align-items: flex-end;',
    '  flex-shrink: 0;',
    '}',
    '#jh-input-wrap { flex: 1; position: relative; }',
    '#jh-input {',
    '  width: 100%; box-sizing: border-box;',
    '  background: var(--surface-2, #1E1E1E);',
    '  border: 1px solid var(--border-2, #2E2E2E);',
    '  border-radius: 8px;',
    '  color: var(--text, #F0F0F0);',
    '  font-family: inherit; font-size: .875rem;',
    '  padding: 8px 12px 18px; resize: none;',
    '  min-height: 38px; max-height: 100px; line-height: 1.4;',
    '  outline: none; transition: border-color .15s;',
    '}',
    '#jh-input::placeholder { color: var(--text-subtle, #555); }',
    '#jh-input:focus { border-color: var(--brand, #1B3C87); }',
    '#jh-chars {',
    '  position: absolute; bottom: 5px; right: 10px;',
    '  font-size: .65rem; color: var(--text-subtle, #555);',
    '  pointer-events: none;',
    '}',
    '#jh-send {',
    '  width: 38px; height: 38px; flex-shrink: 0;',
    '  background: var(--brand, #1B3C87); border: none; border-radius: 8px;',
    '  color: #fff; cursor: pointer;',
    '  display: flex; align-items: center; justify-content: center;',
    '  transition: background .15s;',
    '}',
    '#jh-send:hover:not(:disabled) { background: var(--brand-light, #2550B8); }',
    '#jh-send:disabled { background: var(--surface-2, #1E1E1E); color: var(--text-subtle, #555); cursor: default; }',

    '@keyframes jh-in { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:translateY(0); } }',
    '@keyframes jh-dot { 0%,60%,100% { transform:translateY(0); } 30% { transform:translateY(-4px); } }',

    '@media (max-width: 400px) {',
    '  #jh-widget { bottom: 16px; right: 12px; }',
    '  #jh-panel  { width: calc(100vw - 24px); right: 0; }',
    '}',
  ].join('\n');

  /* ── Utils ── */
  function norm(s) {
    return s.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ').trim();
  }

  function findAnswer(query) {
    var q = norm(query);
    var best = null, bestScore = 0;
    for (var i = 0; i < faqs.length; i++) {
      var faq = faqs[i];
      var score = 0;
      for (var j = 0; j < faq.keywords.length; j++) {
        if (q.indexOf(norm(faq.keywords[j])) !== -1) score++;
      }
      if (score > bestScore) { bestScore = score; best = faq; }
    }
    return bestScore > 0 ? best.respuesta : null;
  }

  function rateOk() {
    var now = Date.now();
    msgTimes = msgTimes.filter(function (t) { return now - t < CFG.rateWindowMs; });
    if (msgTimes.length >= CFG.rateMax) return false;
    msgTimes.push(now);
    return true;
  }

  /* ── DOM helpers ── */
  function el(tag, attrs, html) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    }
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  function addBubble(msgs, text, type) {
    var div = el('div', { class: 'jh-bubble ' + type }, text);
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
  }

  function showTyping(msgs) {
    var dot = el('div', { class: 'jh-typing' }, '<span></span><span></span><span></span>');
    msgs.appendChild(dot);
    msgs.scrollTop = msgs.scrollHeight;
    return dot;
  }

  function addChips(msgs, onPick) {
    var wrap = el('div', { class: 'jh-chips' });
    faqs.slice(0, 4).forEach(function (faq) {
      var label = faq.pregunta.length > 42 ? faq.pregunta.slice(0, 40) + '…' : faq.pregunta;
      var btn = el('button', { class: 'jh-chip' }, label);
      btn.addEventListener('click', function () {
        wrap.remove();
        onPick(faq.pregunta);
      });
      wrap.appendChild(btn);
    });
    msgs.appendChild(wrap);
    msgs.scrollTop = msgs.scrollHeight;
  }

  /* ── Build widget DOM ── */
  function buildUI() {
    var style = el('style', {}, CSS);
    document.head.appendChild(style);

    var root = el('div', { id: 'jh-widget' });

    var panel = el('div', { id: 'jh-panel', role: 'dialog', 'aria-label': 'Chat Jhugo3D', 'aria-hidden': 'true' });
    panel.innerHTML = [
      '<div id="jh-header">',
      '  <div>',
      '    <div class="jh-brand">Jhugo<em>3D</em></div>',
      '    <span class="jh-status">&#9679; Respuesta automática</span>',
      '  </div>',
      '  <button id="jh-close-btn" aria-label="Cerrar chat">✕</button>',
      '</div>',
      '<div id="jh-messages"></div>',
      '<div id="jh-disclaimer">Respuestas automáticas orientativas.</div>',
      '<div id="jh-footer">',
      '  <div id="jh-input-wrap">',
      '    <textarea id="jh-input" placeholder="Escribe tu pregunta…" maxlength="' + CFG.maxChars + '" rows="1" aria-label="Pregunta"></textarea>',
      '    <span id="jh-chars">0/' + CFG.maxChars + '</span>',
      '  </div>',
      '  <button id="jh-send" aria-label="Enviar" disabled>',
      '    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">',
      '      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
      '    </svg>',
      '  </button>',
      '</div>',
    ].join('');

    var btn = el('button', { id: 'jh-btn', 'aria-label': 'Abrir chat' });
    btn.innerHTML = [
      '<svg class="jh-ico-chat" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
      '  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
      '</svg>',
      '<svg class="jh-ico-close" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">',
      '  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
      '</svg>',
    ].join('');

    root.appendChild(panel);
    root.appendChild(btn);
    document.body.appendChild(root);

    return {
      root: root,
      panel: panel,
      btn: btn,
      msgs: panel.querySelector('#jh-messages'),
      input: panel.querySelector('#jh-input'),
      send: panel.querySelector('#jh-send'),
      closeBtn: panel.querySelector('#jh-close-btn'),
      chars: panel.querySelector('#jh-chars'),
    };
  }

  /* ── Core logic ── */
  function handleQuery(text, ui) {
    text = text.trim();
    if (!text) return;
    if (!rateOk()) {
      addBubble(ui.msgs, 'Demasiadas preguntas seguidas. Espera un momento antes de continuar.', 'jh-bot');
      return;
    }

    addBubble(ui.msgs, text, 'jh-user');
    ui.input.value = '';
    ui.input.style.height = 'auto';
    ui.chars.textContent = '0/' + CFG.maxChars;
    ui.send.disabled = true;

    var typing = showTyping(ui.msgs);

    setTimeout(function () {
      typing.remove();
      var answer = findAnswer(text);
      addBubble(ui.msgs, answer || CFG.fallback, 'jh-bot');
      ui.send.disabled = false;
      ui.input.focus();
    }, CFG.typingMs);
  }

  function toggle(open, ui) {
    isOpen = open;
    ui.root.classList.toggle('jh-open', isOpen);
    ui.panel.setAttribute('aria-hidden', String(!isOpen));
    ui.btn.setAttribute('aria-label', isOpen ? 'Cerrar chat' : 'Abrir chat');
    if (isOpen) setTimeout(function () { ui.input.focus(); }, 220);
  }

  /* ── Init ── */
  function init() {
    var ui = buildUI();

    fetch(CFG.faqsUrl)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        faqs = data;
        addBubble(ui.msgs, '¡Hola! Soy el asistente de Jhugo3D. ¿En qué puedo ayudarte?', 'jh-bot');
        if (faqs.length) {
          addChips(ui.msgs, function (q) { handleQuery(q, ui); });
        }
      })
      .catch(function () {
        addBubble(ui.msgs, '¡Hola! Soy el asistente de Jhugo3D. Escríbeme tu pregunta.', 'jh-bot');
      });

    ui.btn.addEventListener('click', function () { toggle(!isOpen, ui); });
    ui.closeBtn.addEventListener('click', function () { toggle(false, ui); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) toggle(false, ui);
    });

    ui.input.addEventListener('input', function () {
      var len = ui.input.value.length;
      ui.chars.textContent = len + '/' + CFG.maxChars;
      ui.send.disabled = len === 0;
      ui.input.style.height = 'auto';
      ui.input.style.height = Math.min(ui.input.scrollHeight, 100) + 'px';
    });

    ui.input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!ui.send.disabled) handleQuery(ui.input.value, ui);
      }
    });

    ui.send.addEventListener('click', function () {
      handleQuery(ui.input.value, ui);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
