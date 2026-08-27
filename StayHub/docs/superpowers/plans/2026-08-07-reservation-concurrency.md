# StayHub Reservation Concurrency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Guarantee that concurrent overlapping requests for one room produce exactly one reservation and one HTTP-409 business conflict.

**Architecture:** A MongoDB transaction increments a monotonic version on the room document before checking overlap and inserting the reservation. Every repository operation in that critical section uses the same session, forcing concurrent transactions for one room to conflict and retry against fresh reservation state.

**Tech Stack:** Node.js test runner, Mongoose 8, MongoDB transactions, Express 5

## Global Constraints

- Keep the public reservation API request and response shape unchanged.
- Do not modify frontend code.
- Never use the production database for destructive test setup; use `TEST_DB_NAME` only.
- Preserve adjacent-date booking behavior and cancelled-reservation exclusion.
- Use transaction-driver retry behavior without an application-level infinite loop.

---

### Task 1: Write the Failing Concurrency Integration Test

**Files:**
- Create: `stayhub-backend/test/reservationConcurrency.test.js`
- Modify: `stayhub-backend/package.json`

**Interfaces:**
- Consumes: `createReservation(data, userId)` and `TEST_DB_NAME`.
- Produces: A repeatable test proving exactly one concurrent overlapping request succeeds.

- [ ] Configure `npm test` to run the Node test directory.
- [ ] Create uniquely named user, hotel, and room fixtures in `TEST_DB_NAME`.
- [ ] Send two concurrent service requests for the same room and date range.
- [ ] Assert one fulfillment, one rejection with status 409, and one stored reservation.
- [ ] Assert a reservation starting on the first reservation's checkout date succeeds.
- [ ] Delete only fixtures created by this test in `after` cleanup.
- [ ] Run the test and confirm it fails because both overlapping requests can succeed.

### Task 2: Add the Room Transaction Lock Contract

**Files:**
- Modify: `stayhub-backend/model/Room.js`
- Modify: `stayhub-backend/repository/roomRepository.js`
- Test: `stayhub-backend/test/reservationConcurrency.test.js`

**Interfaces:**
- Produces: `incrementRoomReservationVersion(roomId, session)` returning the updated room.

- [ ] Add `reservationVersion` as a numeric room field with default 0 and `select: false`.
- [ ] Add a repository function using `findByIdAndUpdate` with `$inc`, `{ new: true, session }`.
- [ ] Add a schema assertion to the concurrency test.
- [ ] Run the test and confirm the schema assertion passes while concurrency still fails.

### Task 3: Make Reservation Repositories Session-Aware

**Files:**
- Modify: `stayhub-backend/repository/reservationRepository.js`

**Interfaces:**
- Produces: `findOverlappingReservation(..., session)` and `createReservation(data, session)`.

- [ ] Apply an optional session to overlap queries.
- [ ] Create reservations as a one-element array when a session is present and return the first document.
- [ ] Preserve existing behavior when no session is passed.
- [ ] Run backend syntax checks.

### Task 4: Wrap Reservation Creation in the Transaction

**Files:**
- Modify: `stayhub-backend/service/reservationService.js`

**Interfaces:**
- Consumes: Room version increment and session-aware reservation repositories.
- Produces: The existing reservation document response.

- [ ] Start a Mongoose session after request-shape and date validation.
- [ ] Use `session.withTransaction` for room locking, guest validation, overlap lookup, price calculation, and creation.
- [ ] Pass the identical session to all critical repository operations.
- [ ] Preserve 404 and 409 `AppError` behavior.
- [ ] End the session in `finally` and return the created reservation after commit.
- [ ] Run the concurrency test and confirm all assertions pass.

### Task 5: Full Verification

**Files:**
- Verify: all backend source and test files

**Interfaces:**
- Produces: Test, syntax, import, and frontend regression evidence.

- [ ] Run `npm test` against `TEST_DB_NAME` and confirm all tests pass.
- [ ] Run `node --check` for all backend source files outside `node_modules`.
- [ ] Import the Express app and confirm success.
- [ ] Run frontend lint and production build to confirm no regression.
- [ ] Confirm the production database reservation count was not changed by tests.
