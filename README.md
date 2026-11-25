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

`VITE_ODOO_DB` is the Odoo database members log in to. It is compiled into
the app, so restart `npm run dev` (or rebuild) after changing it.

`ODOO_TARGET` is the Odoo URL the dev server proxies to, for example
`http://127.0.0.1:8079` for a local Odoo. It can also be set in the shell:
`ODOO_TARGET=http://127.0.0.1:8079 npm run dev`.

## Production (Docker)

The image builds the static app and serves it with nginx, which proxies the
Odoo routes to `ODOO_TARGET` (read when the container starts). The database
name is set at build time with `--build-arg VITE_ODOO_DB=...`:

```sh
docker build -t coop-member-hub --build-arg VITE_ODOO_DB=ngml_corp .
docker run -p 80:80 -e ODOO_TARGET=http://your-odoo:8069 coop-member-hub
```
