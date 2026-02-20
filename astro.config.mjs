// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
// Nota: actualizar `site` con tu dominio final de Cloudflare Pages o dominio personalizado
export default defineConfig({
  site: 'https://ibm-joven-web.pages.dev',
  vite: {
    plugins: [tailwindcss()]
  }
});