// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://j0nbennett.github.io',
  base: '/ibm-joven-web',
  vite: {
    plugins: [tailwindcss()]
  }
});