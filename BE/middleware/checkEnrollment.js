import pool from "../config/db.config.js";

/**
 * 교재에 등록(enrollment)되어 있는지 확인하는 미들웨어
 * 교재 작성자(author)이거나 enrollment가 있으면 통과
 */
async function checkEnrollment(req, res, next) {
    try {
        const textbookId = req.params.textbookId || req.body.textbook_id;
        if (!textbookId) {
            return res.status(400).json({ message: "textbookId가 필요합니다." });
        }

        // 1. 교재 작성자인지 확인
        const r1 = await pool.query(
            `SELECT 1 FROM public.textbooks WHERE textbook_id=$1 AND author_id=$2`,
            [textbookId, req.user.id]
        );
        if (r1.rowCount > 0) return next();

        // 2. enrollment가 있는지 확인 (role 상관없이)
        const r2 = await pool.query(
            `SELECT 1 FROM public.enrollments WHERE user_id=$1 AND textbook_id=$2`,
            [req.user.id, textbookId]
        );
        if (r2.rowCount === 0) {
            return res.status(403).json({ message: "해당 교재에 등록되지 않았습니다." });
        }

        return next();
    } catch (e) {
        console.error("checkEnrollment error:", e);
        return res.status(500).json({ message: "server error" });
    }
}

export default checkEnrollment;
