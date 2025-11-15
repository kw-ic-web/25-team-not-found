const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const mime = require("mime-types");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const router = express.Router();
const db = require("../db");

const UPLOAD_ROOT = path.join(process.cwd(), "uploads");
const MAX_FILE_MB = Number(process.env.MAX_FILE_MB || 10);
const BASE_URL =
  process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
const PUBLIC_ROUTE = "/files";

fs.mkdirSync(UPLOAD_ROOT, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_ROOT);
  },
  filename: (req, file, cb) => {
    const ext =
      mime.extension(file.mimetype) ||
      path.extname(file.originalname).replace(".", "") ||
      "bin";
    const name = uuidv4().replace(/-/g, "");
    cb(null, `${name}.${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_MB * 1024 * 1024 },
});

// ===================================================================
// POST /api/file
// form-data: file, category?, id?
// ===================================================================
router.post("/", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "file 필드가 없습니다." });
    }

    const file = req.file;
    const relPath = path.relative(UPLOAD_ROOT, file.path).replace(/\\/g, "/");

    const category = req.body.category;
    const id = req.body.id || null;

    if (!category) {
      return res
        .status(400)
        .json({ message: "category 필드는 필수입니다." });
    }

    const sql = `
      INSERT INTO files (
        category, id,
        file_path, original_name, mime_type, size_bytes
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING file_id, file_path
    `;
    const params = [
      category,
      id,
      relPath,
      file.originalname,
      file.mimetype,
      file.size,
    ];

    const result = await db.query(sql, params);
    const row = result.rows[0];

    const url = `${BASE_URL}${PUBLIC_ROUTE}/${row.file_path}`;
    return res.status(201).json({ fileId: row.file_id, url });
  } catch (err) {
    next(err);
  }
});

// ===================================================================
// GET /api/file/by-target?category=...&id=...
//  - category: 필수
//  - id: 선택 (없으면 id IS NULL → main_banner 같은 케이스)
// ===================================================================
router.get("/by-target", async (req, res, next) => {
  try {
    const category = req.query.category;
    const id = req.query.id;

    if (!category) {
      return res.status(400).json({
        message: "category 쿼리 파라미터가 필요합니다.",
      });
    }

    let sql;
    let params;

    if (id === undefined) {
      // id 없는 경우 (main_banner 등)
      sql = `
        SELECT file_id, file_path
        FROM files
        WHERE category = $1
          AND id IS NULL
        ORDER BY file_id DESC
        LIMIT 1
      `;
      params = [category];
    } else {
      // id 있는 경우 (user_profile, textbook_cover 등)
      sql = `
        SELECT file_id, file_path
        FROM files
        WHERE category = $1
          AND id       = $2
        ORDER BY file_id DESC
        LIMIT 1
      `;
      params = [category, id];
    }

    const result = await db.query(sql, params);

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "해당 category/id에 해당하는 파일이 없습니다.",
      });
    }

    const row = result.rows[0];
    const url = `${BASE_URL}${PUBLIC_ROUTE}/${row.file_path}`;

    return res.json({
      fileId: row.file_id,
      url,
    });
  } catch (err) {
    next(err);
  }
});

// ===================================================================
// GET /api/file/:fileId
//  - PK(file_id)로 조회
// ===================================================================
router.get("/:fileId", async (req, res, next) => {
  try {
    const fileId = Number(req.params.fileId);

    const result = await db.query(
      "SELECT file_id, file_path FROM files WHERE file_id = $1",
      [fileId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "파일을 찾을 수 없습니다." });
    }

    const row = result.rows[0];
    const url = `${BASE_URL}${PUBLIC_ROUTE}/${row.file_path}`;

    return res.json({ fileId: row.file_id, url });
  } catch (err) {
    next(err);
  }
});

// ===================================================================
// DELETE /api/file/:fileId
// ===================================================================
router.delete("/:fileId", async (req, res, next) => {
  try {
    const fileId = Number(req.params.fileId);

    const select = await db.query(
      "SELECT file_path FROM files WHERE file_id = $1",
      [fileId]
    );

    if (select.rowCount === 0) {
      return res.status(404).json({ message: "파일을 찾을 수 없습니다." });
    }

    const filePath = select.rows[0].file_path;
    const absPath = path.join(UPLOAD_ROOT, filePath);

    await db.query("DELETE FROM files WHERE file_id = $1", [fileId]);

    fs.unlink(absPath, (err) => {
      if (err && err.code !== "ENOENT") {
        console.error("파일 삭제 실패:", err);
      }
    });

    return res.json({ message: "삭제되었습니다.", fileId });
  } catch (err) {
    next(err);
  }
});

module.exports = router;