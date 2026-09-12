import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

const pngSize = (buffer) => ({
  width: buffer.readUInt32BE(16),
  height: buffer.readUInt32BE(20),
});

test("published pages expose canonical and social sharing metadata", async () => {
  execFileSync("npm", ["run", "build"], {
    cwd: projectRoot,
    stdio: "pipe",
  });

  const [homePage, productPage] = await Promise.all([
    readFile(new URL("dist/index.html", projectRoot), "utf8"),
    readFile(new URL("dist/tmg/index.html", projectRoot), "utf8"),
  ]);

  assert.match(homePage, /<link rel="canonical" href="https:\/\/tdatrans\.ru\/">/);
  assert.match(productPage, /<link rel="canonical" href="https:\/\/tdatrans\.ru\/tmg\/">/);
  assert.match(homePage, /href="\/alageum\/_astro\/[^" ]+\.css"/);
  assert.match(homePage, /src="\/alageum\/images\/hero-substation-background-v2\.webp"/);
  assert.match(homePage, /<meta property="og:site_name" content="Торговый Дом А-Транс">/);
  assert.match(homePage, /<meta property="og:title" content="Торговый Дом А-Транс — трансформаторное и подстанционное оборудование">/);
  assert.match(homePage, /<meta property="og:url" content="https:\/\/tdatrans\.ru\/">/);
  assert.match(homePage, /<meta property="og:image" content="https:\/\/tdatrans\.ru\/images\/social-preview\.png">/);
  assert.match(homePage, /<meta name="twitter:card" content="summary_large_image">/);
  assert.match(homePage, /<link rel="icon"[^>]*href="\/alageum\/favicon\.png">/);
  assert.match(homePage, /<link rel="apple-touch-icon"[^>]*href="\/alageum\/apple-touch-icon\.png">/);
});

test("sharing and browser icons have the declared dimensions", async () => {
  const paths = [
    new URL("public/images/social-preview.png", projectRoot),
    new URL("public/favicon.png", projectRoot),
    new URL("public/apple-touch-icon.png", projectRoot),
  ];

  paths.forEach((path) => assert.ok(existsSync(path), `${path.pathname} must exist`));

  const [preview, favicon, appleIcon] = await Promise.all(paths.map((path) => readFile(path)));

  assert.deepEqual(pngSize(preview), { width: 1200, height: 630 });
  assert.deepEqual(pngSize(favicon), { width: 64, height: 64 });
  assert.deepEqual(pngSize(appleIcon), { width: 180, height: 180 });
});
