import { siteConfig } from "@/lib/site-config";

export type ContentField = {
  key: string;
  label: string;
  section: "business" | "banners" | "about" | "services" | "media";
  rows?: number;
  hint?: string;
  defaultValue: string;
  type?: "text" | "textarea" | "image" | "toggle";
};

export const contentFields: ContentField[] = [
  {
    key: "announcement",
    label: "Announcement bar",
    section: "banners",
    rows: 2,
    defaultValue: siteConfig.announcement,
  },
  {
    key: "promo_enabled",
    label: "Show promo banner",
    section: "banners",
    type: "toggle",
    defaultValue: "false",
    hint: "Turns the homepage promo strip on or off.",
  },
  {
    key: "promo_heading",
    label: "Promo heading",
    section: "banners",
    defaultValue: "Tax season support is available",
  },
  {
    key: "promo_text",
    label: "Promo text",
    section: "banners",
    rows: 3,
    defaultValue:
      "Call or email for tax preparation, notary services, and year-round support.",
  },
  {
    key: "promo_link_label",
    label: "Promo button label",
    section: "banners",
    defaultValue: "Contact Us",
  },
  {
    key: "promo_link_href",
    label: "Promo button link",
    section: "banners",
    defaultValue: "/contact/",
  },
  {
    key: "promo_image",
    label: "Promo image",
    section: "banners",
    type: "image",
    defaultValue: "",
    hint: "Optional. Upload a JPG, PNG, or WebP.",
  },
  {
    key: "phone_display",
    label: "Phone display",
    section: "business",
    defaultValue: siteConfig.phoneDisplay,
  },
  {
    key: "fax_display",
    label: "Fax display",
    section: "business",
    defaultValue: siteConfig.faxDisplay,
  },
  {
    key: "email",
    label: "Public email",
    section: "business",
    defaultValue: siteConfig.email,
  },
  {
    key: "office_line1",
    label: "Office address line 1",
    section: "business",
    defaultValue: siteConfig.address.line1,
  },
  {
    key: "office_line2",
    label: "Office address line 2",
    section: "business",
    defaultValue: siteConfig.address.line2,
  },
  {
    key: "office_note",
    label: "Office note",
    section: "business",
    rows: 2,
    defaultValue: siteConfig.address.note,
  },
  {
    key: "mailing_line1",
    label: "Mailing address line 1",
    section: "business",
    defaultValue: siteConfig.mailingAddress.line1,
  },
  {
    key: "mailing_line2",
    label: "Mailing address line 2",
    section: "business",
    defaultValue: siteConfig.mailingAddress.line2,
  },
  {
    key: "owner_name",
    label: "Owner name",
    section: "about",
    defaultValue: siteConfig.ownerName,
  },
  {
    key: "owner_title",
    label: "Owner title",
    section: "about",
    defaultValue: siteConfig.ownerTitle,
  },
  {
    key: "about_headline",
    label: "About headline",
    section: "about",
    defaultValue: "A client-first approach to tax and notary support",
  },
  {
    key: "about_body",
    label: "About page body",
    section: "about",
    rows: 8,
    defaultValue:
      "Genesis Tax Solutions LLC, operating as Genesis Tax & Notary Solutions, helps individuals, families, and small businesses with tax preparation and notary services.\n\nThe focus is simple: clear communication, organized filing support, and practical guidance you can act on, whether you need seasonal filing help or assistance understanding an IRS notice.\n\nBased in Jacksonville, Florida, we offer in-person and virtual options designed around convenience.",
  },
  {
    key: "about_teaser",
    label: "Homepage about teaser",
    section: "about",
    rows: 4,
    defaultValue:
      "Serving clients from Jacksonville, Florida with careful preparation, clear explanations, and practical next steps for tax and notary needs.",
  },
  {
    key: "service_tax-preparation_title",
    label: "Tax Preparation title",
    section: "services",
    defaultValue: "Tax Preparation",
  },
  {
    key: "service_tax-preparation_summary",
    label: "Tax Preparation summary",
    section: "services",
    rows: 3,
    defaultValue: siteConfig.services[0].description,
  },
  {
    key: "service_tax-preparation_body",
    label: "Tax Preparation page body",
    section: "services",
    rows: 5,
    defaultValue:
      "Whether you are an individual filer, a family household, or a self-employed professional, Genesis Tax & Notary Solutions helps you prepare and file with confidence. We focus on organized document intake, careful review, and plain-language explanations.",
  },
  {
    key: "service_notary-services_title",
    label: "Notary Services title",
    section: "services",
    defaultValue: "Notary Services",
  },
  {
    key: "service_notary-services_summary",
    label: "Notary Services summary",
    section: "services",
    rows: 3,
    defaultValue: siteConfig.services[1].description,
  },
  {
    key: "service_notary-services_body",
    label: "Notary Services page body",
    section: "services",
    rows: 5,
    defaultValue:
      "Need a document notarized? We offer general notary services with flexible scheduling. Tell us what you need signed and we will confirm availability, required identification, and the best appointment format.",
  },
  {
    key: "service_business-support_title",
    label: "Business Support title",
    section: "services",
    defaultValue: "Business Support",
  },
  {
    key: "service_business-support_summary",
    label: "Business Support summary",
    section: "services",
    rows: 3,
    defaultValue: siteConfig.services[2].description,
  },
  {
    key: "service_business-support_body",
    label: "Business Support page body",
    section: "services",
    rows: 5,
    defaultValue:
      "Small businesses need clear tax guidance year-round. We help with organized records, practical planning conversations, and support that fits the way you work.",
  },
  {
    key: "service_irs-tax-support_title",
    label: "IRS / Tax Resolution title",
    section: "services",
    defaultValue: "IRS / Tax Resolution Support",
  },
  {
    key: "service_irs-tax-support_summary",
    label: "IRS / Tax Resolution summary",
    section: "services",
    rows: 3,
    defaultValue: siteConfig.services[3].description,
  },
  {
    key: "service_irs-tax-support_body",
    label: "IRS / Tax Resolution page body",
    section: "services",
    rows: 5,
    defaultValue:
      "Received an IRS notice? We help you understand what it means, what documents matter, and what practical next steps look like so you can respond with clarity.",
  },
  {
    key: "home_hero_image",
    label: "Homepage hero image override",
    section: "media",
    type: "image",
    defaultValue: "",
    hint: "Leave blank to keep the current branded hero image.",
  },
  {
    key: "about_portrait_image",
    label: "About portrait image override",
    section: "media",
    type: "image",
    defaultValue: "",
    hint: "Leave blank to keep the current portrait.",
  },
];

export const contentSections = [
  { id: "business", label: "Business info" },
  { id: "banners", label: "Announcement & promo" },
  { id: "about", label: "About copy" },
  { id: "services", label: "Services" },
  { id: "media", label: "Images" },
] as const;

export function phoneTelFromDisplay(display: string) {
  const digits = display.replace(/\D/g, "");
  if (!digits) return siteConfig.phoneTel;
  return digits.startsWith("1") ? `+${digits}` : `+1${digits}`;
}
