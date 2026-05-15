import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, 'src/content/productos');
mkdirSync(OUT, { recursive: true });

// Prices from Google Sites, in order (left→right, top→bottom)
const products = [
  { precio: 3,  precioTexto: '3€',  cat: 'figuras',    nombre: '[NOMBRE_PRODUCTO_01] Esfera Decorativa',         destacado: false },
  { precio: 10, precioTexto: '10€', cat: 'figuras',    nombre: '[NOMBRE_PRODUCTO_02] Esfera Decorativa Grande',   destacado: false },
  { precio: 3,  precioTexto: '3€',  cat: 'figuras',    nombre: '[NOMBRE_PRODUCTO_03] Esfera Decorativa',         destacado: false },
  { precio: 10, precioTexto: '10€', cat: 'figuras',    nombre: '[NOMBRE_PRODUCTO_04] Esfera Decorativa Grande',   destacado: false },
  { precio: 10, precioTexto: '10€', cat: 'decoracion', nombre: '[NOMBRE_PRODUCTO_05] Pieza Decorativa',           destacado: false },
  { precio: 4,  precioTexto: '4€',  cat: 'joyeria',    nombre: '[NOMBRE_PRODUCTO_06] Pendientes Colgantes',       destacado: true  },
  { precio: 4,  precioTexto: '4€',  cat: 'joyeria',    nombre: '[NOMBRE_PRODUCTO_07] Pendientes Colgantes',       destacado: false },
  { precio: 10, precioTexto: '10€', cat: 'soportes',   nombre: '[NOMBRE_PRODUCTO_08] Soporte Base',               destacado: false },
  { precio: 30, precioTexto: '30€', cat: 'marcos',     nombre: '[NOMBRE_PRODUCTO_09] Marco Personalizado',        precioVariante: 'con tu foto', destacado: true },
  { precio: 30, precioTexto: '30€', cat: 'marcos',     nombre: '[NOMBRE_PRODUCTO_10] Marco Decorativo',           destacado: false },
  { precio: 4,  precioTexto: '4€',  cat: 'joyeria',    nombre: '[NOMBRE_PRODUCTO_11] Pack Pendientes Pequeños',   precioVariante: 'c/u', destacado: false },
  { precio: 10, precioTexto: '10€', cat: 'soportes',   nombre: '[NOMBRE_PRODUCTO_12] Organizador',                destacado: false },
  { precio: 10, precioTexto: '10€', cat: 'soportes',   nombre: '[NOMBRE_PRODUCTO_13] Caja Contenedor',            destacado: false },
  { precio: 15, precioTexto: '15€', cat: 'decoracion', nombre: '[NOMBRE_PRODUCTO_14] Pieza Mediana',               destacado: false },
  { precio: 4,  precioTexto: '4€',  cat: 'joyeria',    nombre: '[NOMBRE_PRODUCTO_15] Pack Charms',                precioVariante: 'c/u', destacado: false },
  { precio: 15, precioTexto: '15€', cat: 'marcos',     nombre: '[NOMBRE_PRODUCTO_16] Pieza Personalizada',        precioVariante: 'con tu foto', destacado: false },
  { precio: 10, precioTexto: '10€', cat: 'soportes',   nombre: '[NOMBRE_PRODUCTO_17] Soporte Organizador',        destacado: false },
  { precio: 10, precioTexto: '10€', cat: 'soportes',   nombre: '[NOMBRE_PRODUCTO_18] Soporte',                    destacado: false },
  { precio: 4,  precioTexto: '4€',  cat: 'decoracion', nombre: '[NOMBRE_PRODUCTO_19] Pieza Decorativa',           destacado: false },
  { precio: 4,  precioTexto: '4€',  cat: 'decoracion', nombre: '[NOMBRE_PRODUCTO_20] Pieza Decorativa',           destacado: false },
  { precio: 4,  precioTexto: '4€',  cat: 'decoracion', nombre: '[NOMBRE_PRODUCTO_21] Pieza Decorativa',           destacado: false },
  { precio: 4,  precioTexto: '4€',  cat: 'decoracion', nombre: '[NOMBRE_PRODUCTO_22] Pieza Decorativa',           destacado: false },
  { precio: 4,  precioTexto: '4€',  cat: 'decoracion', nombre: '[NOMBRE_PRODUCTO_23] Pieza Decorativa',           destacado: false },
  { precio: 4,  precioTexto: '4€',  cat: 'decoracion', nombre: '[NOMBRE_PRODUCTO_24] Pieza Decorativa',           destacado: false },
  { precio: 4,  precioTexto: '4€',  cat: 'decoracion', nombre: '[NOMBRE_PRODUCTO_25] Pieza Decorativa',           destacado: false },
  { precio: 4,  precioTexto: '4€',  cat: 'decoracion', nombre: '[NOMBRE_PRODUCTO_26] Pieza Decorativa',           destacado: false },
  { precio: 4,  precioTexto: '4€',  cat: 'decoracion', nombre: '[NOMBRE_PRODUCTO_27] Pieza Decorativa',           destacado: false },
  { precio: 10, precioTexto: '10€', cat: 'decoracion', nombre: '[NOMBRE_PRODUCTO_28] Pieza Mediana',               destacado: false },
  { precio: 4,  precioTexto: '4€',  cat: 'decoracion', nombre: '[NOMBRE_PRODUCTO_29] Pieza Decorativa',           destacado: false },
  { precio: 4,  precioTexto: '4€',  cat: 'decoracion', nombre: '[NOMBRE_PRODUCTO_30] Pieza Decorativa',           destacado: false },
  { precio: 4,  precioTexto: '4€',  cat: 'decoracion', nombre: '[NOMBRE_PRODUCTO_31] Pieza Decorativa',           destacado: false },
  { precio: 4,  precioTexto: '4€',  cat: 'decoracion', nombre: '[NOMBRE_PRODUCTO_32] Pieza Decorativa',           destacado: false },
  { precio: 4,  precioTexto: '4€',  cat: 'decoracion', nombre: '[NOMBRE_PRODUCTO_33] Pieza Decorativa',           destacado: false },
  { precio: 6,  precioTexto: '6€',  cat: 'decoracion', nombre: '[NOMBRE_PRODUCTO_34] Pieza Decorativa',           destacado: false },
  { precio: 4,  precioTexto: '4€',  cat: 'decoracion', nombre: '[NOMBRE_PRODUCTO_35] Pieza Decorativa',           destacado: false },
  { precio: 4,  precioTexto: '4€',  cat: 'decoracion', nombre: '[NOMBRE_PRODUCTO_36] Pieza Decorativa',           destacado: false },
  { precio: 4,  precioTexto: '4€',  cat: 'decoracion', nombre: '[NOMBRE_PRODUCTO_37] Pieza Decorativa',           destacado: false },
  { precio: 30, precioTexto: '30€', cat: 'figuras',    nombre: '[NOMBRE_PRODUCTO_38] Figura Grande',              destacado: true  },
  { precio: 15, precioTexto: '15€', cat: 'figuras',    nombre: '[NOMBRE_PRODUCTO_39] Figura Mediana',             destacado: false },
  { precio: 5,  precioTexto: '5€',  cat: 'decoracion', nombre: '[NOMBRE_PRODUCTO_40] Pieza Pequeña',              destacado: false },
  { precio: 4,  precioTexto: '4€',  cat: 'decoracion', nombre: '[NOMBRE_PRODUCTO_41] Pieza Decorativa',           destacado: false },
  { precio: 4,  precioTexto: '4€',  cat: 'decoracion', nombre: '[NOMBRE_PRODUCTO_42] Pieza Decorativa',           destacado: false },
  { precio: 4,  precioTexto: '4€',  cat: 'decoracion', nombre: '[NOMBRE_PRODUCTO_43] Pieza Decorativa',           destacado: false },
  { precio: 4,  precioTexto: '4€',  cat: 'decoracion', nombre: '[NOMBRE_PRODUCTO_44] Pieza Decorativa',           destacado: false },
  { precio: 20, precioTexto: '20€', cat: 'figuras',    nombre: '[NOMBRE_PRODUCTO_45] Figura Personaje',           destacado: false },
  { precio: 30, precioTexto: '30€', cat: 'figuras',    nombre: '[NOMBRE_PRODUCTO_46] Figura Premium',             destacado: false },
  { precio: 15, precioTexto: '15€', cat: 'figuras',    nombre: '[NOMBRE_PRODUCTO_47] Figura Mediana',             destacado: false },
  { precio: 5,  precioTexto: '5€',  cat: 'joyeria',    nombre: '[NOMBRE_PRODUCTO_48] Llavero',                    destacado: false },
];

products.forEach((p, i) => {
  const num = String(i + 1).padStart(2, '0');
  const slug = `p${num}`;
  const variantLine = p.precioVariante ? `\nprecioVariante: "${p.precioVariante}"` : '';
  const md = `---
nombre: "${p.nombre}"
precio: ${p.precio}
precioTexto: "${p.precioTexto}"${variantLine}
categoria: "${p.cat}"
imagen: "/img/productos/${slug}.jpg"
descripcion: "[REVISAR] Añade aquí la descripción de este producto."
destacado: ${p.destacado}
---

[REVISAR] Descripción editorial del producto. Cuéntanos qué hace especial a esta pieza, cómo se usa, para quién es ideal.
`;
  writeFileSync(join(OUT, `${slug}.md`), md);
  console.log(`  created: ${slug}.md`);
});

console.log(`\nTotal: ${products.length} productos creados en src/content/productos/`);
