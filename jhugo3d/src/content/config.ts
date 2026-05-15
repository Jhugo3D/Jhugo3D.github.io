import { defineCollection, z } from 'astro:content';

const productos = defineCollection({
  type: 'content',
  schema: z.object({
    nombre: z.string(),
    precio: z.number(),
    precioTexto: z.string(),
    precioVariante: z.string().optional(),
    categoria: z.enum(['joyeria', 'soportes', 'figuras', 'marcos', 'decoracion']),
    imagen: z.string(),
    descripcion: z.string().optional(),
    destacado: z.boolean().default(false),
  }),
});

export const collections = { productos };
