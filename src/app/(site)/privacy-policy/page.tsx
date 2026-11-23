import type { Metadata } from "next";
import { PageHero } from "@/components/content/PageHero";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Genesis Tax Solutions LLC.",
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="How we collect, use, and protect information."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy" },
        ]}
      />
      <Container className="prose prose-slate max-w-3xl py-14">
        <p>
          {siteConfig.legalName} (&quot;we,&quot; &quot;us&quot;) respects your
          privacy. This policy explains how we handle information submitted
          through our website and marketing signups.
        </p>
        <h2>Information we collect</h2>
        <p>
          Contact details you share with us (such as name, email, and phone)
          and marketing consent records.
        </p>
        <h2>How we use information</h2>
        <p>
          To respond to enquiries, schedule appointments, operate our services,
          and (only with separate consent) send email or SMS marketing.
        </p>
        <h2 id="sms">SMS Terms</h2>
        <p>
          By opting into SMS marketing, you consent to receive recurring
          automated promotional messages from {siteConfig.legalName} at the
          mobile number provided. Message frequency varies. Message and data
          rates may apply. Reply STOP to unsubscribe and HELP for help. Consent
          is not a condition of purchasing any goods or services.
        </p>
        <h2>Contact</h2>
        <p>
          Questions about privacy:{" "}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> or{" "}
          {siteConfig.phoneDisplay}.
        </p>
        <p className="text-sm text-brand-slate">
          This page is an initial operational draft and should be reviewed by
          the client or legal counsel before production launch.
        </p>
      </Container>
    </>
  );
}
