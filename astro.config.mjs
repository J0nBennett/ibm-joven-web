// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
// Actualizar `site` con tu dominio final si usas uno personalizado en Cloudflare
export default defineConfig({
  site: 'https://ibm-joven-web.jonbennettpy.workers.dev',
  vite: {
    plugins: [tailwindcss()]
  }
});