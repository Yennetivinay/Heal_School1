import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Remove StrictMode in production for better performance
      jsxRuntime: 'automatic',
    }), 
    tailwindcss()
  ],
  server: {
    historyApiFallback: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['lenis'], // Lazy load Lenis
  },
  // For production build
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'framer-motion': ['framer-motion'],
          'lucide-icons': ['lucide-react'],
          'lottie': ['@lottiefiles/dotlottie-react', 'lottie-react'],
          'lenis': ['lenis'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    // Enable source maps only in dev
    sourcemap: false,
    // Optimize chunk loading
    chunkSizeWarningLimit: 600,
  }
})
