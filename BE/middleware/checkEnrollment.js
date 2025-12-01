import pool from "../config/db.config.js";

/**
 * 교재에 등록(enrollment)되어 있는지 확인하는 미들웨어
 * 교재 작성자(author)이거나 enrollment가 있으면 통과
 */
async function checkEnrollment(req, res, next) {
    try {
        const textbookId = req.params.textbookId || req.body.textbook_id;
        if (!textbookId) {
            console.error("checkEnrollment: textbookId missing", { params: req.params, body: req.body });
            return res.status(400).json({ message: "textbookId가 필요합니다." });
        }

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(textbookId)) {
            return res.status(400).json({ message: "Invalid textbookId format (UUID required)" });
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
            console.warn(`checkEnrollment: User ${req.user.id} not enrolled in textbook ${textbookId}`);
            return res.status(403).json({ message: "해당 교재에 등록되지 않았습니다." });
        }

        return next();
    } catch (e) {
        console.error("checkEnrollment error:", e);
        return res.status(500).json({ message: "server error", error: e.message, stack: e.stack });
    }
}

export default checkEnrollment;
