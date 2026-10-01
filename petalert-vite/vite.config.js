import { defineConfig } from 'vite';

export default defineConfig({
  // './' permite publicar la carpeta dist en cualquier ruta (GitHub Pages, Netlify, un subdirectorio…)
  base: './',
  server: {
    host: true,   // accesible desde el celular en la misma red
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    target: 'es2020',
    chunkSizeWarningLimit: 800, // three.js pesa ~500 kB
    rollupOptions: {
      output: {
        // three.js en su propio archivo para que el navegador lo guarde en caché
        manualChunks: { three: ['three'] }
      }
    }
  }
});
