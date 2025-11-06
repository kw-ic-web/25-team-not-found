const express = require("express");
const router = express.Router();
const pool = require("../db");


//POST /api/enrollments
//body: { textbook_id, role: 'student'|'teacher' }

router.post("/", async (req, res) => {
  try {
    const { textbook_id, role } = req.body || {};
    if (!textbook_id) return res.status(400).json({ message: "textbook_id required" });
    const myRole = role === "teacher" ? "teacher" : "student";

    const r = await pool.query(
      `INSERT INTO public.enrollments (user_id, textbook_id, role)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, textbook_id) DO NOTHING
       RETURNING enrollment_id, role, created_at`,
      [req.user.user_id, textbook_id, myRole]
    );
    if (r.rowCount === 0) {
      return res.status(409).json({ message: "이미 등록되어 있습니다." });
    }
    return res.status(201).json(r.rows[0]);
  } catch (e) {
    console.error("enroll error:", e);
    return res.status(500).json({ message: "server error" });
  }
});

module.exports = router;
