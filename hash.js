import bcrypt from 'bcryptjs';

const saltRounds = 10;

/**
 * Hashes a password using bcrypt.
 * @param {string} password - The password to hash.
 * @returns {Promise<string>} The hashed password.
 */
export const hashPassword = (password) => {
  return bcrypt.hash(password, saltRounds);
};

/**
 * Compares a plaintext password with a hash.
 * @param {string} password - The plaintext password.
 * @param {string} hash - The hash to compare against.
 * @returns {Promise<boolean>} True if the password matches the hash.
 */
export const comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash);
};
