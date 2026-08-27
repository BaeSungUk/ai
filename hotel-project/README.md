# StayHub

React와 Express, MongoDB로 만든 호텔 검색·예약 실기 프로젝트입니다. 회원가입과 JWT 로그인, 호텔 검색·정렬, 객실 예약, 본인 예약 조회·취소, 실제 예약 사용자의 후기 기능을 제공합니다.

## 사용 기술

- Frontend: React, Vite, React Router, Axios, React Hooks, CSS
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- Test: Vitest, Supertest, React Testing Library

## 프로젝트 구조

```text
frontend/src  api · context · layouts · pages · utils
backend       config · models · services · controllers · routes · middleware · utils
```

## 실행 준비

Node.js 20 이상과 로컬 MongoDB가 필요합니다. MongoDB를 먼저 실행한 뒤 환경 파일을 만듭니다.

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

## Backend 실행

```powershell
cd backend
npm install
npm run seed
npm run dev
```

API는 `http://localhost:3000/api`에서 실행됩니다.

## Frontend 실행

```powershell
cd frontend
npm install
npm run dev
```

Vite가 안내하는 로컬 주소로 접속합니다.

## 샘플 계정과 Seed

`npm run seed`는 호텔 이름을 기준으로 upsert하고 기존 샘플 객실을 교체하므로 여러 번 실행해도 샘플 데이터가 누적되지 않습니다.

- 일반 사용자: `user@stayhub.com` / `stayhub123`
- 관리자: `admin@stayhub.com` / `stayhub123`

## 환경 변수

Backend: `PORT`, `MONGODB_URI`, `JWT_SECRET`  
Frontend: `VITE_API_BASE_URL`

## 주요 API

- Auth: `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/check-email`
- Hotel: `POST|GET /api/hotels`, `GET|PUT|DELETE /api/hotels/:hotelId`
- Room: `POST /api/rooms`, `GET|PUT|DELETE /api/rooms/:roomId`, `GET /api/hotels/:hotelId/rooms`
- Reservation: `POST|GET /api/reservations`, `GET /api/reservations/:reservationId`, `PATCH /api/reservations/:reservationId/cancel`
- Review: `POST /api/reviews`, `GET /api/hotels/:hotelId/reviews`, `DELETE /api/reviews/:reviewId`

호텔과 객실 변경은 관리자만 가능하며 예약과 후기 변경은 JWT 인증이 필요합니다. 예약 금액·숙박일·정원·날짜 중복은 서버에서 다시 검증합니다.

## 검증

```powershell
cd backend; npm test -- --run
cd ../frontend; npm test -- --run
npm run build
```
