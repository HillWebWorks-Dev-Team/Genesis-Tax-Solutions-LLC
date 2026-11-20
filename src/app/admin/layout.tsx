import type { Metadata } from "next";
import { AdminShellClient } from "@/components/admin/AdminShellClient";
import { getAdminById } from "@/lib/auth/admin";
import { getSession } from "@/lib/auth/session";

export const instant = false;

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-ivory px-4 py-16">
        <div className="w-full max-w-md">{children}</div>
      </div>
    );
  }

  const admin = await getAdminById(session.sub);
  const mustChangePassword = Boolean(admin?.mustChangePassword);

  return (
    <AdminShellClient session={session} lockNav={mustChangePassword}>
      {children}
    </AdminShellClient>
  );
}
