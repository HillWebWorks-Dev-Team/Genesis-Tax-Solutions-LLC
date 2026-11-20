import { prisma } from "@/lib/db";
import { getPublicContent } from "@/lib/content/public-content";
import { sendEmail } from "@/lib/email/send";

export async function notifyOfficeOfBooking(appointmentId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });
  if (!appointment) return;

  const content = await getPublicContent();
  await sendEmail({
    to: content.email,
    subject: `New booking request · ${appointment.name}`,
    text: `${appointment.name} requested ${appointment.service} on ${appointment.preferredDate} at ${appointment.preferredTime} (${appointment.method}).\nEmail: ${appointment.email}\nPhone: ${appointment.phone}`,
    html: `<p><strong>${appointment.name}</strong> requested <strong>${appointment.service}</strong> on <strong>${appointment.preferredDate}</strong> at <strong>${appointment.preferredTime}</strong> (${appointment.method}).</p><p>Email: ${appointment.email}<br/>Phone: ${appointment.phone}</p>`,
  });
}
