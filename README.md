# Global Research Centre

**Global Research Centre – Empowering Researchers Worldwide**

Official platform for GRC workshops, research publication, partner universities, and co-branded certificates.

## Repository

| Path | Role |
| --- | --- |
| `apps/web` | Public website (React + Vite) |
| `apps/pocketbase` | Backend (PocketBase v0.36.7) |

The PocketBase binary and local database are **not** stored in Git. The backend Dockerfile downloads PocketBase at build time. Persist data with a volume on `/data`.

## Railway (two services, same repo)

### 1. Backend

- Root directory: `apps/pocketbase`
- Dockerfile is included
- Add a volume mounted at `/data`
- Generate a public domain, then open `/_/` to create the admin account

### 2. Website

- Root directory: `apps/web`
- Build: `npm install && npm run build`
- Start: `npx vite preview --outDir ../../dist/apps/web --host 0.0.0.0 --port $PORT`
- Add variable `VITE_POCKETBASE_URL` = your backend public URL (no trailing slash)

Then reconnect the website in PocketBase settings if the frontend still points at `/hcgi/platform`.

## Local development

```bash
cd apps/pocketbase
bash scripts/setup.sh
npm run dev
```

Admin UI: http://127.0.0.1:8090/_/

```bash
cd apps/web
npm install
npm run dev
```
