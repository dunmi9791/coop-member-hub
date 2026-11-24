# NLNG Cooperative Member Portal

Member-facing web portal for the NLNG Staff Cooperative. It talks to the Odoo
backend through the `/api/portal/*`, `/web/session/*` and `/odoo/api/*` routes.

Built with Vite, TypeScript, React, shadcn-ui and Tailwind CSS.

## Local development

Requires Node.js 20+ and npm.

```sh
npm install
cp .env.example .env   # then set ODOO_TARGET to your Odoo server
npm run dev            # http://localhost:8080
```

`ODOO_TARGET` is the Odoo URL the dev server proxies to, for example
`http://127.0.0.1:8079` for a local Odoo. It can also be set in the shell:
`ODOO_TARGET=http://127.0.0.1:8079 npm run dev`.

## Production (Docker)

The image builds the static app and serves it with nginx, which proxies the
Odoo routes to `ODOO_TARGET` (read when the container starts):

```sh
docker build -t coop-member-hub .
docker run -p 80:80 -e ODOO_TARGET=http://your-odoo:8069 coop-member-hub
```
