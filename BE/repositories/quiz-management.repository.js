import pool from "../config/db.config.js";

function toJsonb(v) {
  if (v === undefined || v === null) return null;
  if (typeof v === "string") return v;
  return JSON.stringify(v);
}

export const createQuiz = async (quizData, userId) => {
  const client = await pool.connect();
  try {
    const { textbook_id, version, page_number, title, questions = [] } = quizData;
    if (!textbook_id || !version || !page_number || !title) {
      throw new Error("필수값 누락: textbook_id, version, page_number, title");
    }

    const isAuthor = await pool.query(
      `SELECT 1 FROM public.textbooks WHERE textbook_id=$1 AND author_id=$2`,
      [textbook_id, userId]
    );
    let isTeacher = isAuthor.rowCount > 0;
    if (!isTeacher) {
      const r = await pool.query(
        `SELECT role FROM public.enrollments WHERE user_id=$1 AND textbook_id=$2`,
        [userId, textbook_id]
      );
      isTeacher = r.rowCount > 0 && r.rows[0].role === "teacher";
    }
    if (!isTeacher) throw new Error("교사만 퀴즈를 생성할 수 있습니다.");

    await client.query("BEGIN");

    const pageQuery = await client.query(
      // 논리적 page_id 조회 - 주의: 이후 p.original_page_id는 alias로 page_id를 가짐
      `SELECT p.page_id AS page_id
       FROM public.textbook_pages p
       JOIN public.textbook_versions v ON p.version_id=v.version_id
       WHERE v.textbook_id=$1 AND v.version=$2 AND p.page_number=$3`,
      [textbook_id, Number(version), Number(page_number)]
    );
    if (pageQuery.rowCount === 0) {
      await client.query("ROLLBACK");
      throw new Error("해당 페이지를 찾을 수 없습니다.");
    }
    const pageId = pageQuery.rows[0].page_id;

    const quizRes = await client.query(
      `INSERT INTO public.quizzes (page_id, author_id, title)
       VALUES ($1, $2, $3)
       RETURNING quiz_id, title, created_at`,
      [pageId, userId, title]
    );
    const quizId = quizRes.rows[0].quiz_id;

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      if (!q.question_type || !q.question_content || !q.correct_answer) {
        await client.query("ROLLBACK");
        throw new Error(`questions[${i}] 필수값 누락`);
      }
      if (q.question_type === "multiple_choice" && !Array.isArray(q.options)) {
        await client.query("ROLLBACK");
        throw new Error(`questions[${i}].options 는 배열이어야 합니다.`);
      }

      await client.query(
        `INSERT INTO public.quiz_questions
         (quiz_id, question_type, question_content, options, correct_answer, explanation, question_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          quizId,
          q.question_type,
          q.question_content,
          toJsonb(q.options),
          q.correct_answer,
          q.explanation || null,
          i + 1,
        ]
      );
    }

    await client.query("COMMIT");
    return {
      quiz_id: quizId,
      title,
      question_count: questions.length,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const getQuiz = async (page_id) => {
  try {
    const rows = await pool.query(
      `SELECT q.quiz_id, q.title, q.created_at,
              qq.question_id, qq.question_type, qq.question_content,
              qq.options, qq.correct_answer, qq.explanation, qq.question_order
       FROM public.quizzes q
       LEFT JOIN public.quiz_questions qq ON qq.quiz_id = q.quiz_id
       WHERE q.page_id = $1
       ORDER BY qq.question_order ASC`,
      [page_id]
    );
    if (rows.rowCount === 0) throw new Error("퀴즈가 없습니다.");
    return rows.rows;
  } catch (err) {
    throw err;
  }
};
