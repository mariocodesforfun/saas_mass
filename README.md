# SaaS Mass

Railway-first SaaS factory for building new products quickly with Codex or Claude Code.

## Stack

- `apps/web`: Next.js App Router, TypeScript, Supabase Auth, Stripe billing UI hooks
- `apps/api`: FastAPI service for Python-heavy product logic, workers, and integrations
- `supabase`: Postgres migrations, RLS policies, seed data
- `agents`: operating manuals for coding agents
- `specs`: product spec template for new ideas

## Local Setup

1. Copy env files:

```bash
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
```

2. Install JavaScript dependencies:

```bash
npm install
```

3. Create the Python API environment:

```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

4. Run Supabase locally:

```bash
supabase start
supabase db reset
```

5. Run the app:

```bash
npm run dev
```

In another terminal:

```bash
cd apps/api
uvicorn app.main:app --reload --port 8000
```

## Deployment

Default target is Railway:

- `web`: deploys `apps/web`
- `api`: deploys `apps/api`
- optional `worker`: reuse `apps/api` with a worker command

Supabase owns auth, Postgres, storage, and RLS. Stripe owns billing truth, mirrored into Postgres through webhook handlers.

## Building a New SaaS

1. Fill out `specs/product.md`.
2. Ask Codex or Claude Code to follow `AGENTS.md`.
3. Keep platform primitives stable unless the product genuinely requires a new primitive.
