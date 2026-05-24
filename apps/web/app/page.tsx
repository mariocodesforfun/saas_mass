import Link from "next/link";
import { ArrowRight, Database, ShieldCheck, Workflow } from "lucide-react";

const pillars = [
  {
    icon: ShieldCheck,
    title: "Auth and tenants",
    body: "Supabase Auth, organizations, memberships, invites, roles, and RLS-first data access."
  },
  {
    icon: Database,
    title: "Billing and data",
    body: "Stripe subscriptions mirrored into Postgres with reusable entitlement checks."
  },
  {
    icon: Workflow,
    title: "Python ready",
    body: "FastAPI is wired for product APIs, AI workflows, data jobs, and Railway workers."
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-10">
        <nav className="mb-12 flex items-center justify-between">
          <div className="text-lg font-semibold">SaaS Mass</div>
          <Link
            className="focus-ring rounded-md border border-[var(--line)] bg-white px-4 py-2 text-sm font-medium"
            href="/login"
          >
            Sign in
          </Link>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--accent-strong)]">
              Railway-first SaaS factory
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight md:text-7xl">
              Build the product, not the platform.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              A reusable foundation for fast SaaS launches with Next.js, Supabase,
              Stripe, FastAPI, and agent instructions baked into the repo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="focus-ring inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-5 py-3 font-semibold text-white"
                href="/dashboard"
              >
                Open dashboard <ArrowRight size={18} />
              </Link>
              <Link
                className="focus-ring rounded-md border border-[var(--line)] bg-white px-5 py-3 font-semibold"
                href="/settings/billing"
              >
                Billing setup
              </Link>
            </div>
          </div>

          <div className="grid gap-3">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="rounded-lg border border-[var(--line)] bg-white p-5">
                <pillar.icon className="mb-4 text-[var(--accent-strong)]" size={24} />
                <h2 className="text-lg font-semibold">{pillar.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{pillar.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
