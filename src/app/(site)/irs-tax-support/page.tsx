import type { Metadata } from "next";
import { ServicePage } from "@/components/content/ServicePage";
import { media } from "@/lib/media";

export const metadata: Metadata = {
  title: "IRS / Tax Resolution Support",
  description:
    "Help understanding IRS notices and next steps with Genesis Tax & Notary Solutions in Jacksonville, FL.",
};

export default function IrsTaxSupportPage() {
  return (
    <ServicePage
      slug="irs-tax-support"
      bullets={[
        "Help reviewing IRS notices and correspondence",
        "Guidance on documentation and response timelines",
        "Support coordinating follow-up steps",
      ]}
      image={{
        src: media.nationwideGraphic.src,
        alt: media.nationwideGraphic.alt,
        width: 1088,
        height: 570,
      }}
    />
  );
}
