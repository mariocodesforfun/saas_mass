import Link from "next/link";
import { CreditCard, LayoutDashboard, Settings } from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/settings/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-[var(--line)] bg-white p-5 md:block">
        <Link href="/dashboard" className="text-lg font-semibold">
          SaaS Mass
        </Link>
        <nav className="mt-8 grid gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[var(--muted)] hover:bg-[var(--background)] hover:text-[var(--foreground)]"
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="md:pl-64">
        <header className="sticky top-0 z-10 border-b border-[var(--line)] bg-white/90 px-6 py-4 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <div className="font-semibold">Workspace</div>
            <form action="/auth/sign-out" method="post">
              <button className="focus-ring rounded-md border border-[var(--line)] px-3 py-2 text-sm font-medium">
                Sign out
              </button>
            </form>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
