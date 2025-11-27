CREATE TYPE quiz_question_type AS ENUM (
  'fill_in_blank',
  'multiple_choice',
  'short_answer',
  'ox'
);

CREATE TYPE annotation_type AS ENUM (
  'memo',
  'highlight',
  'edit_suggestion'
);

CREATE TYPE session_status AS ENUM (
  'pending',
  'active',
  'ended'
);

CREATE TYPE user_role AS ENUM (
  'student',
  'teacher'
);

-- ============================================
-- 테이블 생성
-- ============================================

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nickname TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE textbooks (
  textbook_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id INTEGER,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE textbook_versions (
  version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  textbook_id UUID NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE textbook_pages (
  page_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version_id UUID NOT NULL,
  page_number INTEGER NOT NULL,
  content JSONB
);

CREATE TABLE enrollments (
  enrollment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER NOT NULL,
  textbook_id UUID NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  last_viewed_page_id UUID,
  last_accessed TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE quizzes (
  quiz_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL,
  author_id INTEGER,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE quiz_questions (
  question_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL,
  question_type quiz_question_type NOT NULL,
  question_content TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  question_order INTEGER DEFAULT 0
);

CREATE TABLE quiz_submissions (
  submission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL,
  user_id INTEGER NOT NULL,
  score NUMERIC,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE quiz_answers (
  answer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL,
  question_id UUID NOT NULL,
  student_answer TEXT,
  is_correct BOOLEAN
);

CREATE TABLE user_annotations (
  annotation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER NOT NULL,
  textbook_id UUID NOT NULL,
  page_id UUID NOT NULL,
  annotation_type annotation_type NOT NULL,
  content TEXT,
  location_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE sessions (
  session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id INTEGER NOT NULL,
  user_id INTEGER,
  textbook_id UUID NOT NULL,
  invitation_code TEXT UNIQUE,
  status session_status NOT NULL DEFAULT 'pending',
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ
);

CREATE TABLE teacher_feedback (
  feedback_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  feedback_content TEXT NOT NULL,
  related_textbook_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 인덱스 생성 (명시적 이름 지정)
-- ============================================

CREATE UNIQUE INDEX idx_textbook_versions_textbook_version 
  ON textbook_versions(textbook_id, version);
CREATE INDEX idx_textbook_versions_textbook_id 
  ON textbook_versions(textbook_id);

CREATE UNIQUE INDEX idx_textbook_pages_version_page 
  ON textbook_pages(version_id, page_number);
CREATE INDEX idx_textbook_pages_version_id 
  ON textbook_pages(version_id);

CREATE UNIQUE INDEX idx_enrollments_user_textbook 
  ON enrollments(user_id, textbook_id);
CREATE INDEX idx_enrollments_user_id 
  ON enrollments(user_id);
CREATE INDEX idx_enrollments_textbook_id 
  ON enrollments(textbook_id);

CREATE INDEX idx_quizzes_page_id 
  ON quizzes(page_id);

CREATE INDEX idx_quiz_questions_quiz_id 
  ON quiz_questions(quiz_id);

CREATE UNIQUE INDEX idx_quiz_submissions_quiz_user 
  ON quiz_submissions(quiz_id, user_id);

CREATE INDEX idx_quiz_answers_submission_id 
  ON quiz_answers(submission_id);

CREATE INDEX idx_user_annotations_user_page 
  ON user_annotations(user_id, page_id);

CREATE INDEX idx_sessions_teacher_id 
  ON sessions(teacher_id);
CREATE INDEX idx_sessions_user_id 
  ON sessions(user_id);

CREATE INDEX idx_teacher_feedback_user_id 
  ON teacher_feedback(user_id);

-- ============================================
-- 테이블/컬럼 주석
-- ============================================

COMMENT ON TABLE textbooks IS '교재의 메타 정보 (제목, 원작자 등)';
COMMENT ON COLUMN textbooks.author_id IS '교재의 원작성자';

COMMENT ON TABLE textbook_versions IS '교재의 특정 버전 (e.g., 1.0, 2.0). 교재 수정 이력 관리';

COMMENT ON TABLE textbook_pages IS '교재를 구성하는 개별 페이지';

COMMENT ON TABLE enrollments IS '사용자(학생/교사)의 교재 등록 및 역할 관리. 진도율은 API에서 계산';

COMMENT ON TABLE quizzes IS '교사가 생성한 퀴즈. 특정 교재의 페이지에 연결됨';
COMMENT ON COLUMN quizzes.author_id IS '퀴즈 생성자 (교사)';

COMMENT ON TABLE quiz_submissions IS '학생(user)이 퀴즈를 제출한 기록. (진도율 계산의 근거)';

COMMENT ON TABLE user_annotations IS '사용자가 특정 교재 페이지에 추가한 개인 메모, 하이라이트 등';
COMMENT ON COLUMN user_annotations.location_data IS '페이지 내의 정확한 위치 (좌표, 텍스트 범위, JSON 블록 ID)';

COMMENT ON COLUMN sessions.teacher_id IS '1:1 세션의 교사';
COMMENT ON COLUMN sessions.user_id IS '1:1 세션의 학생';

COMMENT ON COLUMN teacher_feedback.teacher_id IS '피드백 제공자 (교사)';
COMMENT ON COLUMN teacher_feedback.user_id IS '피드백 수신자 (학생)';

-- ============================================
-- 외래 키 제약 조건 (명시적 이름 지정)
-- ============================================

ALTER TABLE textbooks 
  ADD CONSTRAINT fk_textbooks_author
  FOREIGN KEY (author_id) 
  REFERENCES users(user_id) 
  ON DELETE SET NULL;

ALTER TABLE textbook_versions 
  ADD CONSTRAINT fk_textbook_versions_textbook
  FOREIGN KEY (textbook_id) 
  REFERENCES textbooks(textbook_id) 
  ON DELETE CASCADE;

ALTER TABLE textbook_pages 
  ADD CONSTRAINT fk_textbook_pages_version
  FOREIGN KEY (version_id) 
  REFERENCES textbook_versions(version_id) 
  ON DELETE CASCADE;

ALTER TABLE enrollments 
  ADD CONSTRAINT fk_enrollments_user
  FOREIGN KEY (user_id) 
  REFERENCES users(user_id) 
  ON DELETE CASCADE;

ALTER TABLE enrollments 
  ADD CONSTRAINT fk_enrollments_textbook
  FOREIGN KEY (textbook_id) 
  REFERENCES textbooks(textbook_id) 
  ON DELETE CASCADE;

ALTER TABLE enrollments 
  ADD CONSTRAINT fk_enrollments_last_viewed_page
  FOREIGN KEY (last_viewed_page_id) 
  REFERENCES textbook_pages(page_id) 
  ON DELETE SET NULL;

ALTER TABLE quizzes 
  ADD CONSTRAINT fk_quizzes_page
  FOREIGN KEY (page_id) 
  REFERENCES textbook_pages(page_id) 
  ON DELETE CASCADE;

ALTER TABLE quizzes 
  ADD CONSTRAINT fk_quizzes_author
  FOREIGN KEY (author_id) 
  REFERENCES users(user_id) 
  ON DELETE SET NULL;

ALTER TABLE quiz_questions 
  ADD CONSTRAINT fk_quiz_questions_quiz
  FOREIGN KEY (quiz_id) 
  REFERENCES quizzes(quiz_id) 
  ON DELETE CASCADE;

ALTER TABLE quiz_submissions 
  ADD CONSTRAINT fk_quiz_submissions_quiz
  FOREIGN KEY (quiz_id) 
  REFERENCES quizzes(quiz_id) 
  ON DELETE CASCADE;

ALTER TABLE quiz_submissions 
  ADD CONSTRAINT fk_quiz_submissions_user
  FOREIGN KEY (user_id) 
  REFERENCES users(user_id) 
  ON DELETE CASCADE;

ALTER TABLE quiz_answers 
  ADD CONSTRAINT fk_quiz_answers_submission
  FOREIGN KEY (submission_id) 
  REFERENCES quiz_submissions(submission_id) 
  ON DELETE CASCADE;

ALTER TABLE quiz_answers 
  ADD CONSTRAINT fk_quiz_answers_question
  FOREIGN KEY (question_id) 
  REFERENCES quiz_questions(question_id) 
  ON DELETE CASCADE;

ALTER TABLE user_annotations 
  ADD CONSTRAINT fk_user_annotations_user
  FOREIGN KEY (user_id) 
  REFERENCES users(user_id) 
  ON DELETE CASCADE;

ALTER TABLE user_annotations 
  ADD CONSTRAINT fk_user_annotations_textbook
  FOREIGN KEY (textbook_id) 
  REFERENCES textbooks(textbook_id) 
  ON DELETE CASCADE;

ALTER TABLE user_annotations 
  ADD CONSTRAINT fk_user_annotations_page
  FOREIGN KEY (page_id) 
  REFERENCES textbook_pages(page_id) 
  ON DELETE CASCADE;

ALTER TABLE sessions 
  ADD CONSTRAINT fk_sessions_teacher
  FOREIGN KEY (teacher_id) 
  REFERENCES users(user_id) 
  ON DELETE CASCADE;

ALTER TABLE sessions 
  ADD CONSTRAINT fk_sessions_user
  FOREIGN KEY (user_id) 
  REFERENCES users(user_id) 
  ON DELETE SET NULL;

ALTER TABLE sessions 
  ADD CONSTRAINT fk_sessions_textbook
  FOREIGN KEY (textbook_id) 
  REFERENCES textbooks(textbook_id);

ALTER TABLE teacher_feedback 
  ADD CONSTRAINT fk_teacher_feedback_teacher
  FOREIGN KEY (teacher_id) 
  REFERENCES users(user_id) 
  ON DELETE CASCADE;

ALTER TABLE teacher_feedback 
  ADD CONSTRAINT fk_teacher_feedback_user
  FOREIGN KEY (user_id) 
  REFERENCES users(user_id) 
  ON DELETE CASCADE;

ALTER TABLE teacher_feedback 
  ADD CONSTRAINT fk_teacher_feedback_textbook
  FOREIGN KEY (related_textbook_id) 
  REFERENCES textbooks(textbook_id) 
  ON DELETE SET NULL;

-- ⚠️ Document 2의 잘못된 외래 키는 제거됨
-- ALTER TABLE "users" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("username"); -- ❌ 삭제됨

-- ============================================
-- 트리거 함수 (updated_at 자동 갱신)
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- users 테이블 트리거
CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- textbooks 테이블 트리거
CREATE TRIGGER trigger_textbooks_updated_at
  BEFORE UPDATE ON textbooks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- user_annotations 테이블 트리거
CREATE TRIGGER trigger_user_annotations_updated_at
  BEFORE UPDATE ON user_annotations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 학습 기록 테이블 (Learn)
-- ============================================

CREATE TABLE page_reads (
  read_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  page_id UUID NOT NULL,
  read_count INTEGER DEFAULT 1,
  last_read_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_page_reads_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_page_reads_page FOREIGN KEY (page_id) REFERENCES textbook_pages(page_id) ON DELETE CASCADE,
  UNIQUE (user_id, page_id)
);
