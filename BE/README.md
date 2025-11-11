# API Documentation

This document outlines the API endpoints for the application.

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

# Textbook

### GET /api/textbooks/:textbook_id/pages/:page_number

- **Description**: Retrieves the content of a specific page in a textbook.
- **Authentication**: ✅ (Bearer)
- **Response (200)**
    ```json
    {
        "success": true,
        "data": {
            "page_id": 1,
            "page_number": 1,
            "content": "..."
        }
    }
    ```
