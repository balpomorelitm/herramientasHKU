import { test, expect } from "@playwright/test";
test("course grouping, live search, language, theme, empty state and ordering", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator(".tool-card")).toHaveCount(26);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.locator('[data-course="SPAN1001"]').click();
  await expect(
    page.locator("#collection section").first().locator("h2"),
  ).toHaveText("For SPAN1001");
  await expect(page.locator("#tool-profebot")).toBeVisible();
  await expect(page.locator("#tool-palabrero .variant-link")).toHaveCount(3);
  await expect(page.locator("#tool-palabrero .is-selected")).toContainText(
    "SPAN1001",
  );
  await expect(page.locator("#tool-conjugator")).toBeVisible();
  await page.locator('[data-course="SPAN2001"]').click();
  await expect(page.locator("#tool-profebot")).toHaveCount(0);
  await expect(page.locator("#tool-latido-latino")).toBeVisible();
  await page.locator("#resetBtn").click();
  await page.locator("#searchInput").fill("COMPRENSION ORAL");
  await page.locator("#typeFilter").selectOption("activity");
  await expect(page.locator("#tool-mocktest-span1002")).toBeVisible();
  await page.locator("#languageBtn").click();
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.locator("#tool-mocktest-span1002 .open-link")).toContainText(
    "Abrir",
  );
  await page.locator("#themeBtn").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.locator("#searchInput").fill("nothingmatcheszz");
  await expect(page.locator(".empty-state")).toContainText("No hay resultados");
  await page.locator(".empty-state button").click();
  await expect(page.locator(".tool-card")).toHaveCount(26);
  await page.locator("#sortFilter").selectOption("date");
  await expect(page).toHaveURL(/sort=date/);
  expect(errors).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("deep links, galleries, keyboard and clipboard fallback", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "clipboard", {
      get: () => ({
        writeText: async () => {
          throw new Error("disabled");
        },
      }),
    }),
  );
  await page.goto("/?tool=palabrero&course=SPAN1002&lang=es");
  const card = page.locator("#tool-palabrero");
  await expect(card).toHaveClass(/is-target/);
  await expect(card).toBeFocused();
  await expect(card.locator(".is-selected")).toContainText("SPAN1002");
  await card.locator(".thumbnail-button").click();
  await expect(page.locator("#galleryDialog")).toBeVisible();
  await expect(page.locator("#galleryCaption")).toContainText("1 / 3");
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#galleryCaption")).toContainText("2 / 3");
  await expect
    .poll(() =>
      page
        .locator("#galleryImage")
        .evaluate((img) => img.complete && img.naturalWidth > 0),
    )
    .toBe(true);
  await page.keyboard.press("Escape");
  await expect(page.locator("#galleryDialog")).not.toBeVisible();
  await expect(card.locator(".thumbnail-button")).toBeFocused();
  await card.locator(".share-tool").click();
  await expect(page.locator("#shareDialog")).toBeVisible();
  await expect(page.locator("#shareUrl")).toHaveValue(
    /tool=palabrero&course=SPAN1002&lang=es/,
  );
  await page.keyboard.press("Escape");
  await page.locator("#shareFiltersBtn").click();
  await expect(page.locator("#shareUrl")).toHaveValue(/course=SPAN1002/);
});
test("storage unavailable, fetch retry and all thumbnails load", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get: () => {
        throw new Error("Storage blocked");
      },
    });
  });
  let fail = true;
  await page.route("**/tools.json", (route) =>
    fail
      ? route.fulfill({ status: 503, body: "unavailable" })
      : route.continue(),
  );
  await page.goto("/");
  await expect(page.locator(".empty-state")).toContainText(
    "could not be loaded",
  );
  fail = false;
  await page.locator(".empty-state button").click();
  await expect(page.locator(".tool-card")).toHaveCount(26);
  await page.locator("#themeBtn").click();
  const broken = await page
    .locator(".thumbnail-button img")
    .evaluateAll(async (imgs) => {
      await Promise.all(
        imgs.map((img) => {
          img.loading = "eager";
          return img.decode().catch(() => {});
        }),
      );
      return imgs.filter((img) => !img.naturalWidth).map((img) => img.src);
    });
  expect(broken).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
