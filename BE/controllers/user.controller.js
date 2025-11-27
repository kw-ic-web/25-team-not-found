import { register, login, checkUsernameAvailability } from '../services/user.service.js';

export const registerController = async (req, res, next) => {
  try {
    const userData = req.body;
    const user = await register(userData);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const checkUsernameController = async (req, res, next) => {
  try {
    const { username } = req.body;
    const result = await checkUsernameAvailability(username);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const userData = req.body;
    const result = await login(userData);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};