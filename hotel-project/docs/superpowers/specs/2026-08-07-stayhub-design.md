# StayHub 설계 문서

## 목표와 범위

StayHub는 React/Vite 프론트엔드와 Node.js/Express REST API, MongoDB/Mongoose를 사용하는 호텔 예약 실기 시험용 프로젝트다. 회원가입과 JWT 로그인, 호텔 검색과 정렬, 객실 선택과 예약, 본인 예약 조회·취소, 실제 예약 사용자의 후기 작성·삭제를 하나의 실행 가능한 애플리케이션으로 제공한다.

관리자 전용 화면은 만들지 않지만 호텔과 객실의 생성·수정·삭제 API는 `admin` 역할만 사용할 수 있다. 샘플 데이터와 관리자 계정은 반복 실행해도 중복되지 않는 seed 명령으로 제공한다.

## 프로젝트 구조

최상위에는 `frontend`, `backend`, `README.md`, `.gitignore`를 둔다.

백엔드는 Route → Controller → Service → Repository → Mongoose Model 순서로 요청을 처리한다. Controller는 HTTP 입력과 응답, Service는 인증·예약·후기 같은 비즈니스 규칙, Repository는 데이터베이스 접근만 담당한다. 공통 응답과 오류 클래스, 비동기 오류 전달, 인증 및 관리자 권한 미들웨어를 별도 모듈로 둔다.

프론트엔드는 `api`, `components`, `pages`, `hooks`, `context`, `layouts`, `utils`로 나눈다. 인증 상태는 Context로 관리하고, 서버 통신은 JWT를 자동 첨부하는 Axios 인스턴스와 기능별 API 모듈을 통해서만 수행한다.

## 데이터 모델

- User: `name`, unique `email`, hashed `password`, `role(user|admin)`, timestamps
- Hotel: `name`, `location`, `address`, `description`, `images`, `rating`, `reviewCount`, `amenities`, timestamps
- Room: Hotel 참조 `hotel`, `name`, `description`, `price`, `capacity`, `images`, `isActive`, timestamps
- Reservation: User·Hotel·Room 참조, `checkIn`, `checkOut`, `guests`, `nights`, `totalPrice`, `status(confirmed|cancelled)`, timestamps
- Review: User·Hotel·Reservation 참조, `rating(1~5)`, `content`, timestamps

Room은 Hotel을, Reservation은 User·Hotel·Room을, Review는 User·Hotel·Reservation을 ObjectId로 참조한다. 이메일과 예약별 후기에는 고유 인덱스를 사용하고, 검색 및 예약 중복 검사에 필요한 필드에는 복합 인덱스를 둔다.

## 인증과 권한

회원가입 시 이메일을 정규화하고 중복을 검사한 뒤 bcrypt로 비밀번호를 해시한다. 로그인은 `bcrypt.compare`로 검증하고 `userId`, `email`, `role`을 담은 JWT를 발급한다. 프론트엔드는 토큰과 최소 사용자 정보를 localStorage에 보관한다.

보호 API는 `Authorization: Bearer <token>`을 검증한다. 예약은 로그인한 본인 데이터만 조회·취소할 수 있고, 후기는 작성자만 삭제할 수 있다. 호텔과 객실의 변경 API는 관리자만 접근할 수 있다.

## 호텔과 객실 흐름

호텔 목록 API는 `location`, `name`, `sort` query parameter를 조합해 처리한다. `sort`는 `priceAsc`, `priceDesc`, `ratingDesc`를 지원한다. 호텔별 최저 활성 객실 가격은 aggregation 또는 객실 조회 결과를 이용해 `minPrice`로 반환한다.

호텔 상세 API는 호텔 정보와 활성 객실을 함께 제공하거나 프론트가 호텔 상세와 객실 API를 병렬 호출할 수 있도록 동일한 필드 계약을 유지한다. 프론트는 로딩, 빈 결과, 이미지 오류 상태를 명확하게 표시한다.

## 예약 흐름과 핵심 규칙

프론트는 객실, 체크인·체크아웃, 인원을 받아 숙박일과 예상 금액을 즉시 표시한다. 오늘 이전 날짜, 역전된 날짜, 객실 정원 초과를 먼저 안내하며 비로그인 사용자가 제출하면 로그인 페이지로 유도한다.

서버는 클라이언트 금액을 신뢰하지 않고 다음을 다시 검증한다.

1. `checkIn < checkOut`
2. `guests <= room.capacity`
3. 활성 예약 중 `existing.checkIn < newCheckOut && existing.checkOut > newCheckIn`인 동일 객실 예약이 없는지 확인
4. UTC 날짜 차이로 `nights`를 양의 정수로 계산
5. `totalPrice = room.price * nights`로 계산

취소는 문서를 삭제하지 않고 `status = cancelled`로 바꾼다. 취소 예약은 중복 검사에서 제외한다. 예약 완료 화면에는 서버가 저장한 예약 정보만 표시한다.

## 후기 흐름과 평점

후기 작성은 로그인 사용자에게 해당 호텔의 취소되지 않은 예약이 있을 때만 허용한다. 한 예약에는 후기 하나만 작성할 수 있다. 삭제는 작성자만 가능하다. 후기 생성·삭제 후 호텔의 평균 평점과 후기 수를 데이터베이스의 현재 후기 집합으로 다시 계산해 일관성을 유지한다.

## 화면 구성

공통 Header와 Footer가 있는 반응형 Layout을 사용한다. 메인은 여행 분위기의 Hero 검색 영역과 추천 호텔 카드로 구성한다. 호텔 목록은 검색·정렬 컨트롤과 카드 Grid, 상세는 큰 대표 이미지·호텔 정보·객실 카드·예약 패널·후기 영역 순서로 구성한다.

회원가입과 로그인은 필드 아래 오류 메시지를 제공한다. 예약 목록과 상세에는 상태를 배지로 표시하며 취소된 예약은 취소 버튼을 숨긴다. 모든 API 화면은 로딩, 빈 데이터, 오류 상태를 갖는다. UI는 Bootstrap이나 Tailwind 없이 일반 CSS만 사용한다.

## API와 오류 처리

명세의 Auth, Hotel, Room, Reservation, Review 경로를 그대로 제공한다. 성공 응답은 `{ success: true, message, data }`, 실패 응답은 `{ success: false, message }`로 통일한다. 유효성 오류 400, 미인증 401, 권한 부족 403, 리소스 없음 404, 이메일·예약 중복 409, 예상하지 못한 오류 500을 사용한다.

존재하지 않는 경로는 JSON 404로 처리하고 전역 오류 미들웨어가 운영 환경의 내부 오류 정보를 숨긴다.

## 샘플 데이터와 환경 설정

seed는 서울 2곳, 부산 1곳, 제주 1곳과 호텔당 2~3개 객실을 upsert 방식으로 생성한다. 개발 확인용 일반 사용자와 관리자도 고정 이메일 기준으로 upsert하고 README에 자격 증명을 명시한다. 이미지는 안정적인 원격 이미지 URL과 프론트 fallback을 사용한다.

`backend/.env.example`과 `frontend/.env.example`을 제공하고 실제 `.env`는 Git에서 제외한다. 기본 API 주소는 `http://localhost:3000/api`, MongoDB는 `mongodb://127.0.0.1:27017/stayhub`다.

## 검증 전략

Vitest를 양쪽 프로젝트에서 사용하고 백엔드 HTTP 테스트에는 Supertest를 사용한다. 핵심 Service는 의존성을 주입해 MongoDB 없이도 인증, 날짜 중복, 인원, 금액, 소유권과 후기 권한을 검증한다. Repository와 라우팅 연결은 별도 통합 테스트로 확인한다.

프론트는 입력 검증과 날짜·금액 계산 같은 순수 함수, 인증 Context와 주요 사용자 흐름을 React Testing Library로 검증한다. 마지막에는 백엔드 전체 테스트, 프론트 전체 테스트와 production build, 서버 시작 및 주요 API 경로 연결을 확인한다.

## 명시적 가정

- JavaScript와 ES Module만 사용하며 TypeScript는 사용하지 않는다.
- 결제 처리는 시험 범위에 없으므로 예약 확정까지만 구현한다.
- 예약 가능 여부는 `isActive`와 서버 중복 검사 결과로 판단한다.
- 날짜는 `YYYY-MM-DD` 입력을 UTC 자정 기준으로 계산해 시간대별 숙박일 오차를 방지한다.
- 요청서에 명시되지 않은 비밀번호 최소 길이는 프론트와 백엔드 모두 6자로 통일한다.
