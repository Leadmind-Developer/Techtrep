import type { MetadataRoute } from "next";

const baseUrl = "https://business.thetechtrep.com";

const routes = [
  // Core
  "/",
  "/free-technology-audit",
  "/contact",
  "/about",
  "/how-we-work",
  "/case-studies",

  // Solutions
  "/solutions",
  "/solutions/digital-foundation",
  "/solutions/business-automation",
  "/solutions/ai-business-solutions",
  "/solutions/dashboards-analytics",
  "/solutions/custom-technology",
  "/solutions/networking-infrastructure",
  "/solutions/managed-technology",

  // Industries
  "/industries",
  "/industries/schools",
  "/industries/hotels",
  "/industries/clinics",
  "/industries/churches",
  "/industries/media-entertainment",
  "/industries/other-industries",

  // Legal
  "/privacy-policy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency:
      path === "/" || path === "/solutions" || path === "/industries"
        ? "weekly"
        : "monthly",
    priority:
      path === "/"
        ? 1
        : path === "/free-technology-audit"
          ? 0.9
          : path === "/contact"
            ? 0.8
            : path === "/solutions" || path === "/industries"
              ? 0.8
              : 0.7,
  }));
}