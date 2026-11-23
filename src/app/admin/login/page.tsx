import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthField, AuthForm } from "@/components/admin/AuthForm";
import { DatabaseUnavailable } from "@/components/admin/DatabaseUnavailable";
import { loginAdminAction } from "@/lib/auth/actions";
import { getAdminAccountState } from "@/lib/auth/admin";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const account = await getAdminAccountState();
  if (account === "unavailable") {
    return <DatabaseUnavailable />;
  }
  if (account === "missing") {
    redirect("/admin/setup/");
  }

  return (
    <div className="border border-brand-navy/10 bg-white p-6 sm:p-8">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-navy/45">
        Admin access
      </p>
      <h1 className="mt-2 font-display text-3xl text-brand-navy">Sign in</h1>
      <p className="mt-2 text-sm text-brand-slate">
        Sign in with {siteConfig.email} and the password you created after setup.
      </p>
      <div className="mt-8">
        <AuthForm action={loginAdminAction} submitLabel="Sign in">
          <AuthField
            label="Email"
            name="email"
            type="email"
            required
            autoComplete="username"
          />
          <AuthField
            label="Password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
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
