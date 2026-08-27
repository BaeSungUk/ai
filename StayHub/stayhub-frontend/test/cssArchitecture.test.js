import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(root, "src");

const imports = [
  "./styles/tokens.css",
  "./styles/base.css",
  "./styles/layout.css",
  "./styles/components.css",
  "./styles/hotel.css",
  "./styles/room.css",
  "./styles/reservation.css",
  "./styles/auth.css",
  "./styles/responsive.css",
];

const assertBalancedBraces = (source, filename) => {
  const stripped = source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, "");
  let depth = 0;

  for (const character of stripped) {
    if (character === "{") depth += 1;
    if (character === "}") depth -= 1;
    assert.ok(depth >= 0, `${filename} closes a block before opening it`);
  }

  assert.equal(depth, 0, `${filename} has unbalanced braces`);
};

test("index.css imports each responsibility stylesheet in order", async () => {
  const source = await readFile(path.join(sourceRoot, "index.css"), "utf8");
  const actualImports = [...source.matchAll(/@import\s+["']([^"']+)["'];/g)].map(
    (match) => match[1],
  );

  assert.deepEqual(actualImports, imports);
  assert.equal(source.replace(/@import\s+["'][^"']+["'];/g, "").trim(), "");

  for (const importedFile of imports) {
    assert.ok(existsSync(path.resolve(sourceRoot, importedFile)));
  }
});

test("split stylesheets have balanced blocks and cover literal JSX classes", async () => {
  const styleFiles = imports.map((item) => path.resolve(sourceRoot, item));
  const styleSources = await Promise.all(styleFiles.map((file) => readFile(file, "utf8")));
  styleSources.forEach((source, index) => assertBalancedBraces(source, styleFiles[index]));
  const allCss = styleSources.join("\n");

  const jsxFiles = (await readdir(sourceRoot, { recursive: true }))
    .filter((file) => file.endsWith(".jsx"));
  const jsxSources = await Promise.all(
    jsxFiles.map((file) => readFile(path.join(sourceRoot, file), "utf8")),
  );
  const classes = new Set();

  for (const source of jsxSources) {
    for (const match of source.matchAll(/className="([^"]+)"/g)) {
      match[1].split(/\s+/).filter(Boolean).forEach((name) => classes.add(name));
    }
  }

  const missing = [...classes].filter(
    (name) => !new RegExp(`\\.${name.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}(?![\\w-])`).test(allCss),
  );
  assert.deepEqual(missing, []);
});
