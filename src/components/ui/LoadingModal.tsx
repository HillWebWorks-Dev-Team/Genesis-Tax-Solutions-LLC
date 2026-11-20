import Image from "next/image";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function LoadingModal({
  label = "Loading",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[200] flex items-center justify-center bg-brand-navy/55 px-6 backdrop-blur-[2px]",
        className,
      )}
      role="alertdialog"
      aria-busy="true"
      aria-live="polite"
      aria-label={label}
    >
      <div className="w-full max-w-sm border border-white/15 bg-brand-ivory px-8 py-10 text-center shadow-[0_24px_80px_rgba(7,27,58,0.35)] animate-[loading-modal-in_280ms_ease-out]">
        <Image
          src="/images/logo.png"
          alt={siteConfig.brandName}
          width={1983}
          height={793}
          className="mx-auto h-12 w-auto object-contain sm:h-14"
          priority
        />
        <div
          className="loading-spinner mx-auto mt-8 h-10 w-10 rounded-full border-[3px] border-brand-navy/15 border-t-brand-pink"
          aria-hidden="true"
        />
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-navy/55">
          {label}
        </p>
      </div>
    </div>
  );
}
