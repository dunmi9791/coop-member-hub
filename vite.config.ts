import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Odoo backend the dev proxy forwards to. Set ODOO_TARGET in the shell or in
  // .env / .env.local (e.g. ODOO_TARGET=http://127.0.0.1:8079 for a local Odoo).
  // No VITE_ prefix, so it stays server-side and never ends up in the bundle.
  const env = loadEnv(mode, process.cwd(), "");
  const ODOO_TARGET = process.env.ODOO_TARGET || env.ODOO_TARGET;
  if (!ODOO_TARGET && mode === "development") {
    throw new Error("ODOO_TARGET is not set. Add it to .env (see .env.example).");
  }

  return {
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
};
});
