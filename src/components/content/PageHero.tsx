import Image from "next/image";
import Link from "next/link";
import { Home } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

export type Breadcrumb = {
  label: string;
  href?: string;
};

export function PageHero({
  eyebrow = "Services",
  title,
  description,
  breadcrumbs,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
}) {
  const crumbs: Breadcrumb[] =
    breadcrumbs ??
    (eyebrow.toLowerCase() === "services"
      ? [
          { label: "Home", href: "/" },
          { label: "Services" },
          { label: title },
        ]
      : [
          { label: "Home", href: "/" },
          { label: title },
        ]);

  return (
    <section className="relative isolate overflow-hidden bg-brand-navy text-white">
      <Image
        src="/images/subheropage.png"
        alt=""
        fill
        priority
        className="object-cover object-right"
        sizes="100vw"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-brand-navy/55 via-brand-navy/25 to-transparent"
      />

      <Container className="relative py-14 sm:py-16 lg:py-[4.5rem]">
        <div className="max-w-2xl">
          <p className="flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-brand-gold">
            <span className="inline-block h-px w-8 bg-brand-gold" aria-hidden />
            {eyebrow}
          </p>

          <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl lg:text-[3.25rem]">
            {title}
          </h1>

          <svg
            aria-hidden
            viewBox="0 0 220 18"
            className="mt-3 h-4 w-40 text-brand-gold sm:h-5 sm:w-48"
            fill="none"
          >
            <path
              d="M2 12C48 4 96 3 140 8C168 11 196 10 218 6"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          {description ? (
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
              {description}
            </p>
          ) : null}
        </div>

        <nav aria-label="Breadcrumb" className="mt-10">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-white/55">
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1;
              return (
                <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                  {index === 0 ? (
                    <Home className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  ) : null}
                  {crumb.href && !isLast ? (
                    <Link
                      href={crumb.href}
                      className="transition-colors hover:text-white"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span
                      className={cn(isLast ? "font-medium text-brand-gold" : undefined)}
                      aria-current={isLast ? "page" : undefined}
                    >
                      {crumb.label}
                    </span>
                  )}
                  {!isLast ? <span aria-hidden>&gt;</span> : null}
                </li>
              );
            })}
          </ol>
        </nav>
      </Container>
    </section>
  );
}
