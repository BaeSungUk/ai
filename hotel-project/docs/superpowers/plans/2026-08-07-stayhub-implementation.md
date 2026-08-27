# StayHub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 시험 체크리스트 전체를 충족하는 React + Express + MongoDB 호텔 예약 애플리케이션을 구축한다.

**Architecture:** 백엔드는 Route → Controller → Service → Repository → Mongoose Model 계층으로 구성하고 비즈니스 규칙은 주입 가능한 Service에서 검증한다. 프론트엔드는 React Router, 인증 Context, 기능별 Axios API 모듈과 페이지 컴포넌트로 구성하며 모든 서버 상태에 로딩·빈 데이터·오류 UI를 둔다.

**Tech Stack:** JavaScript, React 19, Vite, React Router, Axios, CSS, Node.js, Express 5, MongoDB, Mongoose, JWT, bcrypt, Vitest, Supertest, React Testing Library

## Global Constraints

- JavaScript와 ES Module만 사용하고 TypeScript는 사용하지 않는다.
- Bootstrap, Tailwind, Redux 및 불필요한 UI 라이브러리를 사용하지 않는다.
- API 응답은 `{ success, message, data? }` 형식으로 통일한다.
- 실제 `.env`는 커밋하지 않고 `.env.example`만 제공한다.
- 모든 기능은 테스트를 먼저 실패시킨 후 최소 구현으로 통과시킨다.
- 기본 API 주소는 `http://localhost:3000/api`다.

---

### Task 1: 프로젝트 기반과 공통 백엔드 인프라

**Files:**
- Create: `.gitignore`, `backend/package.json`, `backend/.env.example`, `backend/app.js`, `backend/server.js`
- Create: `backend/config/db.js`, `backend/utils/ApiError.js`, `backend/utils/asyncHandler.js`, `backend/utils/response.js`
- Create: `backend/middleware/errorMiddleware.js`, `backend/routes/index.js`
- Test: `backend/tests/app.test.js`, `backend/tests/utils.test.js`

**Interfaces:**
- Produces: `createApp()`, `connectDatabase(uri)`, `ApiError(statusCode, message)`, `asyncHandler(handler)`, `sendSuccess(res, status, message, data)`

- [ ] Write tests proving health response shape, JSON 404, global error conversion and async error forwarding.
- [ ] Run `npm test -- --run` in `backend`; expect failures because application modules do not exist.
- [ ] Add Express/CORS/dotenv/Mongoose runtime dependencies and Vitest/Supertest dev dependencies, then implement only the tested infrastructure.
- [ ] Re-run backend tests and confirm all Task 1 tests pass.
- [ ] Commit with `feat: scaffold backend infrastructure`.

### Task 2: Mongoose 모델과 Repository

**Files:**
- Create: `backend/models/User.js`, `Hotel.js`, `Room.js`, `Reservation.js`, `Review.js`
- Create: `backend/repositories/userRepository.js`, `hotelRepository.js`, `roomRepository.js`, `reservationRepository.js`, `reviewRepository.js`
- Test: `backend/tests/models.test.js`, `backend/tests/repositories.test.js`

**Interfaces:**
- Produces repository methods `findUserByEmail`, `createUser`, `findHotels(filters)`, `findHotelById`, `findRoomsByHotel`, `findRoomById`, `findOverlappingReservation`, `findReservationsByUser`, `findReviewByReservation`, `recalculateHotelRating` and CRUD counterparts.

- [ ] Write schema tests for required fields, enums, references, unique/index definitions and repository filter construction.
- [ ] Run focused tests; expect module-not-found failures.
- [ ] Implement five schemas with timestamps and focused repository modules that contain all Mongoose access.
- [ ] Run all backend tests and confirm green.
- [ ] Commit with `feat: add database models and repositories`.

### Task 3: 인증, JWT와 권한

**Files:**
- Create: `backend/services/authService.js`, `backend/controllers/authController.js`, `backend/routes/authRoutes.js`
- Create: `backend/middleware/authMiddleware.js`, `backend/middleware/adminMiddleware.js`
- Test: `backend/tests/authService.test.js`, `backend/tests/authRoutes.test.js`, `backend/tests/authMiddleware.test.js`

**Interfaces:**
- Produces: `signup({name,email,password})`, `login({email,password})`, `checkEmail(email)`, `authenticate`, `requireAdmin`; request user shape `{ userId, email, role }`.

- [ ] Write failing tests for input validation, normalized duplicate email 409, bcrypt hashing/comparison, JWT payload, missing/invalid bearer token 401 and non-admin 403.
- [ ] Run focused auth tests and verify expected failures.
- [ ] Implement service with injected repository/bcrypt/JWT dependencies, thin controllers and routes.
- [ ] Re-run focused and full backend tests.
- [ ] Commit with `feat: implement authentication and authorization`.

### Task 4: 호텔과 객실 CRUD

**Files:**
- Create: `backend/services/hotelService.js`, `roomService.js`
- Create: `backend/controllers/hotelController.js`, `roomController.js`
- Create: `backend/routes/hotelRoutes.js`, `roomRoutes.js`
- Test: `backend/tests/hotelService.test.js`, `roomService.test.js`, `catalogRoutes.test.js`

**Interfaces:**
- Produces all specified Hotel and Room REST endpoints; `listHotels({location,name,sort})` returns hotels containing `minPrice`.

- [ ] Write failing tests for combined case-insensitive filters, three sort modes, minimum active-room price, 404 behavior, hotel reference and admin-only mutations.
- [ ] Run catalog tests and confirm red.
- [ ] Implement CRUD services, controllers and routes; mount static detail paths before parameter paths where necessary.
- [ ] Run backend suite and confirm green.
- [ ] Commit with `feat: implement hotel and room APIs`.

### Task 5: 예약 규칙과 API

**Files:**
- Create: `backend/utils/date.js`, `backend/services/reservationService.js`
- Create: `backend/controllers/reservationController.js`, `backend/routes/reservationRoutes.js`
- Test: `backend/tests/date.test.js`, `reservationService.test.js`, `reservationRoutes.test.js`

**Interfaces:**
- Produces: `parseDateOnly`, `calculateNights`, `createReservation(userId,input)`, `listUserReservations(userId)`, `getUserReservation(userId,id)`, `cancelReservation(userId,id)`.

- [ ] Write failing tests for UTC date parsing, past/reversed dates, capacity, inactive room, exact overlap expression, boundary non-overlap, cancelled exclusion, server-calculated nights/price and ownership.
- [ ] Run reservation tests and verify red for missing behavior.
- [ ] Implement validation and persistence; ignore client-provided nights and total price; cancellation updates status only.
- [ ] Run full backend suite.
- [ ] Commit with `feat: implement secure reservation workflow`.

### Task 6: 후기 규칙과 API

**Files:**
- Create: `backend/services/reviewService.js`, `backend/controllers/reviewController.js`, `backend/routes/reviewRoutes.js`
- Test: `backend/tests/reviewService.test.js`, `backend/tests/reviewRoutes.test.js`

**Interfaces:**
- Produces: `createReview(userId,input)`, `listHotelReviews(hotelId)`, `deleteReview(userId,id)` and specified Review endpoints.

- [ ] Write failing tests for rating 1–5, confirmed reservation requirement, hotel/reservation match, duplicate reservation review 409, author-only deletion and rating/count recalculation after create/delete.
- [ ] Run review tests and confirm red.
- [ ] Implement service, repository operations, controller and protected/public routes.
- [ ] Run all backend tests.
- [ ] Commit with `feat: implement verified guest reviews`.

### Task 7: Seed, 라우트 통합과 백엔드 검증

**Files:**
- Create: `backend/scripts/seed.js`, `backend/data/seedData.js`
- Modify: `backend/routes/index.js`, `backend/package.json`
- Test: `backend/tests/routeMap.test.js`, `backend/tests/seedData.test.js`

**Interfaces:**
- Produces `npm run seed`; four hotels with 2–3 rooms each; seeded admin and user credentials documented later.

- [ ] Write tests enumerating every required route and validating seed counts, fields, unique keys and room relations.
- [ ] Run tests and confirm failures.
- [ ] Mount all routers and implement idempotent upsert-based seed script.
- [ ] Run `npm test -- --run`, syntax-import `app.js`, and perform a bounded server startup smoke test.
- [ ] Commit with `feat: add sample data and complete API routing`.

### Task 8: 프론트엔드 기반, API와 인증

**Files:**
- Create: `frontend/package.json`, `frontend/.env.example`, `frontend/index.html`, `frontend/vite.config.js`
- Create: `frontend/src/main.jsx`, `App.jsx`, `index.css`
- Create: `frontend/src/api/axiosInstance.js`, `authApi.js`, `hotelApi.js`, `reservationApi.js`, `reviewApi.js`
- Create: `frontend/src/context/AuthContext.jsx`, `frontend/src/hooks/useAuth.js`
- Test: `frontend/src/api/axiosInstance.test.js`, `frontend/src/context/AuthContext.test.jsx`

**Interfaces:**
- Produces `apiClient`, `AuthProvider`, `useAuth()` with `{user,token,isAuthenticated,login,logout}` and feature API functions.

- [ ] Write failing tests for bearer interceptor, stored-session restoration, login persistence and logout cleanup.
- [ ] Run `npm test -- --run` in `frontend`; expect failures.
- [ ] Scaffold Vite React and implement API modules and Auth Context.
- [ ] Run frontend tests.
- [ ] Commit with `feat: scaffold frontend authentication`.

### Task 9: Router, 공통 Layout과 회원 화면

**Files:**
- Create: `frontend/src/layouts/MainLayout.jsx`
- Create: `frontend/src/components/Header.jsx`, `Footer.jsx`, `ProtectedRoute.jsx`, `FormField.jsx`
- Create: `frontend/src/pages/HomePage.jsx`, `SignupPage.jsx`, `LoginPage.jsx`, `NotFoundPage.jsx`
- Create: `frontend/src/utils/validation.js`
- Test: `frontend/src/utils/validation.test.js`, `frontend/src/pages/AuthPages.test.jsx`, `frontend/src/App.test.jsx`

**Interfaces:**
- Produces required routes and validation functions `validateSignup`, `validateLogin` returning field-error objects.

- [ ] Write failing tests for all signup/login messages, successful navigation, authenticated header state, logout and protected redirect.
- [ ] Run focused tests and confirm red.
- [ ] Implement routes, layout, accessible forms and auth pages.
- [ ] Run frontend suite.
- [ ] Commit with `feat: add navigation and account screens`.

### Task 10: 호텔 목록과 상세·객실 UI

**Files:**
- Create: `frontend/src/components/HotelCard.jsx`, `RoomCard.jsx`, `ImageWithFallback.jsx`, `StatusMessage.jsx`
- Create: `frontend/src/pages/HotelsPage.jsx`, `HotelDetailPage.jsx`
- Create: `frontend/src/hooks/useHotels.js`, `frontend/src/utils/format.js`
- Test: `frontend/src/pages/HotelsPage.test.jsx`, `HotelDetailPage.test.jsx`, `frontend/src/utils/format.test.js`

**Interfaces:**
- Produces URL-backed location/name/sort controls, hotel cards, detailed hotel/room rendering and safe currency/date formatting.

- [ ] Write failing tests for query parameters, refetch, card contents, loading/empty/error states, fallback image and room availability display.
- [ ] Run tests and confirm red.
- [ ] Implement hooks, cards and pages against API modules.
- [ ] Run frontend suite.
- [ ] Commit with `feat: add hotel discovery and detail pages`.

### Task 11: 예약 UI와 내 예약

**Files:**
- Create: `frontend/src/components/ReservationForm.jsx`, `ReservationCard.jsx`
- Create: `frontend/src/pages/ReservationCompletePage.jsx`, `ReservationsPage.jsx`, `ReservationDetailPage.jsx`
- Create: `frontend/src/utils/reservation.js`
- Test: `frontend/src/utils/reservation.test.js`, `frontend/src/components/ReservationForm.test.jsx`, `frontend/src/pages/Reservations.test.jsx`

**Interfaces:**
- Produces `calculateBookingSummary({checkIn,checkOut,price})`, capacity/date validation, reservation submission and completion state.

- [ ] Write failing tests for nights/price, past and reversed dates, capacity, login guidance, server error display, completion details, list/detail and cancellation state.
- [ ] Run focused tests and confirm red.
- [ ] Implement reservation form in hotel detail and all reservation routes.
- [ ] Run frontend tests.
- [ ] Commit with `feat: add booking and reservation management UI`.

### Task 12: 후기 UI와 전체 CSS

**Files:**
- Create: `frontend/src/components/ReviewSection.jsx`, `ReviewCard.jsx`, `StarRating.jsx`
- Modify: `frontend/src/pages/HotelDetailPage.jsx`, `frontend/src/index.css`
- Test: `frontend/src/components/ReviewSection.test.jsx`

**Interfaces:**
- Produces accessible 1–5 star input, review list/create/delete UI and responsive visual system.

- [ ] Write failing tests for empty state, logged-out guidance, rating/content submission, author-only delete and refreshed ratings.
- [ ] Run tests and confirm red.
- [ ] Implement review components and polished responsive CSS for all screens.
- [ ] Run tests and production build.
- [ ] Commit with `feat: add reviews and responsive StayHub design`.

### Task 13: 통합 점검과 문서화

**Files:**
- Create: `README.md`
- Modify: `.gitignore`, any files implicated by verification failures
- Test: all backend and frontend suites

**Interfaces:**
- Produces complete Korean setup guide, environment reference, route list and evaluation checklist.

- [ ] Run backend install/test/import checks and record exact results.
- [ ] Run frontend install/test/build checks and record exact results.
- [ ] Compare every frontend API call with mounted backend routes; add a failing regression test before fixing any mismatch.
- [ ] Write README sections for overview, stack, features, structure, MongoDB, backend, frontend, seed, environment and APIs.
- [ ] Execute the full exam checklist against code and tests, fix each discovered gap via red-green-refactor, then commit with `docs: complete StayHub setup and verification guide`.
