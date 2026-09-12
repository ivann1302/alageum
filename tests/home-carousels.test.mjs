import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectFile = (path) => new URL(`../${path}`, import.meta.url);

test("carousel navigation wraps in both directions", async () => {
  const scriptUrl = projectFile("src/scripts/circular-carousel.mjs");
  let scriptExists = true;

  try {
    await access(scriptUrl);
  } catch {
    scriptExists = false;
  }

  assert.equal(scriptExists, true, "circular carousel script is missing");

  const { wrapCarouselIndex } = await import(scriptUrl.href);
  assert.equal(wrapCarouselIndex(0, -1, 10), 9);
  assert.equal(wrapCarouselIndex(9, 1, 10), 0);
  assert.equal(wrapCarouselIndex(1, 1, 4), 2);
});

test("catalog and documentation use the circular carousel", async () => {
  const carouselUrl = projectFile("src/components/Carousel.astro");
  const documentationCarouselUrl = projectFile("src/components/DocumentationCarousel.astro");
  let componentsExist = true;

  try {
    await Promise.all([access(carouselUrl), access(documentationCarouselUrl)]);
  } catch {
    componentsExist = false;
  }

  assert.equal(componentsExist, true, "separate carousel components are missing");

  const [carousel, catalog, documentation, documentationCarousel] = await Promise.all([
    readFile(carouselUrl, "utf8"),
    readFile(projectFile("src/components/CatalogTeaser.astro"), "utf8"),
    readFile(projectFile("src/components/Documentation.astro"), "utf8"),
    readFile(documentationCarouselUrl, "utf8"),
  ]);

  assert.match(carousel, /data-circular-carousel/);
  assert.match(carousel, /data-carousel-viewport/);
  assert.match(catalog, /import Carousel from/);
  assert.match(catalog, /<Carousel/);
  assert.match(documentation, /import DocumentationCarousel from/);
  assert.match(documentation, /<DocumentationCarousel\s*\/>/);
  assert.match(documentationCarousel, /import Carousel from/);
  assert.match(documentationCarousel, /<Carousel/);
  assert.match(documentationCarousel, /data-carousel-item/);
  assert.doesNotMatch(documentationCarousel, /Материалы готовятся|documentation-file|documentation-card-copy/);
});

test("empty document blocks open a closable native dialog", async () => {
  const componentUrl = projectFile("src/components/DocumentationCarousel.astro");
  let componentExists = true;

  try {
    await access(componentUrl);
  } catch {
    componentExists = false;
  }

  assert.equal(componentExists, true, "documentation carousel component is missing");
  const source = await readFile(componentUrl, "utf8");

  assert.match(source, /<dialog/);
  assert.match(source, /data-document-trigger/);
  assert.match(source, /data-document-close/);
  assert.match(source, /showModal\(\)/);
  assert.match(source, /event\.target === dialog/);
  assert.match(source, /dialog\.close\(\)/);
});

test("documentation is rendered immediately after the CTA", async () => {
  const home = await readFile(projectFile("src/pages/index.astro"), "utf8");

  assert.match(home, /<Cta\s*\/>\s*<Documentation\s*\/>/);
});
