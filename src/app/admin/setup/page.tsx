import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthField, AuthForm } from "@/components/admin/AuthForm";
import { setupAdminAction } from "@/lib/auth/actions";
import { hasAdminUser } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: "Admin Setup",
  robots: { index: false, follow: false },
};

export default async function AdminSetupPage() {
  if (await hasAdminUser()) {
    redirect("/admin/login/");
  }

  return (
    <div className="border border-brand-navy/10 bg-white p-6 sm:p-8">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-navy/45">
        First-time setup
      </p>
      <h1 className="mt-2 font-display text-3xl text-brand-navy">
        Enter setup code
      </h1>
      <p className="mt-2 text-sm text-brand-slate">
        Enter the project setup code to unlock the admin dashboard. You will set
        your password next.
      </p>
      <div className="mt-8">
        <AuthForm action={setupAdminAction} submitLabel="Continue">
          <AuthField
            label="Setup code"
            name="setupCode"
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
