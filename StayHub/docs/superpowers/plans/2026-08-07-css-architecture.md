# StayHub CSS Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 1,899-line CSS monolith with nine responsibility-based stylesheets while preserving the current rendered design and responsive behavior.

**Architecture:** `src/index.css` becomes an ordered import entry point. Design tokens and global rules load first, domain files load next, and responsive overrides load last so the existing cascade remains predictable without the former duplicate theme block.

**Tech Stack:** CSS, Vite 8, React 19, Node.js test runner

## Global Constraints

- Do not modify JSX or JavaScript.
- Preserve current class names, visual design, image layout, breakpoints, focus states, and reduced-motion behavior.
- Add no dependencies.
- Keep `index.css` import-only.

---

### Task 1: Add a Failing CSS Architecture Contract

**Files:**
- Create: `stayhub-frontend/test/cssArchitecture.test.js`

**Interfaces:**
- Consumes: `src/index.css`, `src/styles/*.css`, and JSX class names.
- Produces: An executable Node test proving import order, file presence, brace balance, and selector coverage.

- [ ] Write a Node test requiring the nine exact imports in the approved order.
- [ ] Assert that every imported file exists and has balanced braces.
- [ ] Extract literal JSX class names and assert that each has a corresponding CSS selector.
- [ ] Run `node --test test/cssArchitecture.test.js` and confirm it fails because `src/styles` does not exist.

### Task 2: Split and Consolidate the Stylesheets

**Files:**
- Create: `stayhub-frontend/src/styles/tokens.css`
- Create: `stayhub-frontend/src/styles/base.css`
- Create: `stayhub-frontend/src/styles/layout.css`
- Create: `stayhub-frontend/src/styles/components.css`
- Create: `stayhub-frontend/src/styles/hotel.css`
- Create: `stayhub-frontend/src/styles/room.css`
- Create: `stayhub-frontend/src/styles/reservation.css`
- Create: `stayhub-frontend/src/styles/auth.css`
- Create: `stayhub-frontend/src/styles/responsive.css`
- Modify: `stayhub-frontend/src/index.css`

**Interfaces:**
- Consumes: The current computed cascade and all existing JSX class names.
- Produces: Nine ordered stylesheets imported by `index.css`.

- [ ] Move final design tokens to `tokens.css`.
- [ ] Consolidate resets, typography, form controls, and focus behavior into `base.css` and `components.css`.
- [ ] Consolidate header and page shell rules into `layout.css`.
- [ ] Consolidate hotel, room, reservation, and authentication rules into their domain files.
- [ ] Move all 900px, 700px, and reduced-motion overrides to `responsive.css`.
- [ ] Replace `index.css` with only the nine ordered imports.
- [ ] Run the architecture contract and confirm all assertions pass.

### Task 3: Verify Build and Regression Boundaries

**Files:**
- Verify: `stayhub-frontend/src/index.css`
- Verify: `stayhub-frontend/src/styles/*.css`

**Interfaces:**
- Produces: Build and structural verification evidence.

- [ ] Run `npm.cmd run build` with a temporary output directory and confirm success.
- [ ] Run `npm.cmd run lint -- --no-cache` and record only existing React effect findings.
- [ ] Confirm all expected CSS selectors, breakpoints, and accessibility rules remain present.
- [ ] Confirm no JSX, JavaScript, backend, or image asset was modified by this refactor.
