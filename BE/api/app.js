const express = require("express");
const dotenv = require("dotenv");
const authRouter = require("./routes/auth");
const authMiddleware = require("./middlewares/authMiddleware");
const pool = require("./db");

const enrollmentsRouter = require("./routes/enrollments");
const textbooksRouter = require("./routes/textbooks");
const quizzesRouter = require("./routes/quizzes");
const teacherStudentsRouter = require("./routes/teacherStudents");
const learnRouter = require("./routes/learn");

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API 서버 살아있음");
});

app.use("/auth", authRouter);

app.get("/me", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT user_id, username, nickname, created_at, updated_at
       FROM public.users
       WHERE user_id = $1`,
      [req.user.user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error("ME ERROR:", err);
    return res.status(500).json({ message: "서버 에러" });
  }
});

app.use("/api/textbooks", authMiddleware, textbooksRouter);
app.use("/api/enrollments", authMiddleware, enrollmentsRouter);
app.use("/api/quizzes", authMiddleware, quizzesRouter);
app.use("/api/teacher", authMiddleware, teacherStudentsRouter);
app.use("/api/learn", authMiddleware, learnRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
