import type { Metadata } from "next";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { Hero } from "@/components/home/Hero";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";
import { PromoBanner } from "@/components/home/PromoBanner";
import { ReferralPromo } from "@/components/home/ReferralPromo";
import { OfficeMap } from "@/components/home/OfficeMap";
import { Services } from "@/components/home/Services";
import { getPublicContent } from "@/lib/content/public-content";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Professional Tax Preparation & Notary Services in Jacksonville, FL",
  description:
    "Genesis Tax & Notary Solutions provides trusted tax preparation, notary services, and IRS notice support in Jacksonville, Florida.",
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  const content = await getPublicContent();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AccountingService",
    name: siteConfig.brandName,
    legalName: siteConfig.legalName,
    url: "https://gtsnotarytax.com",
    telephone: content.phoneDisplay,
    email: content.email,
    image: "https://gtsnotarytax.com/images/imgwithdog.jpg",
    address: {
      "@type": "PostalAddress",
      streetAddress: content.address.line1,
      addressLocality: "Jacksonville",
      addressRegion: "FL",
      postalCode: "32210",
      addressCountry: "US",
    },
    areaServed: {
      "@type": "City",
      name: "Jacksonville",
    },
    sameAs: Object.values(siteConfig.social),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero imageSrc={content.homeHeroImage || undefined} />
      <PromoBanner content={content} />
      <Services />
      <AboutTeaser />
      <OfficeMap content={content} />
      <ReferralPromo />
      <NewsletterSignup />
    </>
  );
}
