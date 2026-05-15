import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://jhugo3d.com',
  base: '/',
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
