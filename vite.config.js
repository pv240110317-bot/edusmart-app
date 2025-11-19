import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
    extensions: ['.js', '.jsx', '.json'],
  },
  server: {
    port: 5173,
    host: '0.0.0.0', // Permite acceso desde cualquier IP (móvil)
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Mantener console para depuración
        drop_debugger: true,
        pure_funcs: [], // No eliminar funciones puras que puedan ser necesarias
      },
      format: {
        comments: false,
      },
      mangle: {
        toplevel: false, // No ofuscar a nivel superior para evitar problemas con React
        properties: {
          regex: /^_/,
        },
        reserved: ['React', 'ReactDOM', 'ReactCurrentOwner'], // Reservar nombres de React
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Separar React y sus dependencias en un chunk separado
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            return 'vendor';
          }
        },
        // Mantener nombres más legibles para depuración
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    sourcemap: false, // Desactivar source maps para mayor seguridad
    chunkSizeWarningLimit: 1000,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
})

