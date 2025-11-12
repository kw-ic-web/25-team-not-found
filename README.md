[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/T3W3QeQp)

# API 명세서

## 대시보드 API

| Method | Endpoint | 목적 |
| --- | --- | --- |
| GET | /dashboard | 대시보드 데이터를 가져옵니다. |

## 교과서 API

| Method | Endpoint | 목적 |
| --- | --- | --- |
| GET | /textbooks/:textbook_id/pages/:page_number | 특정 교과서의 페이지 내용을 가져옵니다. |

## 주석 API

| Method | Endpoint | 목적 |
| --- | --- | --- |
| GET | /annotations | 특정 페이지 또는 교과서의 모든 주석을 가져옵니다. |
| POST | /annotations | 새 주석을 생성합니다. |
| PUT | /annotations/:annotation_id | 기존 주석을 업데이트합니다. |
| DELETE | /annotations/:annotation_id | 주석을 삭제합니다. |

## 퀴즈 API

| Method | Endpoint | 목적 |
| --- | --- | --- |
| GET | /quizzes/:quiz_id/questions | 특정 퀴즈의 질문을 가져옵니다. |
| POST | /quizzes/:quiz_id/submit | 퀴즈 답안을 제출합니다. |

## 세션 API

| Method | Endpoint | 목적 |
| --- | --- | --- |
| POST | /sessions/join | 세션에 참여합니다. |

---

# 백엔드 코드 명세서

이 문서는 백엔드 애플리케이션의 주요 JavaScript 파일 및 그 기능을 설명합니다.

## 1. Core Application Files

### `BE/app.js`
Express 애플리케이션의 메인 설정 파일입니다. 미들웨어(CORS, JSON 파싱)를 설정하고, API 라우트를 등록하며, 전역 오류 핸들러를 적용합니다.

### `BE/server.js`
Node.js 서버를 시작하고 Express 앱을 HTTP 서버에 연결합니다. Socket.IO 서버를 초기화하고 설정하며, 지정된 포트에서 서버를 리스닝합니다.

## 2. Configuration

### `BE/config/index.js`
`dotenv` 라이브러리를 사용하여 `.env` 파일에서 환경 변수를 로드합니다. 애플리케이션 전반에 걸쳐 환경 변수에 접근할 수 있도록 합니다.

### `BE/config/db.config.js`
PostgreSQL 데이터베이스 연결 풀을 설정하고 내보냅니다. `process.env.DATABASE_URL` 환경 변수를 사용하여 데이터베이스에 연결합니다.

## 3. API Routes (`BE/api/*.js`)

이 디렉토리의 파일들은 Express 라우터를 정의하고, 특정 경로에 대한 HTTP 요청을 컨트롤러 함수에 매핑합니다. 모든 라우트는 `authMiddleware`를 통해 인증을 요구합니다.

### `BE/api/index.js`
모든 개별 라우트 파일을 통합하는 메인 API 라우터입니다. `/api/v1` 경로 아래에 대시보드, 교과서, 주석, 퀴즈, 세션 관련 라우트를 마운트합니다.

### `BE/api/annotation.routes.js`
주석 관련 API 엔드포인트를 정의합니다.
- `GET /`: 페이지 ID 또는 교과서 ID를 기반으로 주석을 조회합니다.
- `POST /`: 새 주석을 생성합니다.
- `PUT /:annotation_id`: 특정 주석을 업데이트합니다.
- `DELETE /:annotation_id`: 특정 주석을 삭제합니다.

### `BE/api/dashboard.routes.js`
대시보드 관련 API 엔드포인트를 정의합니다.
- `GET /`: 사용자 대시보드 데이터를 조회합니다.

### `BE/api/quiz.routes.js`
퀴즈 관련 API 엔드포인트를 정의합니다.
- `GET /:quiz_id/questions`: 특정 퀴즈의 질문을 조회합니다.
- `POST /:quiz_id/submit`: 퀴즈 답안을 제출합니다.

### `BE/api/session.routes.js`
세션 관련 API 엔드포인트를 정의합니다.
- `POST /join`: 세션에 참여합니다.

### `BE/api/textbook.routes.js`
교과서 관련 API 엔드포인트를 정의합니다.
- `GET /:textbook_id/pages/:page_number`: 특정 교과서의 특정 페이지 내용을 조회합니다.

## 4. Controllers (`BE/controllers/*.js`)

컨트롤러 파일은 들어오는 요청을 처리하고, 서비스 계층과 상호작용하며, 클라이언트에 응답을 보냅니다. Joi를 사용하여 요청 유효성 검사를 수행합니다.

### `BE/controllers/annotation.controller.js`
주석 관련 요청을 처리합니다.
- `getAnnotations`: 쿼리 파라미터(`page_id` 또는 `textbook_id`)를 기반으로 주석을 조회합니다.
- `createAnnotation`: 요청 본문을 사용하여 새 주석을 생성합니다.
- `updateAnnotation`: 특정 주석 ID와 요청 본문을 사용하여 주석을 업데이트합니다.
- `deleteAnnotation`: 특정 주석 ID를 사용하여 주석을 삭제합니다.

### `BE/controllers/dashboard.controller.js`
대시보드 데이터 요청을 처리합니다.
- `getDashboardData`: 현재 사용자의 대시보드 데이터를 서비스로부터 가져와 응답합니다.

### `BE/controllers/quiz.controller.js`
퀴즈 관련 요청을 처리합니다.
- `getQuizQuestions`: 특정 퀴즈 ID에 대한 질문을 조회합니다.
- `submitQuizAnswers`: 퀴즈 답안을 제출하고 결과를 처리합니다.

### `BE/controllers/session.controller.js`
세션 관련 요청을 처리합니다.
- `joinSession`: 초대 코드를 사용하여 세션에 참여 요청을 처리합니다.

### `BE/controllers/textbook.controller.js`
교과서 관련 요청을 처리합니다.
- `getPageContent`: 교과서 ID와 페이지 번호를 기반으로 페이지 내용을 조회합니다.

## 5. Middleware (`BE/middleware/*.js`)

미들웨어 파일은 요청-응답 주기 동안 특정 작업을 수행하는 함수를 정의합니다.

### `BE/middleware/auth.middleware.js`
JWT(JSON Web Token)를 사용하여 사용자 인증을 처리합니다. 요청 헤더에서 토큰을 추출하고, 유효성을 검사하며, 디코딩된 사용자 정보를 `req.user` 객체에 추가합니다.

### `BE/middleware/error.handler.js`
전역 오류 처리 미들웨어입니다. 애플리케이션에서 발생하는 모든 오류를 캡처하고, 일관된 오류 응답 형식(상태 코드, 오류 코드, 메시지)으로 클라이언트에 반환합니다.

### `BE/middleware/validation.middleware.js`
(현재 비어 있음) 요청 유효성 검사를 위한 추가적인 공통 로직을 포함할 수 있습니다.

## 6. Services (`BE/services/*.js`)

서비스 파일은 비즈니스 로직을 캡슐화하고, 컨트롤러와 리포지토리 사이의 중개자 역할을 합니다.

### `BE/services/annotation.service.js`
주석 관련 비즈니스 로직을 처리합니다.
- `getAnnotations`: 쿼리 조건에 따라 주석을 조회합니다.
- `createAnnotation`: 새 주석을 생성합니다.
- `updateAnnotation`: 기존 주석을 업데이트하고 소유권 검사를 수행합니다.
- `deleteAnnotation`: 주석을 삭제하고 소유권 검사를 수행합니다.

### `BE/services/dashboard.service.js`
대시보드 데이터 집계 로직을 처리합니다.
- `getDashboardData`: 사용자의 등록 정보, 최근 피드백, 퀴즈 통계 등 다양한 대시보드 데이터를 가져와 통합합니다.

### `BE/services/quiz.service.js`
퀴즈 관련 비즈니스 로직을 처리합니다.
- `getQuizQuestions`: 퀴즈 질문을 가져오고 민감한 정보를 제거합니다.
- `submitQuizAnswers`: 퀴즈 답안을 제출하고, 채점하며, 결과를 데이터베이스에 저장하고, 트랜잭션을 관리합니다.

### `BE/services/session.service.js`
세션 관련 비즈니스 로직을 처리합니다.
- `joinSession`: 초대 코드를 사용하여 세션에 참여하고, 세션의 유효성 및 상태를 확인합니다.

### `BE/services/textbook.service.js`
교과서 관련 비즈니스 로직을 처리합니다.
- `getPageContent`: 특정 교과서 페이지의 내용을 가져오고, 페이지 존재 여부를 확인합니다.

## 7. Repositories (`BE/repositories/*.js`)

리포지토리 파일은 데이터베이스와의 직접적인 상호작용을 담당합니다. SQL 쿼리를 실행하고 결과를 반환합니다.

### `BE/repositories/annotation.repository.js`
주석 데이터에 대한 CRUD(Create, Read, Update, Delete) 작업을 처리합니다.
- `findByPageId`: 페이지 ID로 주석을 조회합니다.
- `findByTextbookId`: 교과서 ID로 주석을 조회합니다.
- `findAllByUserId`: 사용자 ID로 모든 주석을 조회합니다.
- `create`: 새 주석 레코드를 데이터베이스에 삽입합니다.
- `update`: 기존 주석 레코드를 업데이트합니다.
- `remove`: 주석 레코드를 삭제합니다.

### `BE/repositories/dashboard.repository.js`
대시보드에 필요한 데이터를 데이터베이스에서 조회합니다.
- `findEnrollmentsByUserId`: 사용자의 등록된 교과서를 조회합니다.
- `findRecentFeedbackByUserId`: 사용자의 최근 피드백을 조회합니다.
- `findStatsByUserId`: 사용자의 퀴즈 통계(평균 점수, 응시한 퀴즈 수)를 조회합니다.

### `BE/repositories/quiz.repository.js`
퀴즈 데이터에 대한 데이터베이스 작업을 처리합니다.
- `findQuestionsByQuizId`: 퀴즈 ID로 질문을 조회합니다.
- `createSubmission`: 퀴즈 제출 기록을 생성합니다.
- `findCorrectAnswer`: 특정 질문의 정답을 조회합니다.
- `createAnswer`: 퀴즈 답안을 저장합니다.
- `updateSubmissionScore`: 퀴즈 제출 점수를 업데이트합니다.
- `getQuizResults`: 특정 제출에 대한 퀴즈 결과를 조회합니다.

### `BE/repositories/session.repository.js`
세션 데이터에 대한 데이터베이스 작업을 처리합니다.
- `findSessionByCode`: 초대 코드로 세션을 조회합니다.
- `updateSessionUser`: 세션에 사용자 ID와 상태를 업데이트합니다.

### `BE/repositories/textbook.repository.js`
교과서 데이터에 대한 데이터베이스 작업을 처리합니다.
- `findPageContent`: 교과서 ID와 페이지 번호로 페이지 내용을 조회합니다.

### `BE/repositories/user.repository.js`
(현재 비어 있음) 사용자 데이터에 대한 데이터베이스 작업을 처리할 수 있습니다.

## 8. Socket.IO (`BE/socket/*.js`)

이 디렉토리의 파일들은 실시간 통신을 위한 Socket.IO 이벤트를 처리합니다.

### `BE/socket/index.js`
Socket.IO 서버를 초기화하고, 클라이언트 연결 시 이벤트 핸들러를 등록합니다.

### `BE/socket/session.handler.js`
세션 관련 Socket.IO 이벤트를 처리합니다.
- `joinSession`: 클라이언트가 특정 세션 룸에 참여하도록 합니다.
- `handlePageChange`: 교사가 페이지를 변경할 때 세션 내 모든 클라이언트에게 알립니다.
- `handleNewAnnotation`: 실시간으로 새 주석이 추가될 때 이를 처리하고 세션 내 클라이언트에게 전파합니다.
- `handleDisconnect`: 클라이언트 연결 해제 시 로그를 기록합니다.