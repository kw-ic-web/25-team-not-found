# API 명세서

이 문서는 애플리케이션의 API 엔드포인트를 설명합니다.

---

# Auth (인증)

### POST /auth/register

- **설명**: 새로운 사용자를 등록(회원가입)합니다.
- **인증**: ❌
- **요청 본문 (Request Body)**:
    ```json
    {
        "username": "testuser",
        "password": "password123",
        "nickname": "Test User"
    }
    ```
- **응답 (201)**
    ```json
    {
        "user_id": 1,
        "username": "testuser",
        "nickname": "Test User",
        "created_at": "2025-11-12T12:00:00.000Z"
    }
    ```

### POST /auth/login

- **설명**: 사용자 로그인을 수행하고 JWT 토큰을 반환합니다.
- **인증**: ❌
- **요청 본문 (Request Body)**:
    ```json
    {
        "username": "testuser",
        "password": "password123"
    }
    ```
- **응답 (200)**
    ```json
    {
        "code": 200,
        "message": "토큰이 발급되었습니다.",
        "access_token": "your_jwt_token",
        "token_type": "Bearer",
        "user": {
            "user_id": 1,
            "username": "testuser",
            "nickname": "Test User"
        }
    }
    ```

---

# Annotations (주석)

### GET /annotations

- **설명**: 특정 페이지 또는 교재(Textbook)에 대한 주석을 조회합니다.
- **인증**: ✅ (Bearer)
- **쿼리 파라미터 (Query Parameters)**:
    - `page_id` (integer): 주석을 조회할 페이지의 ID.
    - `textbook_id` (integer): 주석을 조회할 교재의 ID.
    *(참고: `page_id` 또는 `textbook_id` 중 하나는 반드시 제공되어야 합니다)*
- **응답 (200)**
    ```json
    {
        "success": true,
        "data": [
            {
                "annotation_id": 1,
                "user_id": 1,
                "page_id": 1,
                "annotation_type": "highlight",
                "content": "This is a highlighted text.",
                "location_data": {},
                "created_at": "2025-11-07T12:00:00.000Z"
            }
        ]
    }
    ```

### POST /annotations

- **설명**: 새로운 주석을 생성합니다.
- **인증**: ✅ (Bearer)
- **요청 본문 (Request Body)**:
    ```json
    {
        "page_id": 1,
        "annotation_type": "memo",
        "content": "This is a memo.",
        "location_data": {}
    }
    ```
- **응답 (201)**
    ```json
    {
        "success": true,
        "data": {
            "annotation_id": 2,
            "user_id": 1,
            "page_id": 1,
            "annotation_type": "memo",
            "content": "This is a memo.",
            "location_data": {},
            "created_at": "2025-11-07T12:05:00.000Z"
        }
    }
    ```

### PUT /annotations/:annotation_id

- **설명**: 기존 주석을 수정합니다.
- **인증**: ✅ (Bearer)
- **요청 본문 (Request Body)**:
    ```json
    {
        "page_id": 1,
        "annotation_type": "memo",
        "content": "This is an updated memo.",
        "location_data": {}
    }
    ```
- **응답 (200)**
    ```json
    {
        "success": true,
        "data": {
            "annotation_id": 2,
            "user_id": 1,
            "page_id": 1,
            "annotation_type": "memo",
            "content": "This is an updated memo.",
            "location_data": {},
            "created_at": "2025-11-07T12:05:00.000Z"
        }
    }
    ```

### DELETE /annotations/:annotation_id

- **설명**: 주석을 삭제합니다.
- **인증**: ✅ (Bearer)
- **응답 (204)**: 내용 없음 (No content).

---

# Dashboard (대시보드)
# API 명세서

이 문서는 애플리케이션의 API 엔드포인트를 설명합니다.

---

# Auth (인증)

### POST /auth/register

- **설명**: 새로운 사용자를 등록(회원가입)합니다.
- **인증**: ❌
- **요청 본문 (Request Body)**:
    ```json
    {
        "username": "testuser",
        "password": "password123",
        "nickname": "Test User"
    }
    ```
- **응답 (201)**
    ```json
    {
        "user_id": 1,
        "username": "testuser",
        "nickname": "Test User",
        "created_at": "2025-11-12T12:00:00.000Z"
    }
    ```

### POST /auth/login

- **설명**: 사용자 로그인을 수행하고 JWT 토큰을 반환합니다.
- **인증**: ❌
- **요청 본문 (Request Body)**:
    ```json
    {
        "username": "testuser",
        "password": "password123"
    }
    ```
- **응답 (200)**
    ```json
    {
        "code": 200,
        "message": "토큰이 발급되었습니다.",
        "access_token": "your_jwt_token",
        "token_type": "Bearer",
        "user": {
            "user_id": 1,
            "username": "testuser",
            "nickname": "Test User"
        }
    }
    ```

### POST /auth/check-username

- **설명**: 사용자 이름(ID)의 중복 여부를 확인합니다.
- **인증**: ❌
- **요청 본문 (Request Body)**:
    ```json
    {
        "username": "testuser"
    }
    ```
- **응답 (200)**
    ```json
    {
        "available": true
    }
    ```

---

# Annotations (주석)

### GET /annotations

- **설명**: 특정 페이지 또는 교재(Textbook)에 대한 주석을 조회합니다.
- **인증**: ✅ (Bearer)
- **쿼리 파라미터 (Query Parameters)**:
    - `page_id` (integer): 주석을 조회할 페이지의 ID.
    - `textbook_id` (integer): 주석을 조회할 교재의 ID.
    *(참고: `page_id` 또는 `textbook_id` 중 하나는 반드시 제공되어야 합니다)*
- **응답 (200)**
    ```json
    {
        "success": true,
        "data": [
            {
                "annotation_id": 1,
                "user_id": 1,
                "page_id": 1,
                "annotation_type": "highlight",
                "content": "This is a highlighted text.",
                "location_data": {},
                "created_at": "2025-11-07T12:00:00.000Z"
            }
        ]
    }
    ```

### POST /annotations

- **설명**: 새로운 주석을 생성합니다.
- **인증**: ✅ (Bearer)
- **요청 본문 (Request Body)**:
    ```json
    {
        "page_id": 1,
        "annotation_type": "memo",
        "content": "This is a memo.",
        "location_data": {}
    }
    ```
- **응답 (201)**
    ```json
    {
        "success": true,
        "data": {
            "annotation_id": 2,
            "user_id": 1,
            "page_id": 1,
            "annotation_type": "memo",
            "content": "This is a memo.",
            "location_data": {},
            "created_at": "2025-11-07T12:05:00.000Z"
        }
    }
    ```

### PUT /annotations/:annotation_id

- **설명**: 기존 주석을 수정합니다.
- **인증**: ✅ (Bearer)
- **요청 본문 (Request Body)**:
    ```json
    {
        "page_id": 1,
        "annotation_type": "memo",
        "content": "This is an updated memo.",
        "location_data": {}
    }
    ```
- **응답 (200)**
    ```json
    {
        "success": true,
        "data": {
            "annotation_id": 2,
            "user_id": 1,
            "page_id": 1,
            "annotation_type": "memo",
            "content": "This is an updated memo.",
            "location_data": {},
            "created_at": "2025-11-07T12:05:00.000Z"
        }
    }
    ```

### DELETE /annotations/:annotation_id

- **설명**: 주석을 삭제합니다.
- **인증**: ✅ (Bearer)
- **응답 (204)**: 내용 없음 (No content).

---

# Dashboard (대시보드)

### GET /dashboard

- **설명**: 로그인한 사용자의 대시보드 데이터를 조회합니다.
- **인증**: ✅ (Bearer)
- **응답 (200)**
    ```json
    {
        "success": true,
        "data": {
            "enrollments": [
                {
                    "textbook_id": "some-uuid",
                    "title": "Math 101",
                    "author_id": 1,
                    "role": "student",
                    "last_accessed": "2025-11-12T12:00:00.000Z",
                    "progress_rate": 45.5,
                    "quiz_average_score": 85.0
                }
            ],
            "feedback": [],
            "stats": {
                "average_score": 85.0,
                "quizzes_taken": 5,
                "total_pages_read": 50
            },
            "teacher_textbooks": []
        }
    }
    ```

---

# Enrollments (수강 등록)

### POST /enrollments

- **설명**: 사용자를 교재에 등록(수강 신청)합니다.
- **인증**: ✅ (Bearer)
- **요청 본문 (Request Body)**:
    ```json
    {
        "textbook_id": 1,
        "role": "student"
    }
    ```
- **응답 (201)**
    ```json
    {
        "enrollment_id": 1,
        "role": "student",
        "created_at": "2025-11-12T12:00:00.000Z"
    }
    ```

---

# Learn (학습)

### POST /learn/reads

- **설명**: 사용자가 특정 페이지를 읽었음을 기록합니다.
- **인증**: ✅ (Bearer)
- **요청 본문 (Request Body)**:
    ```json
    {
        "page_id": 1
    }
    ```
- **응답 (201)**
    ```json
    {
        "read_id": 1
    }
    ```

---

# Quizzes (퀴즈)

### GET /quizzes/:quiz_id/questions

- **설명**: 특정 퀴즈의 문제 목록을 조회합니다.
- **인증**: ✅ (Bearer)
- **응답 (200)**
    ```json
    {
        "success": true,
        "data": [
            {
                "question_id": 1,
                "question_type": "multiple_choice",
                "question_content": "What is 2+2?",
                "options": ["3", "4", "5"],
                "question_order": 1
            }
        ]
    }
    ```

### POST /quizzes/:quiz_id/submit

- **설명**: 퀴즈의 답안을 제출합니다.
- **인증**: ✅ (Bearer)
- **요청 본문 (Request Body)**:
    ```json
    {
        "answers": [
            {
                "question_id": 1,
                "student_answer": "4"
            }
        ]
    }
    ```
- **응답 (200)**
    ```json
    {
        "success": true,
        "data": {
            "submission_id": 1,
            "score": 100,
            "results": [
                {
                    "question_id": 1,
                    "student_answer": "4",
                    "is_correct": true
                }
            ]
        }
    }
    ```

---

# Quiz Management (퀴즈 관리)

### POST /quiz-managements

- **설명**: 새로운 퀴즈를 생성합니다.
- **인증**: ✅ (Bearer)
- **요청 본문 (Request Body)**:
    ```json
    {
        "textbook_id": 1,
        "version": 1,
        "page_number": 1,
        "title": "New Quiz",
        "questions": [
            {
                "question_type": "multiple_choice",
                "question_content": "What is 2+2?",
                "options": ["3", "4", "5"],
                "correct_answer": "4",
                "explanation": "Because it is."
            }
        ]
    }
    ```
- **응답 (201)**
    ```json
    {
        "quiz_id": 1,
        "title": "New Quiz",
        "question_count": 1
    }
    ```

### GET /quiz-managements/:page_id

- **설명**: 특정 페이지에 연결된 퀴즈 목록을 조회합니다.
- **인증**: ✅ (Bearer)
- **응답 (200)**
    ```json
    [
        {
            "quiz_id": 1,
            "title": "New Quiz",
            "created_at": "2025-11-12T12:00:00.000Z",
            "question_id": 1,
            "question_type": "multiple_choice",
            "question_content": "What is 2+2?",
            "options": ["3", "4", "5"],
            "correct_answer": "4",
            "explanation": "Because it is.",
            "question_order": 1
        }
    ]
    ```

---

# Session (세션)

### POST /session/join

- **설명**: 초대 코드를 사용하여 세션(학습 그룹)에 참여합니다.
- **인증**: ✅ (Bearer)
- **요청 본문 (Request Body)**:
    ```json
    {
        "invitation_code": "some-code"
    }
    ```
- **응답 (200)**
    ```json
    {
        "success": true,
        "data": {
            "session_id": 1,
            "session_name": "Study Group",
            "textbook_id": 1
        }
    }
    ```

---

# Teacher (교사 기능)

### GET /teacher/:textbookId/students

- **설명**: 특정 교재의 학생 목록을 조회합니다.
- **인증**: ✅ (Bearer)
- **쿼리 파라미터 (Query Parameters)**:
    - `version` (integer): 교재의 버전.
    - `q` (string): 학생 이름 또는 사용자명 검색 쿼리.
    - `sort` (string): 정렬 기준 (`recent`: 최신순, `progress`: 진도율순, `name`: 이름순).
    - `order` (string): 정렬 순서 (`asc`: 오름차순 또는 `desc`: 내림차순).
    - `limit` (integer): 반환할 결과의 개수.
    - `offset` (integer): 페이지네이션을 위한 오프셋.
- **응답 (200)**
    ```json
    {
        "textbook_id": "some-uuid",
        "version": 1,
        "total_pages": 10,
        "total_students": 1,
        "students": [
            {
                "user_id": 1,
                "username": "student1",
                "nickname": "Student One",
                "last_accessed": "2025-11-12T12:00:00.000Z",
                "progress_pct": 50.0,
                "latest_score": null
            }
        ]
    }
    ```

---

# Textbook (교재)

### POST /textbooks

- **설명**: 새로운 교재를 생성합니다.
- **인증**: ✅ (Bearer)
- **요청 본문 (Request Body)**:
    ```json
    {
        "title": "New Textbook"
    }
    ```
- **응답 (201)**
    ```json
    {
        "textbookId": "some-uuid",
        "title": "New Textbook",
        "version": {
            "version_id": "some-uuid",
            "version": 1,
            "is_published": false,
            "created_at": "2025-11-12T12:00:00.000Z"
        }
    }
    ```

### PUT /textbooks/:textbookId

- **설명**: 교재의 제목을 수정합니다.
- **인증**: ✅ (Bearer, Teacher only)
- **요청 본문 (Request Body)**:
    ```json
    {
        "title": "Updated Textbook Title"
    }
    ```
- **응답 (200)**
    ```json
    {
        "textbook_id": "some-uuid",
        "title": "Updated Textbook Title",
        "updated_at": "2025-11-12T13:00:00.000Z"
    }
    ```

### GET /textbooks/mine

- **설명**: 사용자가 생성한 교재 목록을 조회합니다.
- **인증**: ✅ (Bearer)
- **응답 (200)**
    ```json
    [
        {
            "textbook_id": "some-uuid",
            "title": "New Textbook",
            "created_at": "2025-11-12T12:00:00.000Z",
            "latest_version": 1
        }
    ]
    ```

### POST /textbooks/:textbookId/versions

- **설명**: 교재의 새로운 버전을 생성합니다.
- **인증**: ✅ (Bearer)
- **요청 본문 (Request Body)**:
    ```json
    {
        "from_version": 1,
        "publish": false
    }
    ```
- **응답 (201)**
    ```json
    {
        "version_id": "some-uuid",
        "version": 2,
        "is_published": false,
        "created_at": "2025-11-12T12:00:00.000Z"
    }
    ```

### GET /textbooks/:textbookId/versions/:version/pages

- **설명**: 특정 교재 버전의 페이지 목록을 조회합니다.
- **인증**: ✅ (Bearer)
- **응답 (200)**
    ```json
    [
        {
            "page_id": 1,
            "page_number": 1,
            "content": "..."
        }
    ]
    ```

### POST /textbooks/:textbookId/versions/:version/pages

- **설명**: 교재 버전에 새로운 페이지를 생성합니다.
- **인증**: ✅ (Bearer)
- **요청 본문 (Request Body)**:
    ```json
    {
        "page_number": 2,
        "content": "..."
    }
    ```
- **응답 (201)**
    ```json
    {
        "page_id": 2,
        "page_number": 2,
        "content": "..."
    }
    ```
---

### DELETE /textbooks/pages/:pageId

- **설명**: 교재 페이지 삭제(해당 페이지에 연결된 퀴즈도 함께 삭제됩니다)
- **인증**: ✅ (Bearer)
- **요청 경로 파라미터**: pageId: 삭제할 페이지의 UUID
- **요청 본문 (Request Body)**: 없음
  - **응답 (200)**
    ```json
    {
        "deletedPageId": "페이지 UUID",
        "message": "page (and related quizzes) deleted"
    }
    ```
---

# WebRTC 시그널링 서버 API 명세서
**https://www.notion.so/WebRTC-API-2b433b8ab6f6804796fffd782ccc1221**
