// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
// Actualizar `site` con tu dominio final si usas uno personalizado en Cloudflare
export default defineConfig({
  site: 'https://ibm-joven-web.jonbennettpy.workers.dev',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});
