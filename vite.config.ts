import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Override with ODOO_TARGET=http://127.0.0.1:8079 to develop against a local Odoo
const ODOO_TARGET = process.env.ODOO_TARGET || "http://41.78.157.36:8069";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
     proxy: {
      // Only the Odoo /web endpoints the portal needs (mirrors nginx.conf)
      '^/web/(session/(authenticate|get_session_info|destroy)|image/|content/)': {
        target: ODOO_TARGET,
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: '',
      },
      '/api/portal': {
        target: ODOO_TARGET,
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: '',
      },
      '/odoo/api': {
        target: ODOO_TARGET,
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
