import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

test("the built site exposes company and privacy information from every page", async () => {
  execFileSync("npm", ["run", "build"], {
    cwd: projectRoot,
    stdio: "pipe",
  });

  const [legalPage, homePage, contactsPage] = await Promise.all([
    readFile(new URL("dist/legal/index.html", projectRoot), "utf8"),
    readFile(new URL("dist/index.html", projectRoot), "utf8"),
    readFile(new URL("dist/contacts/index.html", projectRoot), "utf8"),
  ]);

  assert.match(legalPage, /<title>Юридическая информация \| Торговый Дом А-Транс<\/title>/);
  assert.match(legalPage, /<h1[^>]*>Юридическая информация<\/h1>/);
  assert.match(legalPage, /ООО «Торговый Дом А-Транс»/);
  assert.match(legalPage, /г\. Москва, ул\. Ленинская Слобода, д\. 26, офис 537\.3/);
  assert.match(legalPage, /href="tel:\+79776920194"/);
  assert.match(legalPage, /href="mailto:info@tdatrans\.ru"/);
  assert.match(legalPage, /id="privacy"/);
  assert.match(legalPage, /техническ(?:ие|их) данн(?:ые|ых)/i);

  assert.match(homePage, /href="\/alageum\/legal\/"[^>]*>Юридическая информация<\/a>/);
  assert.match(homePage, /href="\/alageum\/legal\/#privacy"[^>]*>Конфиденциальность<\/a>/);
  assert.match(contactsPage, /href="mailto:info@tdatrans\.ru"/);
  assert.doesNotMatch(`${legalPage}${homePage}${contactsPage}`, /info@alageum\.pro/);
});
