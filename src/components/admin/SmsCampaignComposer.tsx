"use client";

import { X } from "lucide-react";
import { useActionState, useId, useRef, useState, useTransition } from "react";
import {
  sendMassSmsCampaignAction,
  type CampaignActionResult,
} from "@/lib/admin/actions";
import { LoadingModal } from "@/components/ui/LoadingModal";

const initial: CampaignActionResult = { ok: false };
const SMS_MAX = 320;

const fieldClass =
  "mt-2 w-full border border-brand-navy/15 bg-white px-4 py-3 text-sm text-brand-navy outline-none focus:border-brand-pink";

export function SmsCampaignComposer({
  audienceName,
  listWebId,
}: {
  audienceName?: string;
  listWebId: number;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const titleId = useId();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [state, formAction, actionPending] = useActionState(
    sendMassSmsCampaignAction,
    initial,
  );
  const [transitionPending, startTransition] = useTransition();
  const pending = actionPending || transitionPending;

  const audienceLabel = audienceName || "your connected audience";

  function openConfirm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setConfirmOpen(true);
  }

  function confirmSend() {
    const form = formRef.current;
    if (!form) return;
    const formData = new FormData(form);
    formData.set("confirmSend", "on");
    setConfirmOpen(false);
    startTransition(() => {
      formAction(formData);
    });
  }

  return (
    <section className="border border-brand-navy/10 bg-white p-6">
      {pending ? <LoadingModal label="Sending your SMS campaign" /> : null}
      <h3 className="font-display text-xl text-brand-navy">Send mass SMS</h3>
      <p className="mt-2 text-sm text-brand-slate">
        Creates and sends a Mailchimp SMS campaign to SMS-subscribed contacts in{" "}
        <span className="font-medium text-brand-navy">{audienceLabel}</span>.
        Only contacts opted into SMS will receive it.
      </p>

      <form
        ref={formRef}
        onSubmit={openConfirm}
        className="mt-6 space-y-5"
      >
        <input type="hidden" name="listWebId" value={listWebId} />

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/50">
            Campaign name
          </span>
          <input
            name="name"
            required
            maxLength={100}
            placeholder="April filing reminder"
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/50">
            SMS message
          </span>
          <textarea
            name="message"
            required
            rows={5}
            maxLength={SMS_MAX}
            minLength={5}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Genesis Tax: Reminder — reply STOP to opt out."
            className={`${fieldClass} min-h-[8rem] resize-y`}
          />
          <span className="mt-2 block text-xs text-brand-slate">
            {message.length}/{SMS_MAX} characters
          </span>
        </label>

        {state.error ? (
          <p role="alert" className="text-sm text-red-700">
            {state.error}
          </p>
        ) : null}
        {state.ok && state.message ? (
          <p role="status" className="text-sm text-emerald-700">
            {state.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center bg-brand-navy px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-brand-navy/90 disabled:opacity-60"
        >
          {pending ? "Sending..." : "Send SMS to audience"}
        </button>
      </form>

      {confirmOpen ? (
        <div
          className="fixed inset-0 z-[240] flex items-center justify-center bg-brand-navy/60 px-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={() => (pending ? null : setConfirmOpen(false))}
        >
          <div
            className="w-full max-w-md border border-white/15 bg-brand-ivory p-6 shadow-[0_24px_80px_rgba(7,27,58,0.35)] animate-[loading-modal-in_280ms_ease-out]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h3
                id={titleId}
                className="font-display text-2xl text-brand-navy"
              >
                Send to everyone?
              </h3>
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                disabled={pending}
                className="inline-flex h-9 w-9 items-center justify-center border border-brand-navy/15 text-brand-navy disabled:opacity-60"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-brand-slate">
              This SMS will be sent to{" "}
              <strong className="text-brand-navy">all</strong> SMS-subscribed
              contacts in{" "}
              <strong className="text-brand-navy">{audienceLabel}</strong>.
              This cannot be undone from this dashboard.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={confirmSend}
                disabled={pending}
                className="inline-flex flex-1 items-center justify-center bg-brand-navy px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-navy/90 disabled:opacity-60"
              >
                {pending ? "Sending..." : "Yes, send to all"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                disabled={pending}
                className="inline-flex flex-1 items-center justify-center border border-brand-navy/15 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy transition-colors hover:border-brand-navy/35 disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
