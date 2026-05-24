import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";

export default async function SettingsPage() {
  await requireUser();

  return (
    <AppShell>
      <h1 className="text-3xl font-semibold">Settings</h1>
      <div className="mt-6 rounded-lg border border-[var(--line)] bg-white p-6">
        <h2 className="text-xl font-semibold">Workspace settings</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Add organization profile, member management, invites, and product-specific settings here.
        </p>
      </div>
    </AppShell>
  );
}
