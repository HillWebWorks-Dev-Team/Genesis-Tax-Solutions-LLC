"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  clearContentImageAction,
  uploadContentImageAction,
} from "@/lib/content/actions";

export function ContentImageField({
  fieldKey,
  label,
  hint,
  currentValue,
}: {
  fieldKey: string;
  label: string;
  hint?: string;
  currentValue: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  return (
    <div className="border border-brand-navy/10 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/50">
        {label}
      </p>
      {hint ? <p className="mt-2 text-sm text-brand-slate">{hint}</p> : null}

      {currentValue ? (
        <div className="mt-4 overflow-hidden border border-brand-navy/10 bg-brand-ivory">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentValue}
            alt=""
            className="max-h-48 w-full object-contain"
          />
        </div>
      ) : (
        <p className="mt-4 text-sm text-brand-slate">No custom image set.</p>
      )}

      <form
        className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center"
        action={(formData) => {
          startTransition(async () => {
            const result = await uploadContentImageAction(formData);
            setMessage(result.ok ? "Image uploaded." : result.error || "Upload failed.");
            router.refresh();
          });
        }}
      >
        <input type="hidden" name="key" value={fieldKey} />
        <input
          type="file"
          name="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="block w-full text-sm text-brand-slate"
        />
        <button
          type="submit"
          disabled={pending}
          className="bg-brand-navy px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-navy-light disabled:opacity-60"
        >
          {pending ? "Uploading..." : "Upload"}
        </button>
      </form>

      {currentValue ? (
        <form
          className="mt-3"
          action={(formData) => {
            startTransition(async () => {
              await clearContentImageAction(formData);
              setMessage("Custom image cleared.");
              router.refresh();
            });
          }}
        >
          <input type="hidden" name="key" value={fieldKey} />
          <button
            type="submit"
            disabled={pending}
            className="text-xs font-semibold uppercase tracking-[0.14em] text-red-700 hover:text-red-800"
          >
            Remove custom image
          </button>
        </form>
      ) : null}

      {message ? (
        <p className="mt-3 text-sm text-brand-navy">{message}</p>
      ) : null}
    </div>
  );
}
