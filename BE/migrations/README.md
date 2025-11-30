# Database Migrations

이 디렉토리는 데이터베이스 스키마 변경사항을 관리합니다.

## ⚠️ 참고사항

`001_add_editor_role.sql` 마이그레이션은 **더 이상 필요하지 않습니다**.

시스템이 변경되어 이제 **enrollment만 있으면 누구나 교재를 수정**할 수 있습니다.
- Student도 수정 가능
- Teacher도 수정 가능
- 교재 작성자(author)는 항상 수정 가능

## 권한 체계

| 역할                              | 권한                               |
| --------------------------------- | ---------------------------------- |
| **Author** (교재 작성자)          | 모든 권한 (enrollment 없어도 가능) |
| **Enrolled User** (등록된 사용자) | 교재 수정 권한 (role 상관없음)     |
| **Non-enrolled User**             | 권한 없음                          |

## Enrollment 생성

사용자가 교재를 수정할 수 있도록 하려면 enrollment만 추가하면 됩니다:

```sql
INSERT INTO enrollments (user_id, textbook_id, role)
VALUES (<user_id>, <textbook_id>, 'student');  -- role은 'student' 또는 'teacher' 모두 가능
```

Role은 이제 수정 권한과 무관하며, 다른 기능(예: 학생 관리)에만 영향을 줍니다.
