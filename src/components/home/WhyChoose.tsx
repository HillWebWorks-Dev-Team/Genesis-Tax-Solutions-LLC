import {
  CalendarCheck2,
  HeartHandshake,
  MapPinned,
  MessagesSquare,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const features = [
  {
    title: "Year-Round Support",
    description:
      "Guidance when you need it, during tax season and throughout the year.",
    Icon: MessagesSquare,
  },
  {
    title: "Mobile & In-Office Notary",
    description:
      "Convenient notary appointments that fit your schedule and location needs.",
    Icon: MapPinned,
  },
  {
    title: "Personalised Service",
    description:
      "Clear explanations, organized processes, and attentive one-on-one support.",
    Icon: HeartHandshake,
  },
  {
    title: "Easy Appointment Booking",
    description:
      "Request a time online and we’ll confirm the details with you promptly.",
    Icon: CalendarCheck2,
  },
];

export function WhyChoose() {
  return (
    <section className="bg-brand-ivory py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Why Clients Choose Genesis"
          title="Service, Convenience & Trust You Can Count On"
          description="A premium client experience built around clarity, accessibility, and reliable follow-through."
        />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {features.map(({ title, description, Icon }) => (
            <li
              key={title}
              className="rounded-3xl border border-brand-pink/15 bg-white p-6 text-center shadow-sm"
            >
              <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-pink/10 text-brand-pink">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-5 font-display text-xl text-brand-navy">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-slate">
                {description}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
