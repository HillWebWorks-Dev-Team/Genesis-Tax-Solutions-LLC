import { AuthField, AuthForm } from "@/components/admin/AuthForm";
import { changePasswordAction } from "@/lib/auth/actions";
import { getAdminById } from "@/lib/auth/admin";
import { getSession } from "@/lib/auth/session";

export default async function AdminSettingsPage() {
  const session = await getSession();
  const admin = session ? await getAdminById(session.sub) : null;
  const mustChangePassword = Boolean(admin?.mustChangePassword);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-brand-navy">
          {mustChangePassword ? "Set your password" : "Settings"}
        </h2>
        <p className="mt-2 text-sm text-brand-slate">
          {mustChangePassword
            ? `Signed in as ${session?.email}. Choose a secure password to finish setup.`
            : `Signed in as ${session?.email}. Change your admin password below.`}
        </p>
      </div>

      <div className="max-w-lg border border-brand-navy/10 bg-white p-6">
        <h3 className="font-display text-xl text-brand-navy">
          {mustChangePassword ? "Create password" : "Change password"}
        </h3>
        <div className="mt-6">
          <AuthForm
            action={changePasswordAction}
            submitLabel={mustChangePassword ? "Save password" : "Update password"}
          >
            {!mustChangePassword ? (
              <AuthField
                label="Current password"
                name="currentPassword"
                type="password"
                required
                autoComplete="current-password"
              />
            ) : null}
            <AuthField
              label="New password"
              name="nextPassword"
              type="password"
              required
              autoComplete="new-password"
            />
            <AuthField
              label="Confirm new password"
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
            />
          </AuthForm>
        </div>
      </div>
    </div>
  );
}
