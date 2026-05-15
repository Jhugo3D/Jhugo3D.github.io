---
layout: default
title: Catálogo
description: "48 diseños disponibles desde 3€. Joyería, figuras, soportes y marcos impresos en 3D."
---

<section class="section">
  <div class="container">
    <p class="eyebrow">Diseños disponibles</p>
    <h1>Catálogo</h1>
    <p class="hero-copy">Todo lo que ves está disponible. Escríbenos para pedir cualquier modelo o personalizarlo a tu medida.</p>

    <div class="catalog-intro">
      <p>Selecciona una categoría y descubre piezas únicas en 3D. Si necesitas ayuda, puedes escribirnos directamente desde la página de contacto.</p>
    </div>

    <div class="product-grid">
      {% for product in site.productos %}
      <article class="product-card">
        <a href="{{ product.url }}">
          <img src="{{ product.imagen }}" alt="{{ product.nombre }}" />
          <div class="product-card-body">
            <p class="eyebrow">{{ site.data.categories[product.categoria] | default: product.categoria }}</p>
            <h2>{{ product.nombre }}</h2>
            <p class="product-desc">{{ product.descripcion }}</p>
            <div class="product-meta">
              <span class="product-price">{{ product.precioTexto }}</span>
            </div>
          </div>
        </a>
      </article>
      {% endfor %}
    </div>
  </div>
</section>
