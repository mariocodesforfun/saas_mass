create extension if not exists pgcrypto;

create type public.membership_role as enum ('owner', 'admin', 'member');
create type public.subscription_status as enum (
  'incomplete',
  'trialing',
  'active',
  'past_due',
  'canceled',
  'unpaid',
  'paused'
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.membership_role not null default 'member',
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  email text not null,
  role public.membership_role not null default 'member',
  token text not null unique default encode(gen_random_bytes(24), 'hex'),
  invited_by uuid references auth.users(id) on delete set null,
  accepted_at timestamptz,
  expires_at timestamptz not null default now() + interval '7 days',
  created_at timestamptz not null default now()
);

create table public.subscriptions (
  organization_id uuid primary key references public.organizations(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  stripe_price_id text,
  plan_key text not null default 'free',
  status public.subscription_status not null default 'incomplete',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.usage_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  event_name text not null,
  quantity integer not null default 1,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_type text,
  target_id text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger organizations_touch_updated_at
before update on public.organizations
for each row execute function public.touch_updated_at();

create trigger subscriptions_touch_updated_at
before update on public.subscriptions
for each row execute function public.touch_updated_at();

create or replace function public.is_org_member(org_id uuid, required_roles public.membership_role[] default null)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.memberships
    where organization_id = org_id
      and user_id = auth.uid()
      and (required_roles is null or role = any(required_roles))
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  org_id uuid;
  org_name text;
  org_slug text;
begin
  org_name := coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1), 'Workspace');
  org_slug := lower(regexp_replace(org_name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(new.id::text, 1, 8);

  insert into public.organizations (name, slug, created_by)
  values (org_name, org_slug, new.id)
  returning id into org_id;

  insert into public.memberships (organization_id, user_id, role)
  values (org_id, new.id, 'owner');

  insert into public.subscriptions (organization_id, plan_key, status)
  values (org_id, 'free', 'incomplete');

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.organizations enable row level security;
alter table public.memberships enable row level security;
alter table public.invitations enable row level security;
alter table public.subscriptions enable row level security;
alter table public.usage_events enable row level security;
alter table public.audit_logs enable row level security;

create policy "members can view organizations"
on public.organizations for select
using (public.is_org_member(id));

create policy "owners and admins can update organizations"
on public.organizations for update
using (public.is_org_member(id, array['owner', 'admin']::public.membership_role[]))
with check (public.is_org_member(id, array['owner', 'admin']::public.membership_role[]));

create policy "members can view memberships"
on public.memberships for select
using (public.is_org_member(organization_id));

create policy "owners and admins manage memberships"
on public.memberships for all
using (public.is_org_member(organization_id, array['owner', 'admin']::public.membership_role[]))
with check (public.is_org_member(organization_id, array['owner', 'admin']::public.membership_role[]));

create policy "owners and admins manage invitations"
on public.invitations for all
using (public.is_org_member(organization_id, array['owner', 'admin']::public.membership_role[]))
with check (public.is_org_member(organization_id, array['owner', 'admin']::public.membership_role[]));

create policy "members can view subscriptions"
on public.subscriptions for select
using (public.is_org_member(organization_id));

create policy "members can view usage"
on public.usage_events for select
using (public.is_org_member(organization_id));

create policy "members can insert usage"
on public.usage_events for insert
with check (public.is_org_member(organization_id));

create policy "members can view audit logs"
on public.audit_logs for select
using (public.is_org_member(organization_id));

create policy "members can insert audit logs"
on public.audit_logs for insert
with check (public.is_org_member(organization_id));

create index memberships_user_id_idx on public.memberships(user_id);
create index invitations_organization_id_idx on public.invitations(organization_id);
create index usage_events_organization_created_idx on public.usage_events(organization_id, created_at desc);
create index audit_logs_organization_created_idx on public.audit_logs(organization_id, created_at desc);
