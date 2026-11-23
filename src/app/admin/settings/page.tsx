import { getAdminById } from "@/lib/auth/admin";
import { getSession } from "@/lib/auth/session";

export default async function AdminSettingsPage() {
  const session = await getSession();
  const admin = session ? await getAdminById(session.sub) : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-brand-navy">Settings</h2>
        <p className="mt-2 text-sm text-brand-slate">
          Signed in with the admin access code.
        </p>
      </div>

      <div className="max-w-lg border border-brand-navy/10 bg-white p-6">
        <h3 className="font-display text-xl text-brand-navy">Account</h3>
        <dl className="mt-6 space-y-4 text-sm">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/50">
              Name
            </dt>
            <dd className="mt-1 text-brand-navy">
              {admin?.name || session?.name || "Admin"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/50">
              Email
            </dt>
            <dd className="mt-1 text-brand-navy">
              {admin?.email || session?.email || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/50">
              Access
            </dt>
            <dd className="mt-1 text-brand-slate">
              Use the access code from your environment settings to sign in.
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
