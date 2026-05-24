import { signInWithEmail, signUpWithEmail } from "./actions";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center px-6 py-10">
      <div className="w-full max-w-md rounded-lg border border-[var(--line)] bg-white p-6">
        <h1 className="text-2xl font-semibold">Sign in to SaaS Mass</h1>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Use Supabase email auth locally, then add OAuth providers from the Supabase dashboard.
        </p>

        {params.error ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {params.error}
          </div>
        ) : null}

        <form className="mt-6 grid gap-4" action={signInWithEmail}>
          <label className="grid gap-2 text-sm font-medium">
            Email
            <input
              className="focus-ring rounded-md border border-[var(--line)] px-3 py-2"
              name="email"
              type="email"
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Password
            <input
              className="focus-ring rounded-md border border-[var(--line)] px-3 py-2"
              minLength={8}
              name="password"
              type="password"
              required
            />
          </label>
          <button className="focus-ring rounded-md bg-[var(--accent)] px-4 py-2 font-semibold text-white">
            Sign in
          </button>
          <button
            className="focus-ring rounded-md border border-[var(--line)] px-4 py-2 font-semibold"
            formAction={signUpWithEmail}
          >
            Create account with the entered email and password
          </button>
        </form>
      </div>
    </main>
  );
}
