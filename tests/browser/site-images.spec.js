import { test, expect } from "@playwright/test";
import { siteMedia } from "../../functions/site-media.js";
test("Studio previews, restores and saves every website image slot", async ({ page }) => {
  await page.goto("/admin");
  await page.getByRole("button", { name: "Store settings", exact: true }).click();
  for (const item of Object.values(siteMedia)) {
    const input=page.getByLabel(`${item.label} image URL`, { exact: true });
    await input.fill("/images/IMG-20260927-WA0028.jpg");
    await expect(page.getByAltText(`${item.label} preview`, { exact: true })).toHaveAttribute("src", "/images/IMG-20260927-WA0028.jpg");
  }
  await page.getByRole("button", { name: "Restore original", exact: true }).first().click();
  await expect(page.getByLabel("Brand logo image URL", { exact: true })).toHaveValue(siteMedia.logoImage.fallback);
  await page.getByLabel("Upload brand logo", { exact: true }).setInputFiles({ name: "unsafe.svg", mimeType: "image/svg+xml", buffer: Buffer.from("<svg/>") });
  await expect(page.getByRole("alert")).toContainText("JPEG, PNG, or WebP");
  await page.getByRole("button", { name: "Save store settings", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("saved");
  await page.getByRole("button", { name: "Overview", exact: true }).click();
  await page.getByRole("button", { name: "Store settings", exact: true }).click();
  await expect(page.getByLabel("Editorial — the palette image URL", { exact: true })).toHaveValue("/images/IMG-20260927-WA0028.jpg");
});
