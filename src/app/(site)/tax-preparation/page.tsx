import type { Metadata } from "next";
import { ServicePage } from "@/components/content/ServicePage";
import { media } from "@/lib/media";

export const metadata: Metadata = {
  title: "Tax Preparation",
  description:
    "Professional tax preparation for individuals, families, and eligible businesses in Jacksonville, FL.",
};

export default function TaxPreparationPage() {
  return (
    <ServicePage
      slug="tax-preparation"
      bullets={[
        "Individuals & families",
        "Self-employed & 1099 filers",
        "Small businesses",
        "Organized review for deductions and credits",
      ]}
      image={{
        src: media.taxPrepBanner.src,
        alt: media.taxPrepBanner.alt,
        width: 1088,
        height: 570,
      }}
    />
  );
}
