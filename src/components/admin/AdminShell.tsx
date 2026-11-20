"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
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

function isActive(pathname: string, href: string) {
  if (href === "/admin/") {
    return pathname === "/admin" || pathname === "/admin/";
  }
  return pathname.startsWith(href.replace(/\/$/, ""));
}

function NavLinks({
  pathname,
  lockNav,
  onNavigate,
  className,
}: {
  pathname: string;
  lockNav: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <nav aria-label="Admin" className={cn("space-y-1", className)}>
      {nav.map((item) => {
        const active = isActive(pathname, item.href);
        const disabled = lockNav && item.href !== "/admin/settings/";
        if (disabled) {
          return (
            <span
              key={item.href}
              className="block cursor-not-allowed rounded-lg px-3 py-2.5 text-sm text-brand-navy/35"
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
            onClick={onNavigate}
            className={cn(
              "block rounded-lg px-3 py-2.5 text-sm transition-colors",
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
  );
}

export function AdminShell({
  session,
  children,
  lockNav = false,
}: {
  session: SessionPayload;
  children: React.ReactNode;
  lockNav?: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const current =
    nav.find((item) => isActive(pathname, item.href))?.label ?? "Admin";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-navy">
      <header className="sticky top-0 z-40 border-b border-brand-navy/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <div className="min-w-0">
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-brand-navy/45 sm:text-[0.65rem] sm:tracking-[0.2em]">
              Genesis Tax Solutions
            </p>
            <h1 className="truncate font-display text-lg text-brand-navy sm:text-xl">
              Admin
              <span className="ml-2 text-sm font-sans font-medium text-brand-navy/45 lg:hidden">
                / {current}
              </span>
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3 text-sm">
            <span className="hidden text-brand-slate md:inline">
              {session.name}
            </span>
            <Link
              href="/"
              className="hidden text-brand-navy/70 transition-colors hover:text-brand-pink sm:inline"
            >
              View site
            </Link>
            <form action={logoutAdminAction} className="hidden sm:block">
              <button
                type="submit"
                className="border border-red-500/40 bg-red-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-red-700 transition-colors hover:border-red-600 hover:bg-red-100 hover:text-red-800"
              >
                Sign out
              </button>
            </form>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-navy/10 text-brand-navy lg:hidden"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div
          id={menuId}
          className={cn(
            "border-t border-brand-navy/10 bg-white lg:hidden",
            open ? "block" : "hidden",
          )}
        >
          <div className="mx-auto max-w-7xl space-y-4 px-4 py-4 sm:px-6">
            <NavLinks
              pathname={pathname}
              lockNav={lockNav}
              onNavigate={() => setOpen(false)}
            />
            <div className="grid gap-2 border-t border-brand-navy/10 pt-4 sm:hidden">
              <p className="px-3 text-xs text-brand-slate">{session.name}</p>
              <Link
                href="/"
                className="rounded-lg px-3 py-2.5 text-sm text-brand-navy/80 hover:bg-brand-ivory hover:text-brand-pink"
                onClick={() => setOpen(false)}
              >
                View site
              </Link>
              <form action={logoutAdminAction}>
                <button
                  type="submit"
                  className="w-full rounded-lg border border-red-500/40 bg-red-600 px-3 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-red-700"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:px-8">
        <aside className="hidden lg:block">
          <NavLinks pathname={pathname} lockNav={lockNav} className="sticky top-24" />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
