import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://jhugo3d.es',
  image: {
    remotePatterns: [{ protocol: 'https' }],
  },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'ca', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
