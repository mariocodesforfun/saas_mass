# Database Guide

## Rules

- Add every schema change as a migration in `supabase/migrations`.
- Tenant-owned tables must include `organization_id`.
- Enable RLS on every product table.
- Prefer SQL functions for reusable permission checks.
- Use `metadata jsonb` sparingly for provider payloads and audit context, not core query fields.

## Product Table Checklist

- Primary key is `uuid default gen_random_uuid()`.
- `organization_id` references `public.organizations(id)` with cascade delete.
- `created_by` references `auth.users(id)` when ownership matters.
- `created_at` exists.
- `updated_at` exists when rows are edited.
- RLS policy allows members to select rows.
- RLS policy restricts writes to the needed roles.
