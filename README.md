# Portfolio

A modern backend-focused portfolio with:
- Public portfolio page
- Liquid glass UI
- Real light/dark themes
- Professional color palettes
- Browser language detection
- Manual language and theme controls
- Admin dashboard
- Project CRUD
- Contact inbox
- Redis-backed preferences and rate limit
- PostgreSQL + Prisma

## Run locally

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env`

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

CMD:

```cmd
copy .env.example .env
```

Linux/macOS/Git Bash:

```bash
cp .env.example .env
```

### 3. Start PostgreSQL and Redis

```bash
docker compose up -d
```

### 4. Create database tables

```bash
npm run prisma:migrate
```

### 5. Seed demo data

```bash
npm run seed
```

### 6. Run app

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

Admin:

```txt
http://localhost:3000/admin
```

Default admin credentials are configured in `.env`.

## Admin

Use:

```txt
ADMIN_EMAIL
ADMIN_PASSWORD
```

The admin session uses a signed JWT stored in an HTTP-only cookie.

## Contact anti-flood

The contact form uses Redis to block repeated submissions from the same IP/email for the configured cooldown.
If Redis is unavailable, the database fallback blocks repeated messages from the same email/IP in the same window.
