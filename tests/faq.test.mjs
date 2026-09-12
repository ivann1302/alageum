import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const faqUrl = new URL("../src/components/Faq.astro", import.meta.url);

test("FAQ includes the warranty terms in visible content and schema data", async () => {
  const source = await readFile(faqUrl, "utf8");

  assert.match(source, /question: "Какая гарантия действует на оборудование\?"/);
  assert.match(
    source,
    /Стандартная гарантия — 3,5 года\. По запросу предоставляется расширенная гарантия до 5 лет\./,
  );
  assert.match(source, /mainEntity: faqs\.map/);
});

test("FAQ behaves as one smooth accordion with a reduced-motion fallback", async () => {
  const source = await readFile(faqUrl, "utf8");

  assert.match(source, /<details[\s\S]*?name="faq"/);
  assert.match(source, /event\.preventDefault\(\)/);
  assert.match(source, /faqItems\.find\(\(item\) => item !== details && item\.open\)/);
  assert.match(source, /answer\.animate\(/);
  assert.match(source, /duration: 360/);
  assert.match(source, /transform: "translateY\(-6px\)"/);
  assert.match(source, /await Promise\.all\(\[animateFaq\(current, false\), animateFaq\(details, true\)\]\)/);
  assert.match(source, /prefers-reduced-motion: reduce/);
  assert.match(source, /reducedMotion\.matches/);
});
