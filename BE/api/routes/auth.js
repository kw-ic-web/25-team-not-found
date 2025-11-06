const express = require("express");
const router = express.Router();
const pool = require("../db");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../utils/hash");

// 회원가입
// POST /auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, password, nickname } = req.body;

    if (!username || !password || !nickname) {
      return res.status(400).json({ message: "username, password, nickname은 필수입니다." });
    }

    // username 중복 체크
    const exist = await pool.query(
      "SELECT user_id FROM public.users WHERE username = $1",
      [username]
    );
    if (exist.rows.length > 0) {
      return res.status(409).json({ message: "이미 사용 중인 username입니다." });
    }

    const password_hash = await hashPassword(password);

    const result = await pool.query(
      `INSERT INTO public.users (username, password_hash, nickname)
       VALUES ($1, $2, $3)
       RETURNING user_id, username, nickname, created_at`,
      [username, password_hash, nickname]
    );

    const newUser = result.rows[0];

    return res.status(201).json({
      user_id: newUser.user_id,
      username: newUser.username,
      nickname: newUser.nickname,
      created_at: newUser.created_at,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ message: "서버 에러" });
  }
});

// 로그인
// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "username과 password는 필수입니다." });
    }

    // DB에서 사용자 조회
    const result = await pool.query(
      "SELECT user_id, username, password_hash, nickname FROM public.users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "존재하지 않는 사용자입니다." });
    }

    const user = result.rows[0];

    const ok = await comparePassword(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    const payload = {
      user_id: user.user_id,
      username: user.username,
      nickname: user.nickname,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
        issuer: process.env.JWT_ISSUER,
      }
    );

    return res.json({
      code: 200,
      message: "토큰이 발급되었습니다.",
      access_token: token,
      token_type: "Bearer",
      user: {
        user_id: user.user_id,
        username: user.username,
        nickname: user.nickname,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "서버 에러" });
  }
});

module.exports = router;