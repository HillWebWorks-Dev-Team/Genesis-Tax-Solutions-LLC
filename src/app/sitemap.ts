import type { MetadataRoute } from "next";

const routes = [
  "/",
  "/tax-preparation/",
  "/notary-services/",
  "/business-support/",
  "/irs-tax-support/",
  "/about/",
  "/book-appointment/",
  "/contact/",
  "/resources/",
  "/privacy-policy/",
  "/terms/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://gtsnotarytax.com";

  return routes.map((route) => ({
    url: `${base}${route}`,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
