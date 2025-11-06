const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /api/teacher/:textbookId/students
router.get("/:textbookId/students", async (req, res) => {
  const client = await pool.connect();
  try {
    const textbookId = req.params.textbookId;

    const version   = req.query.version ? parseInt(req.query.version, 10) : null;
    const q         = req.query.q ? String(req.query.q) : null;
    const sort      = (req.query.sort || "recent").toLowerCase();
    const order     = (req.query.order || "desc").toLowerCase();
    const limit     = req.query.limit ? parseInt(req.query.limit, 10) : 20;
    const offset    = req.query.offset ? parseInt(req.query.offset, 10) : 0;

    const sortColumn = (() => {
      if (sort === "progress") return "progress_pct";
      if (sort === "name")     return "u.nickname";
      return "e.last_accessed";
    })();
    const sortDirection = order === "asc" ? "ASC" : "DESC";

    const pagesCountSql = `
      SELECT COUNT(*)::int AS total_pages
      FROM textbook_pages p
      JOIN textbook_versions v ON v.version_id = p.version_id
      WHERE v.textbook_id = $1::uuid
        AND ($2::int IS NULL OR v.version = $2::int)
    `;
    const { rows: pcRows } = await client.query(pagesCountSql, [textbookId, version]);
    const totalPages = pcRows[0]?.total_pages ?? 0;

    const sql = `
      WITH latest_version AS (
        SELECT MAX(version) AS ver
        FROM textbook_versions
        WHERE textbook_id = $1::uuid
      ),
      target_version AS (
        SELECT CASE WHEN $2::int IS NOT NULL
                    THEN $2::int
                    ELSE (SELECT ver FROM latest_version)
               END AS ver
      ),
      pages AS (
        SELECT p.page_id
        FROM textbook_pages p
        JOIN textbook_versions v ON v.version_id = p.version_id
        WHERE v.textbook_id = $1::uuid
          AND v.version = (SELECT ver FROM target_version)
      ),
      reads AS (
        -- ⚠️ 여기서 읽기 로그 테이블은 'page_reads' 로 사용
        SELECT pr.user_id, COUNT(DISTINCT pr.page_id)::int AS read_pages
        FROM page_reads pr
        JOIN pages pg ON pg.page_id = pr.page_id
        GROUP BY pr.user_id
      )
      SELECT
        e.user_id,
        u.username,
        u.nickname,
        e.last_accessed,
        CASE WHEN $3::int = 0 THEN 0
             ELSE ROUND(COALESCE(r.read_pages, 0) * 100.0 / $3::int, 1)
        END AS progress_pct,
        NULL::numeric AS latest_score
      FROM enrollments e
      JOIN users u ON u.user_id = e.user_id
      LEFT JOIN reads r ON r.user_id = e.user_id
      WHERE e.textbook_id = $1::uuid
        AND e.role = 'student'
        AND ($4::text IS NULL
             OR u.nickname ILIKE '%' || $4::text || '%'
             OR u.username ILIKE '%' || $4::text || '%')
      ORDER BY ${sortColumn} ${sortDirection}, u.user_id ASC
      LIMIT $5::int OFFSET $6::int
    `;

    const params = [
      textbookId,
      version,
      totalPages,
      q,
      limit,
      offset
    ];

    const { rows } = await client.query(sql, params);

    return res.json({
      textbook_id: textbookId,
      version: version ?? "latest",
      total_pages: totalPages,
      total_students: rows.length,
      students: rows,
    });
  } catch (e) {
    console.error("TEACHER LIST ERROR:", e);
    return res.status(500).json({ message: "학생 목록 조회 실패" });
  } finally {
    client.release();
  }
});

module.exports = router;
