[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/T3W3QeQp)

1. POST /api/file
설명: 파일을 업로드하고 DB에 저장합니다.
인증: ⛔ (필요 없음)
요청 형식: multipart/form-data
요청 필드 (Form Data)
{
  "file": "<업로드할 실제 파일>",
  "category": "user_profile | textbook_cover | page_content | main_banner | other",
  "id": "3" 
}

필드 설명
필드	타입	필수	설명
file	file(binary)	✅	업로드할 이미지·파일
category	string	✅	파일 용도
id	string/number	⛔	대상 ID (user_id, textbook_id 등) — main_banner는 생략
응답 (201 Created)
{
  "fileId": 1,
  "url": "http://localhost:3000/files/74b650d4bdb243c2ab955b3a54c443f3.jpg"
}

2. GET /api/file/by-target
설명: category + id 조합으로 최신 파일을 조회합니다.
인증: ⛔
요청 (Query Parameters)
{
  "category": "user_profile",
  "id": "3"
}

id 생략 예시 (main_banner)
{
  "category": "main_banner"
}

응답 (200 OK)
{
  "fileId": 1,
  "url": "http://localhost:3000/files/74b650d4bdb243c2ab955b3a54c443f3.jpg"
}

응답 (404 Not Found)
{
  "message": "해당 category/id에 해당하는 파일이 없습니다."
}

3. GET /api/file/{fileId}
설명: file_id(PK)로 파일 정보를 조회합니다.
인증: ⛔
요청 (Path Parameter)
{
  "fileId": 1
}

응답 (200 OK)
{
  "fileId": 1,
  "url": "http://localhost:3000/files/74b650d4bdb243c2ab955b3a54c443f3.jpg"
}

응답 (404 Not Found)
{
  "message": "파일을 찾을 수 없습니다."
}

4. DELETE /api/file/{fileId}
설명: 해당 file_id의 파일을 삭제합니다. (DB row + 실제 파일 삭제)
인증: ⛔ (필요 시 체크 로직 추가 가능)
요청 (Path Parameter)
{
  "fileId": 1
}

응답 (200 OK)
{
  "message": "삭제되었습니다.",
  "fileId": 1
}

응답 (404 Not Found)
{
  "message": "파일을 찾을 수 없습니다."
}

📌 category 값 설명(JSON)
{
  "user_profile": {
    "description": "유저 프로필 이미지",
    "id": "해당 유저의 user_id (예: 3)"
  },
  "textbook_cover": {
    "description": "교재 표지 이미지",
    "id": "textbook_id"
  },
  "page_content": {
    "description": "교재 페이지 내부 이미지",
    "id": "page_id"
  },
  "main_banner": {
    "description": "메인 배너 이미지",
    "id": "없음 (id 미전송)"
  },
  "other": {
    "description": "기타 용도",
    "id": "필요 시 전송"
  }
}
