import pool from "../config/db.config.js";

function roleGuard(requiredRoles) {
  return async (req, res, next) => {
    try {
      const textbookId = req.params.textbookId || req.body.textbook_id;
      if (!textbookId) {
        return res.status(400).json({ message: "textbookId가 필요합니다." });
      }

      const r1 = await pool.query(
        `SELECT 1 FROM public.textbooks WHERE textbook_id=$1 AND author_id=$2`,
        [textbookId, req.user.id]
      );
      if (r1.rowCount > 0) return next();

      const r2 = await pool.query(
        `SELECT role FROM public.enrollments WHERE user_id=$1 AND textbook_id=$2`,
        [req.user.id, textbookId]
      );
      if (r2.rowCount === 0) {
        console.warn(`roleGuard: User ${req.user.id} not enrolled in textbook ${textbookId}`);
        return res.status(403).json({ message: "해당 교재에 등록되지 않았습니다." });
      }
      const role = r2.rows[0].role;
      if (!requiredRoles.includes(role)) {
        console.warn(`roleGuard: User ${req.user.id} has role ${role}, required ${requiredRoles}`);
        return res.status(403).json({ message: "권한이 없습니다." });
      }
      return next();
    } catch (e) {
      console.error("roleGuard error:", e);
      return res.status(500).json({ message: "server error" });
    }
  };
}

export default roleGuard;
