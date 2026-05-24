import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";

export default async function BillingPage() {
  await requireUser();

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Billing</h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          Stripe checkout, customer portal, and webhook sync are wired as platform primitives.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <form action="/api/billing/checkout" method="post" className="rounded-lg border border-[var(--line)] bg-white p-6">
          <h2 className="text-xl font-semibold">Pro</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Team invites, API access, and higher product limits.
          </p>
          <button className="focus-ring mt-6 rounded-md bg-[var(--accent)] px-4 py-2 font-semibold text-white">
            Start checkout
          </button>
        </form>
        <form action="/api/billing/portal" method="post" className="rounded-lg border border-[var(--line)] bg-white p-6">
          <h2 className="text-xl font-semibold">Customer portal</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Let customers manage payment methods, invoices, and cancellations.
          </p>
          <button className="focus-ring mt-6 rounded-md border border-[var(--line)] px-4 py-2 font-semibold">
            Open portal
          </button>
        </form>
      </div>
    </AppShell>
  );
}
