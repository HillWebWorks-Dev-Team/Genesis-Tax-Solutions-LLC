"use client";

import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { SubscribeForm } from "@/components/signup/SubscribeForm";

export function SignupPopup() {
  const pathname = usePathname();
  const titleId = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-3 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close signup"
        className="absolute inset-0 bg-brand-navy/70"
        onClick={() => setOpen(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-h-[min(92vh,44rem)] w-full max-w-xl overflow-y-auto rounded-[1.5rem] bg-white p-5 shadow-2xl sm:p-7"
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full text-brand-navy hover:bg-brand-ivory"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <h2
          id={titleId}
          className="pr-10 font-display text-3xl text-brand-navy"
        >
          Join email list
        </h2>
        <SubscribeForm variant="popup" className="mt-5" />
      </div>
    </div>
  );
}
