import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

test("supply steps reveal in order with a short stagger", async () => {
  execFileSync("npm", ["run", "build"], {
    cwd: projectRoot,
    stdio: "pipe",
  });

  const homePage = await readFile(new URL("dist/index.html", projectRoot), "utf8");
  const processSection = homePage.match(
    /<section class="supply-process"[\s\S]*?<\/section>/,
  )?.[0];

  assert.ok(processSection, "the supply process section must be present");

  const revealDelays = [...processSection.matchAll(
    /class="supply-process-step"[^>]*data-reveal="item"[^>]*style="--reveal-delay: (\d+)ms;"/g,
  )].map((match) => Number(match[1]));

  assert.deepEqual(revealDelays, [0, 120, 240]);
});
