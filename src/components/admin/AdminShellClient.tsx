"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { ToastProvider } from "@/components/ui/Toast";
import type { SessionPayload } from "@/lib/auth/session";

export function AdminShellClient({
  session,
  lockNav = false,
  children,
}: {
  session: SessionPayload;
  lockNav?: boolean;
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <AdminShell session={session} lockNav={lockNav}>
        {children}
      </AdminShell>
    </ToastProvider>
  );
}
