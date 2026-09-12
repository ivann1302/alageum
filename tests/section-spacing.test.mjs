import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readComponent = (name) =>
  readFile(new URL(`../src/components/${name}`, import.meta.url), "utf8");

test("adds extra desktop space below the supply process", async () => {
  const source = await readComponent("SupplyProcess.astro");

  assert.match(source, /\.supply-process \{[^}]*padding-bottom: 24px;/);
  assert.match(
    source,
    /@media \(max-width: 768px\) \{[\s\S]*?\.supply-process \{ padding-bottom: 0; \}/,
  );
});

test("uses roomier desktop spacing in the partners section", async () => {
  const source = await readComponent("Partners.astro");

  assert.match(source, /\.partners \{[^}]*padding-block: 64px;/);
  assert.match(source, /\.partners-heading \{ margin-bottom: 40px; \}/);
  assert.match(source, /\.partners-lanes \{ display: grid; gap: 28px; \}/);

  assert.match(
    source,
    /@media \(max-width: 640px\) \{[\s\S]*?\.partners \{ padding-block: 32px; \}/,
  );
  assert.match(source, /\.partners-heading \{ margin-bottom: 20px; \}/);
  assert.match(source, /\.partners-lanes \{ gap: 12px; \}/);
});

test("uses thin forward chevrons between desktop supply steps", async () => {
  const source = await readComponent("SupplyProcess.astro");

  assert.match(
    source,
    /\.supply-process-step:not\(:last-child\)::after \{[^}]*width: 28px;[^}]*height: 28px;[^}]*border-top: 2px solid var\(--color-primary\);[^}]*border-right: 2px solid var\(--color-primary\);[^}]*rotate\(45deg\);/,
  );
  assert.match(
    source,
    /@media \(max-width: 768px\) \{[\s\S]*?\.supply-process-step:not\(:last-child\)::after \{[^}]*width: 2px;[^}]*height: auto;[^}]*transform: none;/,
  );
});
