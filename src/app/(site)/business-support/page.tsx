import type { Metadata } from "next";
import { ServicePage } from "@/components/content/ServicePage";
import { media } from "@/lib/media";

export const metadata: Metadata = {
  title: "Business Support",
  description:
    "Tax and compliance support for small businesses and self-employed clients in Jacksonville, FL.",
};

export default function BusinessSupportPage() {
  return (
    <ServicePage
      slug="business-support"
      bullets={[
        "Tax planning & strategy conversations",
        "Entity setup & compliance guidance",
        "Bookkeeping-related support",
        "Year-round guidance",
      ]}
      image={{
        src: media.businessBanner.src,
        alt: media.businessBanner.alt,
        width: 1088,
        height: 570,
      }}
    />
  );
}
