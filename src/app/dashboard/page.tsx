
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import LogoutButton from "@/components/logout-button";

export const instant = false;

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">
            Dashboard
          </h1>

          <LogoutButton />
        </div>

        <p className="mt-2 text-slate-600">
          Welcome, {session.user.name || session.user.email}!
        </p>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800">
            Travel Agency Management
          </h2>

          <p className="mt-2 text-slate-500">
            Your agency dashboard is ready.
          </p>
        </div>
      </div>
    </main>
  );
}
