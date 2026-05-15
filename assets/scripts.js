document.addEventListener('DOMContentLoaded', function () {
  var menuToggle = document.querySelector('.menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      var expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      mobileMenu.hidden = expanded;
    });
  }

  var filterButtons = document.querySelectorAll('[data-filter]');
  var productGrid = document.getElementById('product-grid');
  var emptyMsg = document.getElementById('empty-msg');

  function applyFilters() {
    if (!productGrid) return;
    var visible = 0;
    Array.from(productGrid.querySelectorAll('.product-item')).forEach(function (item) {
      var category = item.dataset.cat || 'todos';
      var price = Number(item.dataset.precio || 0);
      var show = true;
      var categoryFilter = document.querySelector('[data-filter="cat"].active');
      var priceFilter = document.querySelector('[data-filter="price"].active');

      if (categoryFilter && categoryFilter.dataset.value !== 'todos') {
        show = show && category === categoryFilter.dataset.value;
      }
      if (priceFilter && priceFilter.dataset.value !== 'todos') {
        var parts = priceFilter.dataset.value.split('-').map(Number);
        show = show && price >= parts[0] && price <= parts[1];
      }
      item.classList.toggle('hidden', !show);
      if (show) visible += 1;
    });
    if (emptyMsg) emptyMsg.hidden = visible > 0;
  }

  if (filterButtons.length && productGrid) {
    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var siblings = button.closest('.filter-btns');
        if (siblings) {
          siblings.querySelectorAll('[data-filter]').forEach(function (sibling) {
            sibling.classList.remove('active');
          });
        }
        button.classList.add('active');
        applyFilters();
      });
    });

    var resetButton = document.getElementById('reset-filters');
    if (resetButton) {
      resetButton.addEventListener('click', function () {
        document.querySelectorAll('[data-filter="cat"]').forEach(function (btn) {
          btn.classList.toggle('active', btn.dataset.value === 'todos');
        });
        document.querySelectorAll('[data-filter="price"]').forEach(function (btn) {
          btn.classList.toggle('active', btn.dataset.value === 'todos');
        });
        applyFilters();
      });
    }
  }

  var noteButtons = document.querySelectorAll('.nota-toggle');
  noteButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var wrap = btn.closest('.card-nota-wrap');
      if (!wrap) return;
      var input = wrap.querySelector('.nota-input');
      var open = btn.getAttribute('aria-expanded') === 'true';
      if (input) {
        input.hidden = open;
        if (!open) input.focus();
      }
      btn.setAttribute('aria-expanded', String(!open));
      btn.textContent = open ? (btn.dataset.labelOpen || '✎ Personalizar') : (btn.dataset.labelClose || '✕ Cerrar personalización');
    });
  });
});
