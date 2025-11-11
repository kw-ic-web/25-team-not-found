# API Documentation

This document outlines the API endpoints for the application.

---

# Auth

### POST /api/auth/register

- **Description**: Registers a new user.
- **Authentication**: ❌
- **Request Body**:
    ```json
    {
        "username": "testuser",
        "password": "password123",
        "nickname": "Test User"
    }
    ```
- **Response (201)**
    ```json
    {
        "user_id": 1,
        "username": "testuser",
        "nickname": "Test User",
        "created_at": "2025-11-12T12:00:00.000Z"
    }
    ```

### POST /api/auth/login

- **Description**: Logs in a user and returns a JWT token.
- **Authentication**: ❌
- **Request Body**:
    ```json
    {
        "username": "testuser",
        "password": "password123"
    }
    ```
- **Response (200)**
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

# Annotations

### GET /api/annotations

- **Description**: Retrieves annotations for a specific page or textbook.
- **Authentication**: ✅ (Bearer)
- **Query Parameters**:
    - `page_id` (integer): The ID of the page to get annotations for.
    - `textbook_id` (integer): The ID of the textbook to get annotations for.
    *(Note: Either `page_id` or `textbook_id` must be provided)*
- **Response (200)**
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

### POST /api/annotations

- **Description**: Creates a new annotation.
- **Authentication**: ✅ (Bearer)
- **Request Body**:
    ```json
    {
        "page_id": 1,
        "annotation_type": "memo",
        "content": "This is a memo.",
        "location_data": {}
    }
    ```
- **Response (201)**
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

### PUT /api/annotations/:annotation_id

- **Description**: Updates an existing annotation.
- **Authentication**: ✅ (Bearer)
- **Request Body**:
    ```json
    {
        "page_id": 1,
        "annotation_type": "memo",
        "content": "This is an updated memo.",
        "location_data": {}
    }
    ```
- **Response (200)**
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

### DELETE /api/annotations/:annotation_id

- **Description**: Deletes an annotation.
- **Authentication**: ✅ (Bearer)
- **Response (204)**: No content.

---

# Dashboard

### GET /api/dashboard

- **Description**: Retrieves dashboard data for the logged-in user.
- **Authentication**: ✅ (Bearer)
- **Response (200)**
    ```json
    {
        "success": true,
        "data": {
            "recent_textbooks": [],
            "ongoing_sessions": []
        }
    }
    ```

---

# Enrollments

### POST /api/enrollments

- **Description**: Enrolls a user in a textbook.
- **Authentication**: ✅ (Bearer)
- **Request Body**:
    ```json
    {
        "textbook_id": 1,
        "role": "student"
    }
    ```
- **Response (201)**
    ```json
    {
        "enrollment_id": 1,
        "role": "student",
        "created_at": "2025-11-12T12:00:00.000Z"
    }
    ```

---

# Learn

### POST /api/learn/reads

- **Description**: Records that a user has read a page.
- **Authentication**: ✅ (Bearer)
- **Request Body**:
    ```json
    {
        "page_id": 1
    }
    ```
- **Response (201)**
    ```json
    {
        "read_id": 1
    }
    ```

---

# Quizzes

### GET /api/quizzes/:quiz_id/questions

- **Description**: Retrieves the questions for a specific quiz.
- **Authentication**: ✅ (Bearer)
- **Response (200)**
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

### POST /api/quizzes/:quiz_id/submit

- **Description**: Submits answers for a quiz.
- **Authentication**: ✅ (Bearer)
- **Request Body**:
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
- **Response (200)**
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

# Quiz Management

### POST /api/quiz-managements

- **Description**: Creates a new quiz.
- **Authentication**: ✅ (Bearer)
- **Request Body**:
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
- **Response (201)**
    ```json
    {
        "quiz_id": 1,
        "title": "New Quiz",
        "question_count": 1
    }
    ```

### GET /api/quiz-managements/:page_id

- **Description**: Retrieves quizzes for a specific page.
- **Authentication**: ✅ (Bearer)
- **Response (200)**
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

# Session

### POST /api/session/join

- **Description**: Joins a session using an invitation code.
- **Authentication**: ✅ (Bearer)
- **Request Body**:
    ```json
    {
        "invitation_code": "some-code"
    }
    ```
- **Response (200)**
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

# Teacher

### GET /api/teacher/:textbookId/students

- **Description**: Retrieves a list of students for a specific textbook.
- **Authentication**: ✅ (Bearer)
- **Query Parameters**:
    - `version` (integer): The version of the textbook.
    - `q` (string): Search query for student name or username.
    - `sort` (string): `recent`, `progress`, or `name`.
    - `order` (string): `asc` or `desc`.
    - `limit` (integer): Number of results to return.
    - `offset` (integer): Offset for pagination.
- **Response (200)**
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

# Textbook

### POST /api/textbooks

- **Description**: Creates a new textbook.
- **Authentication**: ✅ (Bearer)
- **Request Body**:
    ```json
    {
        "title": "New Textbook"
    }
    ```
- **Response (201)**
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

### GET /api/textbooks/mine

- **Description**: Retrieves a list of textbooks created by the user.
- **Authentication**: ✅ (Bearer)
- **Response (200)**
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

### POST /api/textbooks/:textbookId/versions

- **Description**: Creates a new version of a textbook.
- **Authentication**: ✅ (Bearer)
- **Request Body**:
    ```json
    {
        "from_version": 1,
        "publish": false
    }
    ```
- **Response (201)**
    ```json
    {
        "version_id": "some-uuid",
        "version": 2,
        "is_published": false,
        "created_at": "2025-11-12T12:00:00.000Z"
    }
    ```

### GET /api/textbooks/:textbookId/versions/:version/pages

- **Description**: Retrieves the pages of a specific textbook version.
- **Authentication**: ✅ (Bearer)
- **Response (200)**
    ```json
    [
        {
            "page_id": 1,
            "page_number": 1,
            "content": "..."
        }
    ]
    ```

### POST /api/textbooks/:textbookId/versions/:version/pages

- **Description**: Creates a new page in a textbook version.
- **Authentication**: ✅ (Bearer)
- **Request Body**:
    ```json
    {
        "page_number": 2,
        "content": "..."
    }
    ```
- **Response (201)**
    ```json
    {
        "page_id": 2,
        "page_number": 2,
        "content": "..."
    }
    ```