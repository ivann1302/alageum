import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

test("documentation page publishes every PDF with a readable responsive grid", async () => {
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
  assert.equal(
    [...documentationPage.matchAll(/<h2 class="document-card-title"/g)].length,
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
