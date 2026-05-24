# Architecture

## Services

- `apps/web`: customer-facing app, auth UI, dashboard shell, billing routes, Stripe webhook.
- `apps/api`: Python API for workloads that should not live in the web app.
- `supabase`: auth, Postgres, storage, migrations, RLS.

## Request Flow

1. User authenticates through Supabase in the web app.
2. Web app reads tenant data through Supabase with RLS.
3. Web app calls Python API with the Supabase access token when a feature needs Python.
4. Python verifies the Supabase JWT, checks membership, and performs the task.
5. Stripe webhooks update `subscriptions`, and both web/API use that mirrored state.

## Tenant Model

Every user belongs to one or more organizations through `memberships`.
Product tables should use this shape:

```sql
create table public.example_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  name text not null,
  created_at timestamptz not null default now()
);
```

Enable RLS and gate rows with `public.is_org_member(organization_id)`.
