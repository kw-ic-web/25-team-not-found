const express = require("express");
const router = express.Router();
const pool = require("../db");

//POST /api/learn/reads
//body: { page_id }

router.post("/reads", async (req, res) => {
  const client = await pool.connect();
  try {
    const { page_id } = req.body || {};
    if (!page_id) return res.status(400).json({ message: "page_id required" });

    const p = await client.query(
      `SELECT v.textbook_id
         FROM public.textbook_pages p
         JOIN public.textbook_versions v ON v.version_id=p.version_id
        WHERE p.page_id=$1`,
      [page_id]
    );
    if (p.rowCount === 0) return res.status(404).json({ message: "page not found" });
    const textbookId = p.rows[0].textbook_id;

    await client.query("BEGIN");

    const up = await client.query(
      `INSERT INTO public.page_reads (user_id, page_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, page_id)
       DO UPDATE SET
         last_read_at = now(),
         read_count   = public.page_reads.read_count + 1
       RETURNING read_id`,
      [req.user.user_id, page_id]
    );

    await client.query(
      `UPDATE public.enrollments
          SET last_accessed = now()
        WHERE user_id=$1 AND textbook_id=$2`,
      [req.user.user_id, textbookId]
    );

    await client.query("COMMIT");
    return res.status(201).json({ read_id: up.rows[0].read_id });
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("LEARN READ ERROR:", e);
    return res.status(500).json({ message: "학습기록 저장 실패" });
  } finally {
    client.release();
  }
});

module.exports = router;
