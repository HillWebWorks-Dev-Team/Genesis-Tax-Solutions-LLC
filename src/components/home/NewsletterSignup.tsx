import { SubscribeForm } from "@/components/signup/SubscribeForm";
import { Container } from "@/components/ui/Container";

export function NewsletterSignup() {
  return (
    <section id="newsletter" className="bg-brand-ivory py-12 sm:py-16">
      <Container className="max-w-md">
        <h2 className="font-display text-[1.85rem] text-brand-navy sm:text-4xl">
          Stay Connected
        </h2>
        <SubscribeForm className="mt-5" />
      </Container>
    </section>
  );
}
