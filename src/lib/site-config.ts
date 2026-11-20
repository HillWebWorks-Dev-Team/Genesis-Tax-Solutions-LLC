/**
 * Public site configuration.
 * Editable values will later be driven by the CMS / SiteSetting table.
 * Unverified marketing claims are intentionally excluded.
 */

export const siteConfig = {
  legalName: "Genesis Tax Solutions LLC",
  brandName: "Genesis Tax & Notary Solutions",
  shortName: "GTS",
  ownerName: "Maxcieen Telford",
  ownerTitle: "Tax Professional & Notary Public",
  phoneDisplay: "(904) 930-8065",
  phoneTel: "+19049308065",
  faxDisplay: "(904) 664-8180",
  email: "gtsolutions@pm.me",
  // Suite E301 per client brief (live site currently shows Suite 301 - pending confirmation)
  address: {
    line1: "7052 103rd St, Suite E301",
    line2: "Jacksonville, FL 32210",
    note: "Located inside the U-Haul security gate, adjacent to I-295",
  },
  mailingAddress: {
    line1: "P.O. Box 47013",
    line2: "Jacksonville, FL 32247",
  },
  timezone: "America/New_York",
  announcement:
    "Professional Tax Preparation • Notary Services • Jacksonville, FL",
  social: {
    facebook: "https://www.facebook.com/share/1PpovQMfkb/",
    instagram: "https://www.instagram.com/genesis.taxsolutions",
    snapchat: "https://www.snapchat.com/@gtsolutions25",
    tiktok: "https://www.tiktok.com/@genesistaxsolutions",
    x: "https://x.com/GTSOLUTIONS25",
  },
  nav: [
    { label: "Home", href: "/" },
    {
      label: "Services",
      href: "/tax-preparation/",
      children: [
        { label: "Tax Preparation", href: "/tax-preparation/" },
        { label: "Notary Services", href: "/notary-services/" },
        { label: "Business Support", href: "/business-support/" },
        { label: "IRS / Tax Resolution", href: "/irs-tax-support/" },
      ],
    },
    { label: "About", href: "/about/" },
    { label: "Book Appointment", href: "/book-appointment/" },
    { label: "Contact", href: "/contact/" },
  ],
  services: [
    {
      slug: "tax-preparation",
      title: "Tax Preparation",
      description:
        "Tax filing assistance for individuals, families, self-employed clients, and eligible businesses, with clear communication and organized support.",
      href: "/tax-preparation/",
      icon: "calculator" as const,
    },
    {
      slug: "notary-services",
      title: "Notary Services",
      description:
        "General notary services with convenient in-office and mobile appointment options. Contact us to confirm availability for your document type.",
      href: "/notary-services/",
      icon: "pen" as const,
    },
    {
      slug: "business-support",
      title: "Business Support",
      description:
        "Practical tax and compliance support for small businesses, including planning conversations and organized year-round guidance.",
      href: "/business-support/",
      icon: "chart" as const,
    },
    {
      slug: "irs-tax-support",
      title: "IRS / Tax Resolution Support",
      description:
        "Help understanding IRS notices, correspondence, and next steps, so you can respond with confidence and clarity.",
      href: "/irs-tax-support/",
      icon: "landmark" as const,
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
