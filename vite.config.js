import reactRefresh from '@vitejs/plugin-react-refresh'

import { defineConfig } from 'vite'

/**
 * https://vitejs.dev/config/
 * @type { import('vite').UserConfig }
 */
export default defineConfig({
  plugins: [reactRefresh()],
  define: {
    'process.env': {},
  },
})
