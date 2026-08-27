import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import Room from "../model/Room.js";

const readProjectFile = (relativePath) => {
  return readFile(new URL(`../../${relativePath}`, import.meta.url), "utf8");
};

test("room schema exposes an optional image URL with an empty default", () => {
  const imagePath = Room.schema.path("image");

  assert.ok(imagePath);
  assert.equal(imagePath.instance, "String");
  assert.equal(imagePath.defaultValue, "");
});

test("room service accepts image on create and update", async () => {
  const source = await readProjectFile("stayhub-backend/service/roomService.js");

  assert.match(source, /roomName,\s*price,\s*maxGuests,\s*description,\s*image/s);
  assert.match(source, /image:\s*image\s*\|\|\s*""/);
  assert.match(source, /"image"/);
});

test("room form submits image and room card renders an image fallback", async () => {
  const [formSource, cardSource] = await Promise.all([
    readProjectFile("stayhub-frontend/src/pages/RoomFormPage.jsx"),
    readProjectFile("stayhub-frontend/src/components/RoomCard.jsx"),
  ]);

  assert.match(formSource, /image:\s*form\.image\.trim\(\)/);
  assert.match(formSource, /name="image"/);
  assert.match(cardSource, /room\.image\s*\?/);
  assert.match(cardSource, /className="room-image-placeholder"/);
});
