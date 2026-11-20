import Link from "next/link";
import { logoutAdminAction } from "@/lib/auth/actions";
import type { SessionPayload } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin/", label: "Overview" },
  { href: "/admin/enquiries/", label: "Enquiries" },
  { href: "/admin/appointments/", label: "Appointments" },
  { href: "/admin/availability/", label: "Availability" },
  { href: "/admin/customers/", label: "Customers" },
  { href: "/admin/subscribers/", label: "Subscribers" },
  { href: "/admin/content/", label: "Website" },
  { href: "/admin/campaigns/", label: "Campaigns" },
  { href: "/admin/settings/", label: "Settings" },
];

export function AdminShell({
  session,
  pathname,
  children,
  lockNav = false,
}: {
  session: SessionPayload;
  pathname: string;
  children: React.ReactNode;
  lockNav?: boolean;
}) {
  return (
    <div className="min-h-screen bg-brand-ivory text-brand-navy">
      <header className="border-b border-brand-navy/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-navy/45">
              Genesis Tax Solutions
            </p>
            <h1 className="font-display text-xl text-brand-navy">Admin</h1>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-brand-slate sm:inline">
              {session.name}
            </span>
            <Link
              href="/"
              className="text-brand-navy/70 transition-colors hover:text-brand-pink"
            >
              View site
            </Link>
            <form action={logoutAdminAction}>
              <button
                type="submit"
                className="border border-brand-navy/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-brand-navy transition-colors hover:border-brand-pink hover:text-brand-pink"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[14rem_minmax(0,1fr)] lg:px-8">
        <nav aria-label="Admin" className="space-y-1">
          {nav.map((item) => {
            const active =
              item.href === "/admin/"
                ? pathname === "/admin" || pathname === "/admin/"
                : pathname.startsWith(item.href.replace(/\/$/, ""));
            const disabled = lockNav && item.href !== "/admin/settings/";
            if (disabled) {
              return (
                <span
                  key={item.href}
                  className="block cursor-not-allowed px-3 py-2.5 text-sm text-brand-navy/35"
                  title="Set your password first"
                >
                  {item.label}
                </span>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-brand-navy text-white"
                    : "text-brand-navy/80 hover:bg-white hover:text-brand-pink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
