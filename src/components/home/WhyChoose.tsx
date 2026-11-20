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
    <section className="bg-brand-ivory py-12 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Why Clients Choose Genesis"
          title="Service, Convenience & Trust You Can Count On"
          description="A premium client experience built around clarity, accessibility, and reliable follow-through."
        />
        <ul className="mt-8 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
          {features.map(({ title, description, Icon }) => (
            <li
              key={title}
              className="rounded-2xl border border-brand-pink/15 bg-white p-4 text-left shadow-sm sm:rounded-3xl sm:p-6 sm:text-center"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-pink/10 text-brand-pink sm:mx-auto sm:h-14 sm:w-14">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
              </span>
              <h3 className="mt-4 font-display text-lg text-brand-navy sm:mt-5 sm:text-xl">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-slate sm:mt-3">
                {description}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
