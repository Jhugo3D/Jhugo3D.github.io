---
layout: default
title: Jhugo3D
description: "Impresión 3D personalizada de piezas únicas desde Reus. Catálogo, personalizados y pedidos rápidos."
---

<section class="hero">
  <video class="hero-video" src="/video/hero.mp4" autoplay loop muted playsinline preload="auto"></video>
  <div class="hero-overlay"></div>

  <div class="hero-stars" aria-hidden="true"></div>

  <div class="container hero-content">
    <span class="eyebrow hero-eyebrow">Impresión 3D · Reus</span>
    <h1 class="hero-title">
      Imprime lo<br />
      <span class="text-gold">que imaginas.</span>
    </h1>
    <p class="hero-sub">
      Piezas únicas impresas bajo demanda. Diseños del catálogo o a medida — nada es imposible, solo tienes que creerlo.
    </p>
    <div class="hero-actions">
      <a href="/catalogo/" class="btn btn-primary">Ver catálogo →</a>
      <a href="/personalizado/" class="btn btn-outline">Pedir personalizado</a>
    </div>
  </div>
</section>

<div class="marquee-outer" aria-hidden="true">
  <div class="marquee-track">
    <span class="marquee-item">Impresión 3D</span><span class="marquee-sep">✦</span>
    <span class="marquee-item">Reus, Tarragona</span><span class="marquee-sep">✦</span>
    <span class="marquee-item">PLA · PETG · Silk</span><span class="marquee-sep">✦</span>
    <span class="marquee-item">Personalizado</span><span class="marquee-sep">✦</span>
    <span class="marquee-item">48 Diseños</span><span class="marquee-sep">✦</span>
    <span class="marquee-item">Desde 3€</span><span class="marquee-sep">✦</span>
    <span class="marquee-item">Hecho a mano</span><span class="marquee-sep">✦</span>
    <span class="marquee-item">Entrega rápida</span><span class="marquee-sep">✦</span>
  </div>
</div>

<section class="section">
  <div class="container">
    <p class="eyebrow">Más populares</p>
    <h2 class="section-title">Diseños destacados</h2>
    <p class="section-sub">Una selección de piezas del catálogo, listas para pedir y con entrega rápida.</p>

    <div class="product-grid">
      {% assign destacados = site.productos | where: "destacado", true | limit: 4 %}
      {% if destacados == empty %}
        {% assign destacados = site.productos | slice: 0,4 %}
      {% endif %}
      {% for product in destacados %}
      <article class="product-card card reveal" data-categoria="{{ product.categoria }}">
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
  </div>
</section>

<section class="section how-section section--bordered">
  <div class="container">
    <p class="eyebrow">El proceso</p>
    <h2 class="section-title">Cómo trabajamos</h2>
    <p class="section-sub">Tres pasos claros para que tu diseño pase de la idea al objeto final.</p>

    <div class="steps">
      <div class="step">
        <span class="step-n">01</span>
        <h3 class="step-title">Elige o diseña</h3>
        <p class="step-desc">Explora el catálogo y encuentra tu pieza, o cuéntanos tu idea y la hacemos realidad.</p>
      </div>
      <div class="step">
        <span class="step-n">02</span>
        <h3 class="step-title">Imprimimos</h3>
        <p class="step-desc">Hugo da vida a tu diseño capa a capa con cuidado y precisión.</p>
      </div>
      <div class="step">
        <span class="step-n">03</span>
        <h3 class="step-title">Lo recibes</h3>
        <p class="step-desc">Tu pieza lista en unos días. Te ayudamos con entrega o recogida en Reus.</p>
      </div>
    </div>

    <div class="all-cta">
      <a href="/proceso/" class="btn btn-ghost">Más sobre el proceso →</a>
    </div>
  </div>
</section>

<section class="cta-banner">
  <div class="container cta-inner">
    <div class="cta-text">
      <h2>¿Tienes algo en mente?</h2>
      <p>Cuéntanos tu idea y la imprimimos. Sugerencias al DM o directamente al correo.</p>
    </div>
    <div class="cta-actions">
      <a href="/personalizado/" class="btn btn-primary">Pedir personalizado →</a>
      <a href="mailto:soportejhugo3d@gmail.com" class="btn btn-outline">Escribir email</a>
    </div>
  </div>
</section>
