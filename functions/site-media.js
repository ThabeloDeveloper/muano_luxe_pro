// Public image slots shared by the storefront, Studio and image redirect handler.
export const siteMedia = {
  logoImage: { label: "Brand logo", fallback: "/images/muanoluxe-logo.jpg" },
  faviconImage: { label: "Browser and search icon", fallback: "/images/muanoluxe-logo.jpg" },
  socialImage: { label: "Social sharing image", fallback: "/images/legacy-campaign.png" },
  heroImage: { label: "Homepage hero", fallback: "/images/legacy-campaign.png" },
  storyImage: { label: "Brand story", fallback: "/images/IMG-20260927-WA0031.jpg" },
  visionImage: { label: "Editorial — the vision", fallback: "/images/IMG-20260927-WA0025.jpg" },
  paletteImage: { label: "Editorial — the palette", fallback: "/images/IMG-20260927-WA0024.jpg" },
  signatureImage: { label: "Editorial — the signature", fallback: "/images/IMG-20260927-WA0021.jpg" },
  informationImage: { label: "Collection, about and contact pages", fallback: "/images/legacy-campaign.png" },
};
export const mediaDefaults = Object.fromEntries(Object.entries(siteMedia).map(([key, value]) => [key, value.fallback]));
