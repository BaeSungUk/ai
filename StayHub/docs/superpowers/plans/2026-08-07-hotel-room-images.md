# StayHub Hotel and Room Images Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Generate 10 regional hotel images and 5 room-type images, then add optional room-image storage and display throughout StayHub.

**Architecture:** Static generated assets live under the frontend public directory and are referenced by root-relative URLs. The existing hotel image field remains unchanged; the room model, service, form, card, and seed data gain one optional `image` string while preserving empty-image fallbacks.

**Tech Stack:** React 19, CSS, Express 5, Mongoose 8, Vite static assets, OpenAI image generation

## Global Constraints

- Generate exactly 10 hotel images and 5 room images.
- Use photorealistic warm boutique-hotel styling without people, logos, readable text, or watermarks.
- Preserve all existing reservation, availability, ownership, edit, and delete behavior.
- Treat images as URL strings; do not add uploads, cloud storage, galleries, or multiple images.
- Existing records with no room image must continue to render.

---

### Task 1: Generate Static Image Assets

**Files:**
- Create: `stayhub-frontend/public/images/hotels/*.png`
- Create: `stayhub-frontend/public/images/rooms/*.png`

**Interfaces:**
- Produces: Ten `/images/hotels/<slug>.png` URLs and five `/images/rooms/<slug>.png` URLs.

- [ ] Generate one cohesive 2-by-5 hotel contact sheet containing Seoul city, Busan ocean, Jeju resort, Gangneung sea view, Gyeongju hanok, Incheon airport, Yeosu marina, Sokcho beach, Jeonju hanok, and Daejeon city scenes.
- [ ] Generate one cohesive 1-by-5 room contact sheet containing standard, superior, deluxe, family, and suite rooms.
- [ ] Split the hotel sheet into ten equal standalone PNG files using a lossless crop command.
- [ ] Split the room sheet into five equal standalone PNG files using a lossless crop command.
- [ ] Verify exact file counts, image dimensions, and nonzero file sizes.

### Task 2: Add the Room Image Data Contract

**Files:**
- Modify: `stayhub-backend/model/Room.js`
- Modify: `stayhub-backend/service/roomService.js`

**Interfaces:**
- Consumes: Optional `image: string` in create and update request bodies.
- Produces: Room documents and API responses with `image: string`, defaulting to `""`.

- [ ] Add an optional Mongoose `image` string field with `default: ""`.
- [ ] Destructure `image` during room creation and store `image || ""`.
- [ ] Add `image` to the room update allowlist.
- [ ] Run `node --check` on the model and service and confirm zero syntax failures.

### Task 3: Add Image Input to the Room Form

**Files:**
- Modify: `stayhub-frontend/src/pages/RoomFormPage.jsx`

**Interfaces:**
- Consumes: `room.image` from `getRoomDetail`.
- Produces: `image` in calls to `createRoom` and `updateRoom`.

- [ ] Add `image: ""` to initial form state.
- [ ] Load `room.image || ""` in edit mode.
- [ ] Include the trimmed image URL in `roomData`.
- [ ] Add a labeled image URL input below the description field.
- [ ] Check that all added JSX tags and braces are balanced.

### Task 4: Display Room Images and Preserve Fallbacks

**Files:**
- Modify: `stayhub-frontend/src/components/RoomCard.jsx`
- Modify: `stayhub-frontend/src/index.css`

**Interfaces:**
- Consumes: `room.image`, possibly empty.
- Produces: A responsive room image when present and a StayHub placeholder otherwise.

- [ ] Add a room image container before the room information.
- [ ] Render `<img src={room.image} alt={room.roomName} />` when an image exists.
- [ ] Render the existing-brand fallback when no image exists.
- [ ] Add fixed-aspect-ratio desktop styles and a mobile layout without changing card actions.
- [ ] Verify CSS brace balance and presence of every new selector.

### Task 5: Connect Seed Records to Generated Assets

**Files:**
- Modify: `stayhub-backend/seed/seed.js`
- Modify: `stayhub-backend/seed/seedAll.js`

**Interfaces:**
- Consumes: Static URLs produced by Task 1.
- Produces: Seeded hotel and room documents whose image URLs resolve in the frontend.

- [ ] Map the ten hotel records to the ten hotel asset URLs in their existing order.
- [ ] Map each room template name to its matching room asset URL.
- [ ] Ensure room creation objects include the template image.
- [ ] Run `node --check` on both seed scripts.
- [ ] Compare every seeded URL against an existing generated file.

### Task 6: Full Verification

**Files:**
- Verify: all files modified or created in Tasks 1–5

**Interfaces:**
- Produces: Verification evidence for generated assets, backend syntax, frontend structure, and path consistency.

- [ ] Count assets and confirm exactly 10 hotel and 5 room images.
- [ ] Run backend source-wide `node --check`, excluding `node_modules`.
- [ ] Import the Express app and confirm `APP_IMPORT_OK`.
- [ ] Run a static JSX delimiter check and CSS brace check because frontend dependencies are unavailable.
- [ ] If frontend dependencies become available, run `npm.cmd run lint` and `npm.cmd run build`.
- [ ] Confirm no files outside the approved image feature and documentation scope were modified.
