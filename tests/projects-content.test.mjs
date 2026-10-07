import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

// Hand-checked against the customer cells (including A5:A8) in the supplied workbook.
const expectedProjects = [
  { customer: "ООО «Грачевка»", models: ["ТМН-4000/35-11 кВ"], photos: [7, 8, 9] },
  { customer: "ОАО «СЗЛ»", models: ["ТМН-4000/35-6,3 кВ"], photos: [7, 8, 9] },
  {
    customer: "ТД Электротехмонтаж АО",
    models: ["ТМН-4000/35-6,3 кВ", "ТМН-4000/35-11 кВ", "ТМН-4000/35-6,3 кВ", "ТРДН-80000/220 кВ"],
    photos: [7, 8, 9, 10],
  },
  { customer: "ООО «ТЭС Инжиниринг»", models: ["ТМН-6300/35-10 кВ"], photos: [2, 3, 4, 5, 6] },
  { customer: "ООО «ТЭС»", models: ["ТМ-6300/35-6,3 кВ"], photos: [2, 3, 4, 5, 6] },
  { customer: "ООО «ФК Групп»", models: ["ТРДН-80000/110-ХЛ1"], photos: [11] },
  { customer: "МУП «Борисоглебская горэлектросеть»", models: ["ТДНС-16000/36,75-6,3 кВ"], photos: [1] },
];

test("homepage associates every customer's supplies and photos with the new workbook", async () => {
  execFileSync("npm", ["run", "build"], { cwd: projectRoot, stdio: "pipe" });
  const home = await readFile(new URL("dist/index.html", projectRoot), "utf8");
  const cases = [...home.matchAll(/<article\b[^>]*data-project-case[^>]*>([\s\S]*?)<\/article>/g)]
    .map(([, content]) => content);

  assert.equal(cases.length, 7, "all seven customers must have a project");

  for (const [index, expected] of expectedProjects.entries()) {
    const content = cases[index];
    assert.ok(content.includes(expected.customer), `${expected.customer} must identify its project`);
    const supplies = [...content.matchAll(/<li\b[^>]*class="project-supply"[^>]*>([\s\S]*?)<\/li>/g)]
      .map(([, supply]) => supply);
    assert.equal(supplies.length, expected.models.length, `${expected.customer}: every supply row must remain visible`);
    supplies.forEach((supply, supplyIndex) => {
      assert.ok(supply.includes(expected.models[supplyIndex]), `${expected.customer}: incorrect model`);
      assert.doesNotMatch(supply.replace(/<[^>]+>/g, " "), /\d+\s+шт\./, `${expected.customer}: quantity labels must be omitted`);
    });

    const characteristics = content.match(/<details\b[^>]*class="project-characteristics"[^>]*>([\s\S]*?)<\/details>/)?.[1];
    assert.ok(characteristics, `${expected.customer}: mobile characteristics must be available in HTML`);
    assert.deepEqual(
      [...characteristics.matchAll(/<strong[^>]*>([^<]+)<\/strong>/g)].map(([, model]) => model),
      index === 2 ? ["ТМН-4000/35-6,3 кВ", "ТМН-4000/35-11 кВ", "ТРДН-80000/220 кВ"] : expected.models,
      `${expected.customer}: characteristics must preserve distinct models without repeats`,
    );

    const photoPaths = [...content.matchAll(/<figure\b[^>]*data-project-photo[^>]*>[\s\S]*?<img\b[^>]*src="([^"]+)"/g)]
      .map(([, src]) => src);
    assert.deepEqual(
      photoPaths.map((src) => Number(src.match(/photo-(\d+)\.webp$/)?.[1])),
      expected.photos,
      `${expected.customer}: photos must follow the workbook's assignments`,
    );
    for (const src of photoPaths) {
      assert.ok(existsSync(new URL(src.replace("/alageum/", "dist/"), projectRoot)), `${src} must be published`);
    }
  }
});
