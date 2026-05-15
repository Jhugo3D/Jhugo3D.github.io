---
layout: default
title: Catálogo
description: "48 diseños disponibles desde 3€. Joyería, figuras, soportes, marcos y decoración para impresión 3D."
---

<section class="section">
  <div class="container">
    <p class="eyebrow">Diseños disponibles</p>
    <h1>Catálogo</h1>
    <p class="section-sub">Todo lo que ves está disponible. Escríbenos para pedir cualquier modelo o personalizarlo.</p>

    <div class="filters">
      <div class="filter-group">
        <span class="filter-label">Categoría</span>
        <div class="filter-btns" id="cat-filter">
          <button class="filter-btn active" data-filter="cat" data-value="todos">Todos</button>
          <button class="filter-btn" data-filter="cat" data-value="joyeria">Joyería</button>
          <button class="filter-btn" data-filter="cat" data-value="soportes">Soportes</button>
          <button class="filter-btn" data-filter="cat" data-value="figuras">Figuras</button>
          <button class="filter-btn" data-filter="cat" data-value="marcos">Marcos</button>
          <button class="filter-btn" data-filter="cat" data-value="decoracion">Decoración</button>
        </div>
      </div>

      <div class="filter-group">
        <span class="filter-label">Precio</span>
        <div class="filter-btns" id="price-filter">
          <button class="filter-btn active" data-filter="price" data-value="todos">Todos los precios</button>
          <button class="filter-btn" data-filter="price" data-value="0-6">3€ – 6€</button>
          <button class="filter-btn" data-filter="price" data-value="7-15">7€ – 15€</button>
          <button class="filter-btn" data-filter="price" data-value="16-99">16€ – 99€</button>
        </div>
      </div>
    </div>

    <div class="product-grid" id="product-grid">
      {% for product in site.productos %}
      <article class="product-card card product-item" data-cat="{{ product.categoria }}" data-precio="{{ product.precio }}">
        <a href="{{ product.url }}" class="card-link">
          <div class="card-img-wrap">
            <img src="{{ product.imagen }}" alt="{{ product.nombre }}" loading="lazy" decoding="async" />
            {% if product.destacado %}
            <span class="card-badge badge badge-gold">Destacado</span>
            {% endif %}
          </div>
          <div class="card-body">
            <span class="card-cat badge">{{ site.data.categories[product.categoria] | default: product.categoria }}</span>
            <h3 class="card-name">{{ product.nombre }}</h3>
            <div class="card-price">
              <span class="price-num">{{ product.precioTexto }}</span>
              {% if product.precioVariante %}
              <span class="price-variant">{{ product.precioVariante }}</span>
              {% endif %}
            </div>
          </div>
        </a>
        <div class="card-nota-wrap">
          <button class="nota-toggle" type="button" aria-expanded="false" data-label-open="✎ Personalizar" data-label-close="✕ Cerrar personalización">✎ Personalizar</button>
          <textarea class="nota-input" placeholder="Color, texto, nombre, tamaño..." rows="2" hidden></textarea>
        </div>
        <button class="jh-add-btn" data-slug="{{ product.slug | default: product.basename }}" data-nombre="{{ product.nombre }}" data-precio="{{ product.precio }}" data-preciotexto="{{ product.precioTexto | default: product.precio }}" data-imagen="{{ product.imagen }}">+ Añadir al carrito</button>
      </article>
      {% endfor %}
    </div>

    <p class="empty-msg" id="empty-msg" hidden>No hay productos con esos filtros. <button class="btn btn-ghost" id="reset-filters">Limpiar filtros</button></p>
  </div>
</section>
