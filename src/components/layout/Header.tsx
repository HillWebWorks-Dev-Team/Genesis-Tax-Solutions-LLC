"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="relative z-[60] border-b border-brand-navy/8 bg-white">
        <Container className="flex h-[3.75rem] items-center justify-between gap-3 sm:h-[4.75rem] sm:gap-4">
          <Logo className="min-w-0 shrink [&_img]:h-8 sm:[&_img]:h-12" />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {siteConfig.nav.map((item) => {
              if ("children" in item && item.children) {
                return (
                  <div key={item.label} className="relative group">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-brand-navy/85 transition-colors hover:bg-brand-ivory hover:text-brand-navy"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      {item.label}
                      <ChevronDown className="h-4 w-4 opacity-70" aria-hidden />
                    </button>
                    <div className="invisible absolute left-0 top-full z-20 min-w-[15rem] pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                      <ul className="rounded-2xl border border-brand-navy/8 bg-white p-2 shadow-xl shadow-brand-navy/10">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="block rounded-xl px-3.5 py-2.5 text-sm text-brand-navy/85 transition-colors hover:bg-brand-ivory hover:text-brand-pink"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              }

              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-brand-ivory text-brand-pink"
                      : "text-brand-navy/85 hover:bg-brand-ivory hover:text-brand-navy",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={`tel:${siteConfig.phoneTel}`}
              className="hidden items-center gap-2 rounded-full bg-brand-pink px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-pink-dark sm:inline-flex"
            >
              <Phone className="h-4 w-4" aria-hidden />
              Call
            </a>
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
        </Container>
      </header>

      <div
        id={menuId}
        className={cn(
          "absolute inset-x-0 top-full z-[55] h-[calc(100dvh-100%)] overflow-y-auto border-t border-brand-navy/8 bg-white lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <Container className="flex min-h-full flex-col gap-1 py-4 pb-10">
          {siteConfig.nav.map((item) => {
            if ("children" in item && item.children) {
              return (
                <div key={item.label} className="rounded-2xl bg-brand-ivory/60">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-4 py-3.5 text-left text-base font-medium text-brand-navy"
                    aria-expanded={servicesOpen}
                    onClick={() => setServicesOpen((value) => !value)}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        servicesOpen && "rotate-180",
                      )}
                    />
                  </button>
                  {servicesOpen ? (
                    <ul className="space-y-1 px-2 pb-3">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block rounded-xl px-3 py-3 text-sm text-brand-slate hover:bg-white hover:text-brand-pink"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-4 py-3.5 text-base font-medium text-brand-navy hover:bg-brand-ivory hover:text-brand-pink"
              >
                {item.label}
              </Link>
            );
          })}
          <div className="mt-4 grid gap-2">
            <a
              href={`tel:${siteConfig.phoneTel}`}
              className="inline-flex w-full items-center justify-center rounded-full border border-brand-navy/15 px-6 py-3 text-sm font-semibold text-brand-navy transition-colors hover:border-brand-pink hover:text-brand-pink"
            >
              Call {siteConfig.phoneDisplay}
            </a>
          </div>
        </Container>
      </div>
    </>
  );
}
