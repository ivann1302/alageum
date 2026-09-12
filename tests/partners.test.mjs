import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectFile = (path) => new URL(`../${path}`, import.meta.url);

const expectedPartners = [
  ["КАТЭК", "Таврида Электрострой", "РНГ Снабжение", "ЭТМ", "РЖД"],
  ["Спецэнерго", "Электрощит Самара", "Россети Московский регион", "Оборонэнерго", "Мартин"],
];

test("partners run in two lanes with five unique logos in each lane", async () => {
  const source = await readFile(projectFile("src/components/Partners.astro"), "utf8");

  for (const row of expectedPartners) {
    for (const name of row) assert.match(source, new RegExp(`name: "${name}"`));
  }

  assert.match(source, /const partnerRows = \[[\s\S]*?\],\s*\[[\s\S]*?\],\s*\];/);
  assert.match(source, /partnerRows\.map\(\(partners, rowIndex\)/);
  assert.match(source, /partners\.map\(\(partner\)/);
  assert.match(source, /\[0, 1\]\.map/);
  assert.match(source, /partners-lane-\$\{rowIndex\}/);
  assert.doesNotMatch(source, /Alageum Electric|Торговый Дом А-Транс/);
});

test("partner artwork is transparent, normalized and loaded as images", async () => {
  const source = await readFile(projectFile("src/components/Partners.astro"), "utf8");
  const paths = [...source.matchAll(/src: "(images\/partners\/[^"]+)"/g)].map((match) => match[1]);

  assert.equal(paths.length, 10);
  assert.equal(new Set(paths).size, 10);
  await Promise.all(paths.map((path) => access(projectFile(`public/${path}`))));

  assert.match(source, /<img/);
  assert.match(source, /loading="lazy"/);
  assert.match(source, /subtitle: "МОСКОВСКИЙ РЕГИОН"/);
  assert.match(source, /class="partners-logo-caption"/);
  assert.match(source, /\.partners-logo img \{[^}]*max-width: 100%;[^}]*max-height: 100%;[^}]*object-fit: contain;/);
});
