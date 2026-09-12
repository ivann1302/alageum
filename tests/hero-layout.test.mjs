import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const heroUrl = new URL("../src/components/Hero.astro", import.meta.url);

test("desktop hero lead stays on two intentional lines", async () => {
  const source = await readFile(heroUrl, "utf8");

  assert.match(
    source,
    /<p class="hero-lead">\s*<span class="hero-lead-line">Трансформаторное и подстанционное<\/span>\s*<span class="hero-lead-line">оборудование для промышленных объектов<\/span>\s*<\/p>/,
  );
  assert.match(source, /\.hero-lead-line \{ display: block; white-space: nowrap; \}/);
  assert.match(
    source,
    /@media \(max-width: 640px\) \{[\s\S]*?\.hero-lead-line \{ display: inline; white-space: normal; \}/,
  );
});
