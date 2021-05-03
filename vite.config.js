import reactRefresh from '@vitejs/plugin-react-refresh'

import { defineConfig } from 'vite'

import legacy from '@vitejs/plugin-legacy'

/**
 * https://vitejs.dev/config/
 * @type { import('vite').UserConfig }
 */
export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'],
      polyfills: ['es.promise.finally', 'es/map', 'es/set', 'Buffer', 'global'],
      modernPolyfills: ['es.promise.finally'],
    }),

    reactRefresh(),
  ],
  define: {
    'process.env': {},
  },
})
