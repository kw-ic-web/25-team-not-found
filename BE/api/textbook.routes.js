import { Router } from 'express';
import pool from '../config/db.config.js';
import roleGuard from '../middleware/roleGuard.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.post("/", authMiddleware, async (req, res) => {
  const client = await pool.connect();
  try {
    const { title } = req.body || {};
    if (!title || !String(title).trim()) {
      return res.status(400).json({ message: "title is required" });
    }

    await client.query("BEGIN");

    const r1 = await client.query(
      `INSERT INTO public.textbooks (author_id, title)
       VALUES ($1, $2)
       RETURNING textbook_id, title, created_at`,
      [req.user.user_id, title.trim()]
    );
    const textbookId = r1.rows[0].textbook_id;

    const r2 = await client.query(
      `INSERT INTO public.textbook_versions (textbook_id, version, is_published)
       VALUES ($1, 1, false)
       RETURNING version_id, version, is_published, created_at`,
      [textbookId]
    );

    await client.query(
      `INSERT INTO public.enrollments (user_id, textbook_id, role)
       VALUES ($1, $2, 'teacher')
       ON CONFLICT (user_id, textbook_id) DO NOTHING`,
      [req.user.user_id, textbookId]
    );

    await client.query("COMMIT");
    return res.status(201).json({
      textbookId,
      title: r1.rows[0].title,
      version: r2.rows[0],
    });
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("CREATE TEXTBOOK ERROR:", e);
    return res.status(500).json({ message: "create textbook failed" });
  } finally {
    client.release();
  }
});

router.get("/mine", authMiddleware, async (req, res) => {
  try {
    const r = await pool.query(
      `SELECT t.textbook_id, t.title, t.created_at,
              (SELECT MAX(version) FROM public.textbook_versions v WHERE v.textbook_id=t.textbook_id) AS latest_version
       FROM public.textbooks t
       WHERE t.author_id = $1
       ORDER BY t.created_at DESC`,
      [req.user.user_id]
    );
    return res.json(r.rows);
  } catch (e) {
    console.error("LIST MY TEXTBOOKS ERROR:", e);
    return res.status(500).json({ message: "list failed" });
  }
});

router.post("/:textbookId/versions", authMiddleware, roleGuard(["teacher"]), async (req, res) => {
  const client = await pool.connect();
  try {
    const { textbookId } = req.params;
    const { from_version, publish } = req.body || {};
    await client.query("BEGIN");

    const rMax = await client.query(
      `SELECT COALESCE(MAX(version),0)+1 AS nextv FROM public.textbook_versions WHERE textbook_id=$1`,
      [textbookId]
    );
    const nextVersion = rMax.rows[0].nextv;

    const rV = await client.query(
      `INSERT INTO public.textbook_versions (textbook_id, version, is_published)
       VALUES ($1, $2, $3)
       RETURNING version_id, version, is_published, created_at`,
      [textbookId, nextVersion, !!publish]
    );

    if (from_version) {
      const rFrom = await client.query(
        `SELECT v.version_id
         FROM public.textbook_versions v
         WHERE v.textbook_id=$1 AND v.version=$2`,
        [textbookId, from_version]
      );
      if (rFrom.rowCount > 0) {
        const fromVid = rFrom.rows[0].version_id;
        const toVid = rV.rows[0].version_id;
        await client.query(
          `INSERT INTO public.textbook_pages (version_id, page_number, content)
           SELECT $1, p.page_number, p.content
           FROM public.textbook_pages p
           WHERE p.version_id=$2`,
          [toVid, fromVid]
        );
      }
    }

    await client.query("COMMIT");
    return res.status(201).json(rV.rows[0]);
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("CREATE VERSION ERROR:", e);
    return res.status(500).json({ message: "create version failed" });
  } finally {
    client.release();
  }
});

router.get("/:textbookId/versions/:version/pages", authMiddleware, roleGuard(["student", "teacher"]), async (req, res) => {
  try {
    const { textbookId, version } = req.params;
    const r = await pool.query(
      `SELECT p.page_id, p.page_number, p.content
       FROM public.textbook_pages p
       JOIN public.textbook_versions v ON p.version_id = v.version_id
       WHERE v.textbook_id=$1 AND v.version=$2
       ORDER BY p.page_number ASC`,
      [textbookId, Number(version)]
    );
    return res.json(r.rows);
  } catch (e) {
    console.error("LIST PAGES ERROR:", e);
    return res.status(500).json({ message: "list pages failed" });
  }
});

router.post("/:textbookId/versions/:version/pages", authMiddleware, roleGuard(["teacher"]), async (req, res) => {
  try {
    const { textbookId, version } = req.params;
    const { page_number, content } = req.body || {};
    if (typeof page_number !== "number") {
      return res.status(400).json({ message: "page_number(number) required" });
    }

    const rV = await pool.query(
      `SELECT version_id FROM public.textbook_versions WHERE textbook_id=$1 AND version=$2`,
      [textbookId, Number(version)]
    );
    if (rV.rowCount === 0) return res.status(404).json({ message: "version not found" });

    const r = await pool.query(
      `INSERT INTO public.textbook_pages (version_id, page_number, content)
       VALUES ($1, $2, $3)
       RETURNING page_id, page_number, content`,
      [rV.rows[0].version_id, page_number, content || null]
    );
    return res.status(201).json(r.rows[0]);
  } catch (e) {
    console.error("CREATE PAGE ERROR:", e);
    return res.status(500).json({ message: "create page failed" });
  }
});

router.put("/:textbookId", authMiddleware, roleGuard(["teacher"]), async (req, res) => {
  try {
    const { textbookId } = req.params;
    const { title } = req.body || {};
    if (!title || !String(title).trim()) {
      return res.status(400).json({ message: "title is required" });
    }

    const r = await pool.query(
      `UPDATE public.textbooks
       SET title = $1, updated_at = now()
       WHERE textbook_id = $2 AND author_id = $3
       RETURNING textbook_id, title, updated_at`,
      [title.trim(), textbookId, req.user.user_id]
    );

    if (r.rowCount === 0) {
      return res.status(404).json({ message: "textbook not found or unauthorized" });
    }

    return res.json(r.rows[0]);
  } catch (e) {
    console.error("UPDATE TEXTBOOK ERROR:", e);
    return res.status(500).json({ message: "update textbook failed" });
  }
});

router.put("/:textbookId/versions/:version/pages/:pageId", authMiddleware, roleGuard(["teacher"]), async (req, res) => {
  try {
    const { textbookId, version, pageId } = req.params;
    const { content } = req.body || {};

    // Verify ownership via textbook
    const rAuth = await pool.query(
      `SELECT t.textbook_id
       FROM public.textbooks t
       WHERE t.textbook_id = $1 AND t.author_id = $2`,
      [textbookId, req.user.user_id]
    );
    if (rAuth.rowCount === 0) return res.status(403).json({ message: "unauthorized" });

    const r = await pool.query(
      `UPDATE public.textbook_pages
       SET content = $1
       WHERE page_id = $2
       RETURNING page_id, page_number, content`,
      [content, pageId]
    );

    if (r.rowCount === 0) {
      return res.status(404).json({ message: "page not found" });
    }

    return res.json(r.rows[0]);
  } catch (e) {
    console.error("UPDATE PAGE ERROR:", e);
    return res.status(500).json({ message: "update page failed" });
  }
});

router.delete(
  "/pages/:pageId",
  authMiddleware,
  roleGuard(["teacher"]),
  async (req, res) => {
    const client = await pool.connect();
    try {
      const { pageId } = req.params;

      await client.query("BEGIN");

      const rCheck = await client.query(
        `
        SELECT t.textbook_id
        FROM public.textbook_pages p
        JOIN public.textbook_versions v ON p.version_id = v.version_id
        JOIN public.textbooks t ON v.textbook_id = t.textbook_id
        WHERE p.page_id = $1
          AND t.author_id = $2
        `,
        [pageId, req.user.user_id]
      );

      if (rCheck.rowCount === 0) {
        await client.query("ROLLBACK");
        return res
          .status(404)
          .json({ message: "page not found or unauthorized" });
      }

      const rDel = await client.query(
        `
        DELETE FROM public.textbook_pages
        WHERE page_id = $1
        RETURNING page_id
        `,
        [pageId]
      );

      await client.query("COMMIT");

      return res.json({
        deletedPageId: rDel.rows[0].page_id,
        message: "page (and related quizzes) deleted",
      });
    } catch (e) {
      await client.query("ROLLBACK");
      console.error("DELETE PAGE ERROR:", e);
      return res.status(500).json({ message: "delete page failed" });
    } finally {
      client.release();
    }
  }
);

export default router;