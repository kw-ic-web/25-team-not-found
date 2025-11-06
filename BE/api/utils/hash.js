const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

// 비밀번호를 해시해서 저장
async function hashPassword(plainPassword) {
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
}

// 로그인 시 입력한 비번이 맞는지 비교
async function comparePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = { hashPassword, comparePassword };