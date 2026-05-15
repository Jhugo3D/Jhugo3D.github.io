(function () {
  if ('ontouchstart' in window) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:99999';
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  window.addEventListener('resize', function () {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  var COLORS = ['#D4A832', '#F0C040', '#B8850A', '#E8C060', '#2550B8', '#EFEFEF'];
  var particles = [];
  var lastX = -99, lastY = -99, lastTime = 0;

  window.addEventListener('mousemove', function (e) {
    var now = Date.now();
    if (now - lastTime < 20) return;
    lastTime = now;

    var dx = e.clientX - lastX, dy = e.clientY - lastY;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 5) return;
    lastX = e.clientX;
    lastY = e.clientY;

    var count = dist > 30 ? 3 : dist > 12 ? 2 : 1;
    for (var i = 0; i < count; i++) {
      particles.push({
        x:     e.clientX + (Math.random() - 0.5) * 10,
        y:     e.clientY + (Math.random() - 0.5) * 10,
        size:  Math.random() * 3.5 + 1.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 0.85 + Math.random() * 0.15,
        vx:   (Math.random() - 0.5) * 0.8,
        vy:   (Math.random() - 0.2) * 1.2,
        decay: 0.025 + Math.random() * 0.025,
      });
    }
  });

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.alpha -= p.decay;
      p.x += p.vx;
      p.y += p.vy;
      if (p.alpha <= 0) { particles.splice(i, 1); continue; }
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle   = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), Math.ceil(p.size), Math.ceil(p.size));
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }
  loop();
})();
