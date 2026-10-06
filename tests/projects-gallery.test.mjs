import assert from "node:assert/strict";
import test from "node:test";

const galleryScriptUrl = new URL(
  "../src/scripts/projects-gallery.mjs",
  import.meta.url,
);

test("project gallery navigation wraps at both ends", async () => {
  let galleryModule = {};

  try {
    galleryModule = await import(galleryScriptUrl.href);
  } catch {
    // The assertion below reports the missing gallery behavior clearly.
  }

  assert.equal(
    typeof galleryModule.wrapGalleryIndex,
    "function",
    "project gallery navigation helper is missing",
  );
  assert.equal(galleryModule.wrapGalleryIndex(0, -1, 4), 3);
  assert.equal(galleryModule.wrapGalleryIndex(3, 1, 4), 0);
  assert.equal(galleryModule.wrapGalleryIndex(1, 1, 5), 2);
});

test("selecting a project photo hides inactive images and updates controls", async () => {
  const galleryModule = await import(galleryScriptUrl.href);
  const photos = [{ hidden: false }, { hidden: false }, { hidden: false }];
  const thumbnails = Array.from({ length: 3 }, () => ({
    pressed: null,
    setAttribute(name, value) {
      if (name === "aria-pressed") this.pressed = value;
    },
  }));
  const projectCase = {
    dataset: {},
    querySelectorAll(selector) {
      if (selector === "[data-project-photo]") return photos;
      if (selector === "[data-project-thumbnail]") return thumbnails;
      return [];
    },
  };

  assert.equal(
    typeof galleryModule.setActivePhoto,
    "function",
    "project photo selection behavior is missing",
  );

  galleryModule.setActivePhoto(projectCase, 1);

  assert.deepEqual(photos.map((photo) => photo.hidden), [true, false, true]);
  assert.deepEqual(thumbnails.map((thumbnail) => thumbnail.pressed), ["false", "true", "false"]);
  assert.equal(projectCase.dataset.activePhoto, "1");
});
