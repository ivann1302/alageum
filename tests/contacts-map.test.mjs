import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectFile = (path) => new URL(`../${path}`, import.meta.url);
const projectRoot = new URL("../", import.meta.url);

test("contacts and Yandex map use the new Moscow office address", async () => {
  const [contactData, contactsPage] = await Promise.all([
    readFile(projectFile("src/data/contact.ts"), "utf8"),
    readFile(projectFile("src/pages/contacts/index.astro"), "utf8"),
  ]);

  assert.match(
    contactData,
    /officeAddress = "г\. Москва, ул\. Ленинская Слобода, д\. 26, офис 537\.3"/,
  );
  assert.match(contactData, /officeMapCenter = "37\.654610,55\.710130"/);
  assert.match(contactsPage, /mode: "search"/);
  assert.match(contactsPage, /const mapQuery = "Ленинская Слобода 26"/);
  assert.match(contactsPage, /text: mapQuery/);
  assert.match(contactsPage, /ll: officeMapCenter/);
  assert.match(contactsPage, /title=\{`Яндекс Карта: \$\{address\}`\}/);
});

test("primary contacts action opens an email instead of a phone call", async () => {
  execFileSync("npm", ["run", "build"], {
    cwd: projectRoot,
    stdio: "pipe",
  });

  const contactsPage = await readFile(new URL("dist/contacts/index.html", projectRoot), "utf8");
  const quickActions = contactsPage.match(/<div class="contacts-actions"[^>]*>[\s\S]*?<\/div>/)?.[0] ?? "";

  assert.match(quickActions, /href="mailto:info@tdatrans\.ru"[^>]*><span[^>]*>Написать на почту<\/span>/);
  assert.doesNotMatch(quickActions, /href="tel:/);
});
