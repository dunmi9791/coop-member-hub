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
        target: 'https://nlngcoop.cooplatform.com.ng',
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: '',
      },
      '/api/portal': {
        target: 'https://nlngcoop.cooplatform.com.ng',
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: '',
      },
      '/odoo/api': {
        target: 'https://nlngcoop.cooplatform.com.ng',
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: '',
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
