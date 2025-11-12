import { register, login } from '../services/user.service.js';

export const registerController = async (req, res, next) => {
  try {
    const userData = req.body;
    const user = await register(userData);
    res.status(201).json(user);
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