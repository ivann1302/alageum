import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const component = (name) =>
  readFile(new URL(`../src/components/${name}.astro`, import.meta.url), "utf8");

const getNavItems = (source, variableName) => {
  const block = source.match(new RegExp(`const ${variableName} = \\[([\\s\\S]*?)\\];`));
  assert.ok(block, `${variableName} is missing`);

  return [...block[1].matchAll(/\{ label: "([^"]+)", href: ([^}]+) \}/g)].map(
    ([, label, href]) => ({ label, href: href.trim() }),
  );
};

test("footer navigation matches the header navigation", async () => {
  const [header, footer] = await Promise.all([
    component("Header"),
    component("Footer"),
  ]);

  const headerItems = getNavItems(header, "navItems");
  const footerItems = getNavItems(footer, "footerNav");

  assert.deepEqual(footerItems, headerItems);
  assert.deepEqual(
    footerItems.map((item) => item.label),
    ["Каталог", "О компании", "Документация", "Контакты"],
  );
});
