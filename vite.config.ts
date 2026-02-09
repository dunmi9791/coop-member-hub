import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
     proxy: {
      '/web': {
        target: 'http://41.78.157.36:8069', 
        changeOrigin: true,
        secure: false,
      },
      '/api/portal': {
        target: 'http://41.78.157.36:8069', 
        changeOrigin: true,
        secure: false,
      },
      '/odoo/api': {
        target: 'http://41.78.157.36:8069', 
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/odoo/, ''),
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
