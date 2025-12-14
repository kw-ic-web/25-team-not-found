import { register, login, checkUsernameAvailability, updateWeeklyGoal } from '../services/user.service.js';

export const updateWeeklyGoalController = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { weekly_goal } = req.body;
    if (typeof weekly_goal !== 'number') {
      return res.status(400).json({ message: 'weekly_goal must be a number' });
    }
    const updatedUser = await updateWeeklyGoal(userId, weekly_goal);
    res.json({ weekly_goal_hours: updatedUser.weekly_goal_hours });
  } catch (error) {
    next(error);
  }
};


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