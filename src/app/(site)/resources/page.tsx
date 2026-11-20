import type { Metadata } from "next";
import { MediaBanner } from "@/components/content/MediaBanner";
import { PageHero } from "@/components/content/PageHero";
import { Container } from "@/components/ui/Container";
import { media } from "@/lib/media";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Helpful tax and notary resources from Genesis Tax & Notary Solutions.",
};

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Helpful Guides & Updates"
        description="Seasonal reminders, referral program details, and brand resources. Additional articles will expand through the admin CMS."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Resources" },
        ]}
      />
      <Container className="space-y-10 py-14">
        <div className="max-w-3xl text-brand-slate">
          <p>
            Browse current promotions and service highlights below. For
            personalized guidance, book an appointment or contact the office.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <MediaBanner
            src={media.referralPromo.src}
            alt={media.referralPromo.alt}
            fit="contain"
          />
          <MediaBanner
            src={media.referralDetails.src}
            alt={media.referralDetails.alt}
            fit="contain"
          />
        </div>

        <MediaBanner
          src={media.brandBanner.src}
          alt={media.brandBanner.alt}
          fit="contain"
        />
      </Container>
    </>
  );
}
