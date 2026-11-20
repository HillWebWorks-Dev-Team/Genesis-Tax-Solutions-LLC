"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { syncSubscriberToMailchimpAction } from "@/lib/admin/actions";

export function SyncSubscriberButton({ subscriberId }: { subscriberId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  return (
    <div>
      <form
        action={(formData) => {
          startTransition(async () => {
            const result = await syncSubscriberToMailchimpAction(formData);
            setMessage(
              result.ok
                ? result.skipped
                  ? "Saved locally. Mailchimp is not configured."
                  : "Synced to Mailchimp."
                : result.error || "Sync failed.",
            );
            router.refresh();
          });
        }}
      >
        <input type="hidden" name="id" value={subscriberId} />
        <button
          type="submit"
          disabled={pending}
          className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-pink hover:text-brand-pink-dark disabled:opacity-60"
        >
          {pending ? "Syncing..." : "Sync"}
        </button>
      </form>
      {message ? (
        <p className="mt-1 text-xs text-brand-slate">{message}</p>
      ) : null}
    </div>
  );
}
