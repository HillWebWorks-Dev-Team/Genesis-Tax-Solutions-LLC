import type { Metadata } from "next";
import { PageHero } from "@/components/content/PageHero";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Genesis Tax Solutions LLC.",
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        description="Website use terms for Genesis Tax & Notary Solutions."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Terms of Service" },
        ]}
      />
      <Container className="prose prose-slate max-w-3xl py-14">
        <p>
          By using this website, you agree to these terms. Website content is
          provided for general information and does not create a client
          engagement until services are formally accepted.
        </p>
        <h2>Appointments</h2>
        <p>
          Online booking requests are subject to confirmation. Availability is
          not guaranteed until confirmed by {siteConfig.legalName}.
        </p>
        <h2>No sensitive uploads via public forms</h2>
        <p>
          Do not submit Social Security numbers, full tax returns, or other
          highly sensitive documents through public website forms.
        </p>
        <h2>Contact</h2>
        <p>
          {siteConfig.email} · {siteConfig.phoneDisplay}
        </p>
        <p className="text-sm text-brand-slate">
          Draft terms pending client/legal review before launch.
        </p>
      </Container>
    </>
  );
}
