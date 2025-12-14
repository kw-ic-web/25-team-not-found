import { createUser, findUserByUsername, updateWeeklyGoal as repoUpdateWeeklyGoal } from '../repositories/user.repository.js';


import { hashPassword, comparePassword } from '../utils/hash.js';
import jwt from 'jsonwebtoken';

export const register = async (userData) => {
  const { username, password, nickname } = userData;

  if (!username || !password || !nickname) {
    throw new Error("username, password, nickname은 필수입니다.");
  }

  const existingUser = await findUserByUsername(username);
  if (existingUser) {
    throw new Error("이미 사용 중인 username입니다.");
  }

  const password_hash = await hashPassword(password);
  const newUser = await createUser(username, password_hash, nickname);

  return {
    user_id: newUser.user_id,
    username: newUser.username,
    nickname: newUser.nickname,
    created_at: newUser.created_at,
  };
};

export const updateWeeklyGoal = async (userId, weeklyGoal) => {
  if (weeklyGoal < 0) {
    throw new Error("Weekly goal cannot be negative");
  }
  return await repoUpdateWeeklyGoal(userId, weeklyGoal);
};

export const checkUsernameAvailability = async (username) => {
  if (!username) {
    throw new Error("username은 필수입니다.");
  }
  const user = await findUserByUsername(username);
  return { available: !user };
};

export const login = async (userData) => {
  const { username, password } = userData;

  if (!username || !password) {
    throw new Error("username과 password는 필수입니다.");
  }

  const user = await findUserByUsername(username);
  if (!user) {
    throw new Error("존재하지 않는 사용자입니다.");
  }

  const ok = await comparePassword(password, user.password_hash);
  if (!ok) {
    throw new Error("비밀번호가 일치하지 않습니다.");
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
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
      issuer: process.env.JWT_ISSUER || 'default_issuer',
    }
  );

  return {
    code: 200,
    message: "토큰이 발급되었습니다.",
    access_token: token,
    token_type: "Bearer",
    user: {
      user_id: user.user_id,
      username: user.username,
      nickname: user.nickname,
    },
  };
};