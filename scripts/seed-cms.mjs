import { PrismaClient } from "@prisma/client";

const siteConfig = {
  ownerName: "Maxcieen Telford",
  ownerTitle: "Tax Professional & Notary Public",
  phoneDisplay: "(904) 930-8065",
  faxDisplay: "(904) 664-8180",
  email: "gtsolutions@pm.me",
  address: {
    line1: "7052 103rd St, Suite E301",
    line2: "Jacksonville, FL 32210",
    note: "Located inside the U-Haul security gate, adjacent to I-295",
  },
  mailingAddress: {
    line1: "P.O. Box 47013",
    line2: "Jacksonville, FL 32247",
  },
  announcement:
    "Professional Tax Preparation • Notary Services • Jacksonville, FL",
  services: [
    {
      slug: "tax-preparation",
      description:
        "Tax filing assistance for individuals, families, self-employed clients, and eligible businesses, with clear communication and organized support.",
    },
    {
      slug: "notary-services",
      description:
        "General notary services with convenient in-office and mobile appointment options. Contact us to confirm availability for your document type.",
    },
    {
      slug: "business-support",
      description:
        "Practical tax and compliance support for small businesses, including planning conversations and organized year-round guidance.",
    },
    {
      slug: "irs-tax-support",
      description:
        "Help understanding IRS notices, correspondence, and next steps, so you can respond with confidence and clarity.",
    },
  ],
};

const fields = [
  ["announcement", siteConfig.announcement],
  ["promo_enabled", "false"],
  ["promo_heading", "Tax season support is available"],
  [
    "promo_text",
    "Call or email for tax preparation, notary services, and year-round support.",
  ],
  ["promo_link_label", "Contact Us"],
  ["promo_link_href", "/contact/"],
  ["promo_image", ""],
  ["phone_display", siteConfig.phoneDisplay],
  ["fax_display", siteConfig.faxDisplay],
  ["email", siteConfig.email],
  ["office_line1", siteConfig.address.line1],
  ["office_line2", siteConfig.address.line2],
  ["office_note", siteConfig.address.note],
  ["mailing_line1", siteConfig.mailingAddress.line1],
  ["mailing_line2", siteConfig.mailingAddress.line2],
  ["owner_name", siteConfig.ownerName],
  ["owner_title", siteConfig.ownerTitle],
  ["about_headline", "A client-first approach to tax and notary support"],
  [
    "about_body",
    "Genesis Tax Solutions LLC, operating as Genesis Tax & Notary Solutions, helps individuals, families, and small businesses with tax preparation and notary services.\n\nThe focus is simple: clear communication, organized filing support, and practical guidance you can act on, whether you need seasonal filing help or assistance understanding an IRS notice.\n\nBased in Jacksonville, Florida, we offer in-person and virtual options designed around convenience.",
  ],
  [
    "about_teaser",
    "Serving clients from Jacksonville, Florida with careful preparation, clear explanations, and practical next steps for tax and notary needs.",
  ],
  ["service_tax-preparation_title", "Tax Preparation"],
  ["service_tax-preparation_summary", siteConfig.services[0].description],
  [
    "service_tax-preparation_body",
    "Whether you are an individual filer, a family household, or a self-employed professional, Genesis Tax & Notary Solutions helps you prepare and file with confidence. We focus on organized document intake, careful review, and plain-language explanations.",
  ],
  ["service_notary-services_title", "Notary Services"],
  ["service_notary-services_summary", siteConfig.services[1].description],
  [
    "service_notary-services_body",
    "Need a document notarized? We offer general notary services with flexible scheduling. Tell us what you need signed and we will confirm availability, required identification, and the best appointment format.",
  ],
  ["service_business-support_title", "Business Support"],
  ["service_business-support_summary", siteConfig.services[2].description],
  [
    "service_business-support_body",
    "Small businesses need clear tax guidance year-round. We help with organized records, practical planning conversations, and support that fits the way you work.",
  ],
  ["service_irs-tax-support_title", "IRS / Tax Resolution Support"],
  ["service_irs-tax-support_summary", siteConfig.services[3].description],
  [
    "service_irs-tax-support_body",
    "Received an IRS notice? We help you understand what it means, what documents matter, and what practical next steps look like so you can respond with clarity.",
  ],
  ["home_hero_image", ""],
  ["about_portrait_image", ""],
];

const prisma = new PrismaClient();

let upserted = 0;
for (const [key, value] of fields) {
  await prisma.siteSetting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
  upserted += 1;
}

console.log(`Seeded ${upserted} CMS settings`);
await prisma.$disconnect();
