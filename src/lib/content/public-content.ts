import { cacheTag } from "next/cache";
import { contentFields, phoneTelFromDisplay } from "@/lib/content/catalog";
import { prisma } from "@/lib/db";
import { siteConfig } from "@/lib/site-config";

export const SITE_CONTENT_TAG = "site-content";

export type PublicContent = {
  announcement: string;
  promoEnabled: boolean;
  promoHeading: string;
  promoText: string;
  promoLinkLabel: string;
  promoLinkHref: string;
  promoImage: string;
  phoneDisplay: string;
  phoneTel: string;
  faxDisplay: string;
  email: string;
  address: {
    line1: string;
    line2: string;
    note: string;
  };
  mailingAddress: {
    line1: string;
    line2: string;
  };
  ownerName: string;
  ownerTitle: string;
  aboutHeadline: string;
  aboutBody: string;
  aboutTeaser: string;
  homeHeroImage: string;
  aboutPortraitImage: string;
  services: Array<{
    slug: string;
    title: string;
    summary: string;
    body: string;
    href: string;
    icon: "calculator" | "pen" | "chart" | "landmark";
  }>;
};

function valueMap(rows: { key: string; value: string }[]) {
  return Object.fromEntries(rows.map((row) => [row.key, row.value]));
}

function pick(
  map: Record<string, string>,
  key: string,
  fallback: string,
) {
  const value = map[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

function publicLink(href: string) {
  if (href === "/book-appointment" || href === "/book-appointment/") {
    return "/contact/";
  }
  return href;
}

export async function getContentMap() {
  "use cache";
  cacheTag(SITE_CONTENT_TAG);

  const defaults = Object.fromEntries(
    contentFields.map((field) => [field.key, field.defaultValue]),
  );

  try {
    const rows = await prisma.siteSetting.findMany();
    return { ...defaults, ...valueMap(rows) };
  } catch {
    return defaults;
  }
}

export async function getPublicContent(): Promise<PublicContent> {
  "use cache";
  cacheTag(SITE_CONTENT_TAG);

  const map = await getContentMap();

  return {
    announcement: pick(map, "announcement", siteConfig.announcement),
    promoEnabled: pick(map, "promo_enabled", "false") === "true",
    promoHeading: pick(map, "promo_heading", "Tax season support is available"),
    promoText: pick(
      map,
      "promo_text",
      "Call or email for tax preparation, notary services, and year-round support.",
    ),
    promoLinkLabel: pick(map, "promo_link_label", "Contact Us"),
    promoLinkHref: publicLink(
      pick(map, "promo_link_href", "/contact/"),
    ),
    promoImage: pick(map, "promo_image", ""),
    phoneDisplay: pick(map, "phone_display", siteConfig.phoneDisplay),
    phoneTel: phoneTelFromDisplay(
      pick(map, "phone_display", siteConfig.phoneDisplay),
    ),
    faxDisplay: pick(map, "fax_display", siteConfig.faxDisplay),
    email: pick(map, "email", siteConfig.email),
    address: {
      line1: pick(map, "office_line1", siteConfig.address.line1),
      line2: pick(map, "office_line2", siteConfig.address.line2),
      note: pick(map, "office_note", siteConfig.address.note),
    },
    mailingAddress: {
      line1: pick(map, "mailing_line1", siteConfig.mailingAddress.line1),
      line2: pick(map, "mailing_line2", siteConfig.mailingAddress.line2),
    },
    ownerName: pick(map, "owner_name", siteConfig.ownerName),
    ownerTitle: pick(map, "owner_title", siteConfig.ownerTitle),
    aboutHeadline: pick(
      map,
      "about_headline",
      "A client-first approach to tax and notary support",
    ),
    aboutBody: pick(map, "about_body", ""),
    aboutTeaser: pick(map, "about_teaser", ""),
    homeHeroImage: pick(map, "home_hero_image", ""),
    aboutPortraitImage: pick(map, "about_portrait_image", ""),
    services: siteConfig.services.map((service) => ({
      slug: service.slug,
      title: pick(map, `service_${service.slug}_title`, service.title),
      summary: pick(
        map,
        `service_${service.slug}_summary`,
        service.description,
      ),
      body: pick(map, `service_${service.slug}_body`, service.description),
      href: service.href,
      icon: service.icon,
    })),
  };
}
