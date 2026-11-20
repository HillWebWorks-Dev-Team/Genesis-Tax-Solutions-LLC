import { siteConfig } from "@/lib/site-config";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export type EmailSendResult = {
  ok: boolean;
  skipped?: boolean;
  error?: string;
};

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export async function sendEmail(
  input: SendEmailInput,
): Promise<EmailSendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    console.info(
      "[email] Skipped send (RESEND_API_KEY / EMAIL_FROM not configured):",
      input.subject,
    );
    return { ok: true, skipped: true };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: input.subject,
        html: input.html,
        text: input.text,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      return {
        ok: false,
        error: `Email provider error (${response.status}): ${body}`,
      };
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Email send failed.",
    };
  }
}

export function appointmentEmailCopy(appointment: {
  name: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  method: string;
  status: string;
}) {
  const brand = siteConfig.brandName;
  const when = `${appointment.preferredDate} at ${appointment.preferredTime}`;
  const method = appointment.method.replace(/-/g, " ");

  if (appointment.status === "confirmed") {
    return {
      subject: `Appointment confirmed · ${brand}`,
      text: `Hi ${appointment.name},\n\nYour ${appointment.service} appointment is confirmed for ${when} (${method}).\n\nIf you need to reschedule, reply to this email or call ${siteConfig.phoneDisplay}.\n\n${brand}`,
      html: `<p>Hi ${appointment.name},</p><p>Your <strong>${appointment.service}</strong> appointment is confirmed for <strong>${when}</strong> (${method}).</p><p>If you need to reschedule, reply to this email or call ${siteConfig.phoneDisplay}.</p><p>${brand}</p>`,
    };
  }

  return {
    subject: `Appointment request received · ${brand}`,
    text: `Hi ${appointment.name},\n\nWe received your ${appointment.service} appointment request for ${when} (${method}). We will review availability and follow up soon.\n\n${brand}`,
    html: `<p>Hi ${appointment.name},</p><p>We received your <strong>${appointment.service}</strong> appointment request for <strong>${when}</strong> (${method}). We will review availability and follow up soon.</p><p>${brand}</p>`,
  };
}
