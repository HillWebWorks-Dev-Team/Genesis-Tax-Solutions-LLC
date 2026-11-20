"use client";

import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  return (
    <ToastProvider>
      <AdminShell
        session={session}
        pathname={pathname}
        lockNav={lockNav}
      >
        {children}
      </AdminShell>
    </ToastProvider>
  );
}
