import Link from "next/link";

export function DatabaseUnavailable() {
  return (
    <div className="border border-brand-navy/10 bg-white p-6 sm:p-8">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-navy/45">
        Admin access
      </p>
      <h1 className="mt-2 font-display text-3xl text-brand-navy">
        Temporarily unavailable
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-brand-slate">
        The admin database cannot be reached, so this page cannot sign you in.
        Try again in a moment.
      </p>
      <p className="mt-6 text-center text-xs text-brand-slate">
        <Link href="/" className="hover:text-brand-pink">
          Back to website
        </Link>
      </p>
    </div>
  );
}
