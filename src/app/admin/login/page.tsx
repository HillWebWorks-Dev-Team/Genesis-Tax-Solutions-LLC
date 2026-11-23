import type { Metadata } from "next";
import Link from "next/link";
import { AuthField, AuthForm } from "@/components/admin/AuthForm";
import { DatabaseUnavailable } from "@/components/admin/DatabaseUnavailable";
import { loginAdminAction } from "@/lib/auth/actions";
import { getAdminAccountState } from "@/lib/auth/admin";

export const instant = false;

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const account = await getAdminAccountState();
  if (account === "unavailable") {
    return <DatabaseUnavailable />;
  }

  return (
    <div className="border border-brand-navy/10 bg-white p-6 sm:p-8">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-navy/45">
        Admin access
      </p>
      <h1 className="mt-2 font-display text-3xl text-brand-navy">Sign in</h1>
      <p className="mt-2 text-sm text-brand-slate">
        Enter the access code to open the admin dashboard.
      </p>
      <div className="mt-8">
        <AuthForm action={loginAdminAction} submitLabel="Sign in">
          <AuthField
            label="Access code"
            name="accessCode"
            type="password"
            required
            autoComplete="one-time-code"
          />
        </AuthForm>
      </div>
      <p className="mt-6 text-center text-xs text-brand-slate">
        <Link href="/" className="hover:text-brand-pink">
          Back to website
        </Link>
      </p>
    </div>
  );
}
