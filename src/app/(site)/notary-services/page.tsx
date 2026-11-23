import type { Metadata } from "next";
import { ServicePage } from "@/components/content/ServicePage";
import { media } from "@/lib/media";

export const metadata: Metadata = {
  title: "Notary Services",
  description:
    "In-office and mobile notary services in Jacksonville, FL. Contact Genesis Tax & Notary Solutions to schedule.",
};

export default function NotaryServicesPage() {
  return (
    <ServicePage
      slug="notary-services"
      bullets={[
        "In-office & mobile notary options",
        "General notarial acts for eligible documents",
        "Contact the office to arrange a time",
      ]}
      image={{
        src: media.notaryBanner.src,
        alt: media.notaryBanner.alt,
        width: 1088,
        height: 570,
      }}
    />
  );
}
