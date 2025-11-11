import pool from '../config/db.config.js';

export const createUser = async (username, password_hash, nickname) => {
  const result = await pool.query(
    `INSERT INTO public.users (username, password_hash, nickname)
     VALUES ($1, $2, $3)
     RETURNING user_id, username, nickname, created_at`,
    [username, password_hash, nickname]
  );
  return result.rows[0];
};

export const findUserByUsername = async (username) => {
  const result = await pool.query(
    "SELECT user_id, username, password_hash, nickname FROM public.users WHERE username = $1",
    [username]
  );
  return result.rows[0];
};
