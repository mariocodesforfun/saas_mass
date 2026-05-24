import { AppShell } from "@/components/app-shell";
import { StatCard } from "@/components/stat-card";
import { getActiveOrganization, requireUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireUser();
  const membership = await getActiveOrganization(user.id);
  const organization = Array.isArray(membership?.organizations)
    ? membership?.organizations[0]
    : membership?.organizations;

  return (
    <AppShell>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--accent-strong)]">
          Product cockpit
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Dashboard</h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          This is the default workspace surface future product prompts should extend.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Workspace"
          value={organization?.name ?? "Personal"}
          detail="Created automatically during onboarding or seed setup."
        />
        <StatCard label="Role" value={membership?.role ?? "owner"} detail="Use roles for product permissions." />
        <StatCard label="Plan" value="Free" detail="Stripe webhooks keep plan state synchronized." />
      </div>

      <section className="mt-8 rounded-lg border border-[var(--line)] bg-white p-6">
        <h2 className="text-xl font-semibold">Next product module</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
          Product-specific dashboards, tables, forms, jobs, and API calls should start here after
          the product spec is filled out.
        </p>
      </section>
    </AppShell>
  );
}
