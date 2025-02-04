import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['regenerator-runtime']
  },
  build: {
    // Adjust chunk size warning limit
    chunkSizeWarningLimit: 1000, // increases the warning threshold to 1MB
    rollupOptions: {
      output: {
        // Manual chunking to split vendor libraries
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor' // Bundle all node_modules into a separate chunk
          }
        }
      }
    }
  },
  // Add logging to help troubleshoot build issues
  logLevel: 'info',
  onwarn(warning, warn) {
    // Ignore certain warnings
    if (warning.code === 'THIS_IS_UNDEFINED') {
      return;
    }
    // Log other warnings
    warn(warning);
  }
})

