import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

test("documentation page groups downloads in the requested order", async () => {
  execFileSync("npm", ["run", "build"], {
    cwd: projectRoot,
    stdio: "pipe",
  });

  const documentationPath = new URL("dist/documents/index.html", projectRoot);
  assert.ok(existsSync(documentationPath), "the /documents/ page must be generated");

  const [documentationPage, homePage, cssFiles] = await Promise.all([
    readFile(documentationPath, "utf8"),
    readFile(new URL("dist/index.html", projectRoot), "utf8"),
    readdir(new URL("dist/_astro/", projectRoot)),
  ]);
  const css = `${documentationPage}\n${homePage}\n${(
    await Promise.all(
      cssFiles
        .filter((file) => file.endsWith(".css"))
        .map((file) => readFile(new URL(`dist/_astro/${file}`, projectRoot), "utf8")),
    )
  ).join("\n")}`;

  assert.match(documentationPage, /<title>Документация на оборудование \| Торговый Дом А-Транс<\/title>/);
  assert.match(documentationPage, /<h1[^>]*>Документация<\/h1>/);
  const pageHeading = documentationPage.match(/<header class="documents-heading"[^>]*>[\s\S]*?<\/header>/)?.[0] ?? "";
  assert.doesNotMatch(pageHeading, /<p[^>]*>/);
  assert.match(
    documentationPage,
    /id="documents-questionnaires"[^>]*>Опросные листы<\/h2><p[^>]*>Опросные листы в форматах PDF, DOC и DOCX\.<\/p>/,
  );

  const sectionTitles = [...documentationPage.matchAll(/<h2[^>]*class="documents-group-title"[^>]*>([^<]+)<\/h2>/g)]
    .map(([, title]) => title);
  assert.deepEqual(sectionTitles, [
    "Опросные листы",
    "Габаритные чертежи",
    "Выписки из реестров",
    "Декларации",
  ]);

  const groupLabels = [...documentationPage.matchAll(/<section class="documents-group" aria-labelledby="([^"]+)"/g)]
    .map(([, label]) => label);
  assert.deepEqual(groupLabels, [
    "documents-questionnaires",
    "documents-dimensional-drawings",
    "documents-register-extracts",
    "documents-declarations",
  ]);
  groupLabels.forEach((label) => assert.match(documentationPage, new RegExp(`id="${label}"`)));

  const archiveLinks = [...documentationPage.matchAll(/href="(\/alageum\/downloads\/[^"]+\.zip)"[^>]*download/g)]
    .map(([, href]) => href);
  assert.deepEqual(archiveLinks, [
    "/alageum/downloads/questionnaires.zip",
    "/alageum/downloads/dimensional-drawings.zip",
  ]);
  for (const href of archiveLinks) {
    const relativePath = href.replace("/alageum/", "dist/");
    assert.ok(existsSync(new URL(relativePath, projectRoot)), `${href} must point to a published archive`);
  }

  const archiveCards = [...documentationPage.matchAll(/<article class="archive-download"[^>]*>([\s\S]*?)<\/article>/g)]
    .map(([, card]) => card);
  assert.equal(archiveCards.length, 2);
  assert.deepEqual(
    archiveCards.map((card) => card.match(/<p[^>]*>([^<]+)<\/p>/)?.[1]),
    ["40 МБ", "24 МБ"],
  );
  archiveCards.forEach((card) => {
    const visibleText = card.replace(/<[^>]+>/g, " ");
    assert.match(card, /<a class="button"[^>]*>[\s\S]*?Скачать архив[\s\S]*?<\/a>/);
    assert.doesNotMatch(card, /button-outline/);
    assert.doesNotMatch(visibleText, /ZIP|документ/i);
  });

  assert.equal(
    [...documentationPage.matchAll(/<h3 class="document-card-title"/g)].length,
    26,
    "every document title must be a semantic section heading",
  );
  assert.doesNotMatch(
    documentationPage,
    /document-card-(?:format|meta|action)/,
    "document cards must contain only the A4 preview and title",
  );

  const documentLinks = [...documentationPage.matchAll(/href="(\/alageum\/docs\/[^"]+\.pdf)"[^>]*data-document-trigger/g)];
  assert.equal(documentLinks.length, 26, "all 26 PDFs must be listed once");

  for (const [, href] of documentLinks) {
    const relativePath = decodeURIComponent(href.replace("/alageum/", "dist/"));
    assert.ok(existsSync(new URL(relativePath, projectRoot)), `${href} must point to a published PDF`);
  }

  const previewLinks = [...documentationPage.matchAll(/src="(\/alageum\/images\/documents\/[^"]+\.webp)"/g)];
  assert.equal(previewLinks.length, 26, "every document must have a preview");
  for (const [, src] of previewLinks) {
    const relativePath = src.replace("/alageum/", "dist/");
    const preview = await readFile(new URL(relativePath, projectRoot));
    assert.equal(preview.includes(Buffer.from("ALPH")), false, `${src} must use an opaque background`);
  }

  assert.match(homePage, /href="\/alageum\/documents\/"[^>]*>Все документы<\/a>/);
  const previewRule = css.match(/\.document-card-preview[^}]*\{([^}]*)\}/)?.[1] ?? "";
  assert.match(previewRule, /aspect-ratio:210\/297/);
  assert.doesNotMatch(previewRule, /background|border/);
  assert.match(css, /object-fit:contain/);
  assert.match(css, /--carousel-media-height:clamp\(240px,\s*24vw,\s*340px\)/);
  assert.match(css, /\.documentation-carousel[^}]*\.carousel-frame\{[^}]*max-width:906px/);
  assert.match(css, /\.documentation-carousel[^}]*\.carousel-frame\{[^}]*grid-template-columns:52px minmax\(0,778px\) 52px/);
  assert.match(css, /\.documentation-carousel[^}]*\.carousel-frame\{[^}]*column-gap:12px/);
  assert.match(css, /\.documentation-carousel[^}]*\.carousel-arrow\{[^}]*position:static/);
  assert.match(css, /@media\s*\((?:max-width:640px|width<=640px)\)[\s\S]*?\.documentation-carousel[^}]*\.carousel-frame\{[^}]*grid-template-columns:44px minmax\(0,297px\) 44px[^}]*column-gap:4px[^}]*max-width:393px/);
  assert.match(css, /\.documentation-head[^}]*\{[^}]*margin-bottom:56px/);
  assert.match(css, /@media\s*\((?:max-width:640px|width<=640px)\)[\s\S]*?\.documentation-head[^}]*margin-bottom:40px/);
  assert.match(css, /\.document-grid[^}]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
  assert.match(css, /@media\s*\((?:max-width:640px|width<=640px)\)[\s\S]*?\.document-grid[^}]*grid-template-columns:1fr/);
});

test("download archives contain documents but no executable or temporary files", () => {
  const archiveNames = ["questionnaires.zip", "dimensional-drawings.zip"];
  const blocked = /(?:^|\/)(?:Thumbs\.db|~\$)|\.(?:exe|scr|bat|pif|rar|zip)$/i;
  const allowed = /\.(?:pdf|docx?|jpe?g|png|cdw|dwg|dxf)$/i;

  for (const archiveName of archiveNames) {
    const archivePath = new URL(`../public/downloads/${archiveName}`, import.meta.url);
    assert.ok(existsSync(archivePath), `${archiveName} must exist`);

    const entries = execFileSync("bsdtar", ["-tf", archivePath.pathname], { encoding: "utf8" })
      .split("\n")
      .filter(Boolean)
      .filter((entry) => !entry.endsWith("/"));

    assert.ok(entries.length > 0, `${archiveName} must not be empty`);
    assert.equal(entries.some((entry) => blocked.test(entry)), false, `${archiveName} contains an unsafe file`);
    assert.equal(entries.every((entry) => allowed.test(entry)), true, `${archiveName} contains an unsupported file`);
  }
});

test("download archives do not mix questionnaires and dimensional drawings", () => {
  const listFiles = (archiveName) => execFileSync(
    "bsdtar",
    ["-tf", new URL(`../public/downloads/${archiveName}`, import.meta.url).pathname],
    { encoding: "utf8" },
  )
    .split("\n")
    .filter(Boolean)
    .filter((entry) => !entry.endsWith("/"))
    .map((entry) => path.posix.basename(entry));

  const questionnaires = listFiles("questionnaires.zip");
  const drawings = listFiles("dimensional-drawings.zip");

  assert.equal(
    questionnaires.some((name) => /(?:ГЧ|габарит)/i.test(name)),
    false,
    "questionnaires.zip contains a dimensional drawing",
  );
  assert.equal(
    drawings.some((name) => /опросн/i.test(name)),
    false,
    "dimensional-drawings.zip contains a questionnaire",
  );
});

test("homepage carousel presents document categories in the requested order", async () => {
  const homePage = await readFile(new URL("dist/index.html", projectRoot), "utf8");
  const kinds = [...homePage.matchAll(/data-document-kind="([^"]+)"/g)].map(([, kind]) => kind);
  const expectedOrder = [
    "Опросный лист",
    "Габаритный чертеж",
    "Выписка из реестра ЕАЭС",
    "Декларация соответствия",
  ];
  const ranks = kinds.map((kind) => expectedOrder.indexOf(kind));

  assert.deepEqual([...new Set(kinds)], expectedOrder);
  assert.equal(ranks.every((rank, index) => index === 0 || rank >= ranks[index - 1]), true);
});
