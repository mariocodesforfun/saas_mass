# Agent Operating Manual

This repo is a SaaS factory. Prefer extending product modules over modifying platform primitives.

## Default Architecture

- Next.js in `apps/web` owns UI, server actions, webhooks, and dashboard flows.
- FastAPI in `apps/api` owns Python-heavy product logic, async jobs, integrations, and AI/data workflows.
- Supabase owns auth, Postgres, storage, and row-level security.
- Stripe owns billing truth. Subscription state is mirrored into Postgres.
- Railway is the default deploy target for web, API, workers, and cron.

## Build Rules

- Read `specs/product.md` before building product features.
- Add product database changes as SQL migrations in `supabase/migrations`.
- Every tenant-owned table must include `organization_id`.
- Every tenant-owned table must enable RLS and restrict access through `memberships`.
- Use `apps/web/lib/entitlements.ts` for plan gates.
- Use `apps/web/lib/supabase/server.ts` for privileged server reads.
- Use `apps/api/app/core/auth.py` to verify Supabase JWTs in Python.
- Do not read `SUPABASE_SERVICE_ROLE_KEY` in browser code.
- Keep generated product code inside clear feature folders or route groups.

## Completion Checklist

- Database migration added for new persistent data.
- RLS policy added for every new tenant-owned table.
- Web UI has loading, empty, and error states.
- Billing-sensitive actions call entitlement helpers.
- API endpoints verify JWT and organization membership.
- Typecheck and tests run, or the reason they cannot run is reported.
